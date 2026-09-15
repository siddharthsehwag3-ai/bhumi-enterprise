import "server-only";

import { getDatabase } from "@/lib/db";
import {
  batteryCategories,
  batteryProducts,
  type BatteryCategory,
  type BatteryProduct,
  type ProductStatus,
} from "@/data/batteries";

type BatteryCategoryRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  description: string;
  finder_type: "vehicle" | "application";
  sort_order: number;
  published: boolean;
};

type BatteryProductRow = {
  id: string;
  category_slug: string;
  brand: BatteryProduct["brand"];
  name: string;
  model: string;
  description: string;
  image_path: string;
  capacity_ah: string | number | null;
  voltage: string | number | null;
  warranty: string;
  mrp: string | number | null;
  price: string | number | null;
  status: ProductStatus;
  published: boolean;
  featured: boolean;
  sort_order: number;
  price_checked_on: string | Date | null;
};

type CompatibilityRow = {
  battery_id: string;
  vehicle_model_id: string;
  make_name: string;
  model_name: string;
  fuel_type: string;
  variant: string;
  year_from: number | null;
  year_to: number | null;
  recommended: boolean;
  notes: string;
};

export type VehicleCompatibility = {
  vehicleModelId: string;
  make: string;
  model: string;
  fuelType: string;
  variant: string;
  yearFrom: number | null;
  yearTo: number | null;
  recommended: boolean;
  notes: string;
};

export type DatabaseBatteryCategory = BatteryCategory & {
  databaseId: string;
  sortOrder: number;
  published: boolean;
};

export type DatabaseBatteryProduct = BatteryProduct & {
  databaseId: string;
  featured: boolean;
  sortOrder: number;
  vehicleCompatibility: VehicleCompatibility[];
};

function numberValue(value: string | number | null) {
  if (value === null) {
    return 0;
  }

  const result = Number(value);

  return Number.isFinite(result) ? result : 0;
}

function dateValue(value: string | Date | null) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function mapCategory(
  row: BatteryCategoryRow,
): DatabaseBatteryCategory {
  return {
    databaseId: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title,
    description: row.description,
    finderType: row.finder_type,
    sortOrder: row.sort_order,
    published: row.published,
  };
}

