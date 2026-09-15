import "server-only";

import { getDatabase } from "@/lib/db";
import {
  wifiServiceCategories,
  type WifiQuestion,
  type WifiService,
} from "@/data/wifi-services";

type WifiServiceRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  description: string;
  supported_isp: string;
  published: boolean;
  sort_order: number;
};

type WifiQuestionRow = {
  id: string;
  service_id: string;
  field_key: string;
  label: string;
  placeholder: string;
  field_type: WifiQuestion["type"];
  options: unknown;
  required: boolean;
  sort_order: number;
  published: boolean;
};

export type AdminWifiService = WifiService & {
  databaseId: string;
  supportedIsp: string;
  published: boolean;
  sortOrder: number;
};

function normalizeOptions(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((option): option is string => typeof option === "string")
    .map((option) => option.trim())
    .filter(Boolean);
}

function mapQuestion(row: WifiQuestionRow): WifiQuestion {
  return {
    id: row.field_key,
    label: row.label,
    placeholder: row.placeholder,
    required: row.required,
    type: row.field_type,
    options: normalizeOptions(row.options),
  };
}

function mapService(
  service: WifiServiceRow,
  questions: WifiQuestionRow[],
): AdminWifiService {
  return {
    databaseId: service.id,
    slug: service.slug,
    title: service.title,
    shortTitle: service.short_title,
    description: service.description,
    supportedIsp: service.supported_isp,
    published: service.published,
    sortOrder: service.sort_order,
    questions: questions
      .filter((question) => question.service_id === service.id)
      .sort((first, second) => first.sort_order - second.sort_order)
      .map(mapQuestion),
  };
}

/**
 * Copies the current TypeScript WiFi catalogue into Neon only when the
 * wifi_services table is empty. It never overwrites later admin edits.
 */
export async function seedWifiServicesIfEmpty() {
  const sql = getDatabase();

  const countRows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::integer AS count
    FROM wifi_services
  `;

  if (countRows[0]?.count > 0) {
    return;
  }

  await sql.begin(async (transaction) => {
    for (
      let serviceIndex = 0;
      serviceIndex < wifiServiceCategories.length;
      serviceIndex += 1
    ) {
      const service = wifiServiceCategories[serviceIndex];

      const insertedServices = await transaction<{ id: string }[]>`
        INSERT INTO wifi_services (
          slug,
          title,
          short_title,
          description,
          supported_isp,
          published,
          sort_order
        )
        VALUES (
          ${service.slug},
          ${service.title},
          ${service.shortTitle},
          ${service.description},
          'Airtel',
          TRUE,
          ${serviceIndex}
        )
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title
        RETURNING id
      `;

      const serviceId = insertedServices[0].id;

      for (
        let questionIndex = 0;
        questionIndex < service.questions.length;
        questionIndex += 1
      ) {
        const question = service.questions[questionIndex];

        await transaction`
          INSERT INTO wifi_questions (
            service_id,
            field_key,
            label,
            placeholder,
            field_type,
            options,
            required,
            sort_order,
            published
          )
          VALUES (
            ${serviceId}::uuid,
            ${question.id},
            ${question.label},
            ${question.placeholder},
            ${question.type},
            ${transaction.json(question.options ?? [])},
            ${question.required},
            ${questionIndex},
            TRUE
          )
          ON CONFLICT (service_id, field_key)
          DO NOTHING
        `;
      }
    }
  });
}

export async function getAdminWifiServices() {
  await seedWifiServicesIfEmpty();

  const sql = getDatabase();

  const services = await sql<WifiServiceRow[]>`
    SELECT
      id,
      slug,
      title,
      short_title,
      description,
      supported_isp,
      published,
      sort_order
    FROM wifi_services
    ORDER BY sort_order, title
  `;

  const questions = await sql<WifiQuestionRow[]>`
    SELECT
      id,
      service_id,
      field_key,
      label,
      placeholder,
      field_type,
      options,
      required,
      sort_order,
      published
    FROM wifi_questions
    ORDER BY sort_order, label
  `;

  return services.map((service) =>
    mapService(
      service,
      questions.filter((question) => question.published),
    ),
  );
}

export async function getPublishedWifiServices() {
  const services = await getAdminWifiServices();

  return services.filter((service) => service.published);
}

export async function getPublishedWifiService(slug: string) {
  const services = await getPublishedWifiServices();

  return (
    services.find((service) => service.slug === slug) ?? null
  );
}

export function createFieldKey(label: string) {
  const words = label
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean);

  if (words.length === 0) {
    return `question${Date.now()}`;
  }

  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();

      if (index === 0) {
        return lowerWord;
      }

      return (
        lowerWord.charAt(0).toUpperCase() +
        lowerWord.slice(1)
      );
    })
    .join("");
}

export function createSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseQuestionOptions(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((option) => option.trim())
    .filter(Boolean)
    .filter(
      (option, index, options) =>
        options.indexOf(option) === index,
    );
}