function mapProduct(
  row: BatteryProductRow,
  compatibility: VehicleCompatibility[],
): DatabaseBatteryProduct {
  const searchableCompatibility = compatibility.map((vehicle) =>
    [
      vehicle.make,
      vehicle.model,
      vehicle.fuelType,
      vehicle.variant,
      vehicle.yearFrom,
      vehicle.yearTo,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return {
    databaseId: row.id,
    id: row.id,
    category: row.category_slug,
    brand: row.brand,
    name: row.name,
    model: row.model,
    description: row.description,
    image: row.image_path,
    capacityAh: numberValue(row.capacity_ah),
    voltage: numberValue(row.voltage),
    warranty: row.warranty,
    mrp: numberValue(row.mrp),
    price: numberValue(row.price),
    priceCheckedOn: dateValue(row.price_checked_on),
    compatibility: searchableCompatibility,
    published: row.published,
    status: row.status,
    featured: row.featured,
    sortOrder: row.sort_order,
    vehicleCompatibility: compatibility,
  };
}

/**
 * Imports the TypeScript battery catalogue only when Neon contains
 * no battery records. Existing admin changes are never overwritten.
 */
export async function seedBatteryCatalogueIfEmpty() {
  const sql = getDatabase();

  const productCounts = await sql<{ count: number }[]>`
    SELECT COUNT(*)::integer AS count
    FROM batteries
  `;

  if (productCounts[0]?.count > 0) {
    return;
  }

  await sql.begin(async (transaction) => {
    const categoryIds = new Map<string, string>();

    for (
      let categoryIndex = 0;
      categoryIndex < batteryCategories.length;
      categoryIndex += 1
    ) {
      const category = batteryCategories[categoryIndex];

      const categoryRows = await transaction<{ id: string }[]>`
        INSERT INTO battery_categories (
          slug,
          title,
          short_title,
          description,
          finder_type,
          sort_order,
          published
        )
        VALUES (
          ${category.slug},
          ${category.title},
          ${category.shortTitle},
          ${category.description},
          ${category.finderType},
          ${categoryIndex},
          TRUE
        )
        ON CONFLICT (slug)
        DO UPDATE SET
          title = EXCLUDED.title,
          short_title = EXCLUDED.short_title,
          description = EXCLUDED.description,
          finder_type = EXCLUDED.finder_type
        RETURNING id
      `;

      categoryIds.set(category.slug, categoryRows[0].id);
    }

    for (
      let productIndex = 0;
      productIndex < batteryProducts.length;
      productIndex += 1
    ) {
      const product = batteryProducts[productIndex];
      const categoryId = categoryIds.get(product.category);

      if (!categoryId) {
        continue;
      }

      await transaction`
        INSERT INTO batteries (
          category_id,
          brand,
          name,
          model,
          description,
          image_path,
          capacity_ah,
          voltage,
          warranty,
          mrp,
          price,
          status,
          published,
          featured,
          sort_order,
          price_checked_on
        )
        VALUES (
          ${categoryId}::uuid,
          ${product.brand},
          ${product.name},
          ${product.model},
          ${product.description},
          ${product.image},
          ${
            product.capacityAh > 0
              ? product.capacityAh
              : null
          },
          ${product.voltage > 0 ? product.voltage : null},
          ${product.warranty},
          ${product.mrp > 0 ? product.mrp : null},
          ${product.price > 0 ? product.price : null},
          ${product.status},
          ${product.published},
          FALSE,
          ${productIndex},
          ${
            product.priceCheckedOn
              ? product.priceCheckedOn
              : null
          }
        )
        ON CONFLICT (category_id, brand, model)
        DO NOTHING
      `;
    }
  });
}

export async function getAllBatteryCategories() {
  await seedBatteryCatalogueIfEmpty();

  const sql = getDatabase();

  const rows = await sql<BatteryCategoryRow[]>`
    SELECT
      id,
      slug,
      title,
      short_title,
      description,
      finder_type,
      sort_order,
      published
    FROM battery_categories
    ORDER BY sort_order, title
  `;

  return rows.map(mapCategory);
}

export async function getPublishedBatteryCategories() {
  const categories = await getAllBatteryCategories();

  return categories.filter((category) => category.published);
}

export async function getPublishedBatteryCategory(slug: string) {
  const categories = await getPublishedBatteryCategories();

  return (
    categories.find((category) => category.slug === slug) ?? null
  );
}

export async function getAllBatteryProducts() {
  await seedBatteryCatalogueIfEmpty();

  const sql = getDatabase();

  const [productRows, compatibilityRows] = await Promise.all([
    sql<BatteryProductRow[]>`
      SELECT
        batteries.id,
        battery_categories.slug AS category_slug,
        batteries.brand,
        batteries.name,
        batteries.model,
        batteries.description,
        batteries.image_path,
        batteries.capacity_ah,
        batteries.voltage,
        batteries.warranty,
        batteries.mrp,
        batteries.price,
        batteries.status,
        batteries.published,
        batteries.featured,
        batteries.sort_order,
        batteries.price_checked_on
      FROM batteries
      INNER JOIN battery_categories
        ON battery_categories.id = batteries.category_id
      ORDER BY
        battery_categories.sort_order,
        batteries.sort_order,
        batteries.name
    `,

    sql<CompatibilityRow[]>`
      SELECT
        battery_compatibility.battery_id,
        vehicle_models.id AS vehicle_model_id,
        vehicle_makes.name AS make_name,
        vehicle_models.name AS model_name,
        vehicle_models.fuel_type,
        vehicle_models.variant,
        vehicle_models.year_from,
        vehicle_models.year_to,
        battery_compatibility.recommended,
        battery_compatibility.notes
      FROM battery_compatibility
      INNER JOIN vehicle_models
        ON vehicle_models.id =
          battery_compatibility.vehicle_model_id
      INNER JOIN vehicle_makes
        ON vehicle_makes.id = vehicle_models.make_id
      WHERE
        vehicle_models.published = TRUE
        AND vehicle_makes.published = TRUE
      ORDER BY
        vehicle_makes.sort_order,
        vehicle_makes.name,
        vehicle_models.sort_order,
        vehicle_models.name
    `,
  ]);

  const compatibilityByBattery = new Map<
    string,
    VehicleCompatibility[]
  >();

  for (const row of compatibilityRows) {
    const existing =
      compatibilityByBattery.get(row.battery_id) ?? [];

    existing.push({
      vehicleModelId: row.vehicle_model_id,
      make: row.make_name,
      model: row.model_name,
      fuelType: row.fuel_type,
      variant: row.variant,
      yearFrom: row.year_from,
      yearTo: row.year_to,
      recommended: row.recommended,
      notes: row.notes,
    });

    compatibilityByBattery.set(row.battery_id, existing);
  }

  return productRows.map((row) =>
    mapProduct(
      row,
      compatibilityByBattery.get(row.id) ?? [],
    ),
  );
}

export async function getPublishedProductsByCategory(
  categorySlug: string,
) {
  const products = await getAllBatteryProducts();

  return products.filter(
    (product) =>
      product.category === categorySlug &&
      product.published &&
      product.status !== "hidden" &&
      product.status !== "draft" &&
      product.status !== "discontinued",
  );
}