import "server-only";

import { getDatabase } from "@/lib/db";

export type SiteSettings = {
  businessName: string;
  businessTagline: string;
  phoneInternational: string;
  phoneDisplay: string;
  whatsappNumber: string;
  publicEmail: string;
  address: string;
  mapsSearchQuery: string;
  businessHours: string;
  supportedIsp: string;
  establishedYear: string;
};

export const defaultSiteSettings: SiteSettings = {
  businessName: "Bhumi Enterprise",
  businessTagline:
    "Trusted Distributor of Tata Green, Geon and Amaron Batteries",
  phoneInternational: "+918130886600",
  phoneDisplay: "81308 86600",
  whatsappNumber: "918130886600",
  publicEmail: "bhumienterprises9100@gmail.com",
  address:
    "Opp. ITI, Main Jhajjar Road, Bahadurgarh, Haryana 124507",
  mapsSearchQuery:
    "Opp ITI Main Jhajjar Road Bahadurgarh Haryana 124507",
  businessHours: "Open 24 hours, 7 days",
  supportedIsp: "Airtel",
  establishedYear: "2022",
};

type SettingRow = {
  setting_value: unknown;
};

function textValue(
  value: unknown,
  fallback: string,
  maximumLength: number,
) {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.trim().slice(0, maximumLength);

  return cleaned || fallback;
}

function normalizeSettings(value: unknown): SiteSettings {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return defaultSiteSettings;
  }

  const record = value as Record<string, unknown>;

  return {
    businessName: textValue(
      record.businessName,
      defaultSiteSettings.businessName,
      120,
    ),
    businessTagline: textValue(
      record.businessTagline,
      defaultSiteSettings.businessTagline,
      300,
    ),
    phoneInternational: textValue(
      record.phoneInternational,
      defaultSiteSettings.phoneInternational,
      30,
    ),
    phoneDisplay: textValue(
      record.phoneDisplay,
      defaultSiteSettings.phoneDisplay,
      30,
    ),
    whatsappNumber: textValue(
      record.whatsappNumber,
      defaultSiteSettings.whatsappNumber,
      30,
    ).replace(/[^\d]/g, ""),
    publicEmail: textValue(
      record.publicEmail,
      defaultSiteSettings.publicEmail,
      200,
    ).toLowerCase(),
    address: textValue(
      record.address,
      defaultSiteSettings.address,
      500,
    ),
    mapsSearchQuery: textValue(
      record.mapsSearchQuery,
      defaultSiteSettings.mapsSearchQuery,
      500,
    ),
    businessHours: textValue(
      record.businessHours,
      defaultSiteSettings.businessHours,
      200,
    ),
    supportedIsp: textValue(
      record.supportedIsp,
      defaultSiteSettings.supportedIsp,
      100,
    ),
    establishedYear: textValue(
      record.establishedYear,
      defaultSiteSettings.establishedYear,
      10,
    ),
  };
}

export async function ensureSiteSettings() {
  const sql = getDatabase();

  await sql`
    INSERT INTO site_settings (
      setting_key,
      setting_value,
      description
    )
    VALUES (
      'business_profile',
      ${sql.json(defaultSiteSettings)},
      'Central public contact and business information'
    )
    ON CONFLICT (setting_key)
    DO NOTHING
  `;
}

export async function getSiteSettings() {
  await ensureSiteSettings();

  const sql = getDatabase();

  const rows = await sql<SettingRow[]>`
    SELECT setting_value
    FROM site_settings
    WHERE setting_key = 'business_profile'
    LIMIT 1
  `;

  return normalizeSettings(rows[0]?.setting_value);
}

export async function saveSiteSettings(
  settings: SiteSettings,
) {
  const sql = getDatabase();
  const normalized = normalizeSettings(settings);

  await sql`
    INSERT INTO site_settings (
      setting_key,
      setting_value,
      description,
      updated_at
    )
    VALUES (
      'business_profile',
      ${sql.json(normalized)},
      'Central public contact and business information',
      NOW()
    )
    ON CONFLICT (setting_key)
    DO UPDATE SET
      setting_value = EXCLUDED.setting_value,
      description = EXCLUDED.description,
      updated_at = NOW()
  `;

  return normalized;
}

export function createMapsDirectionsUrl(
  settings: SiteSettings,
) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    settings.mapsSearchQuery,
  )}`;
}

export function createMapsEmbedUrl(
  settings: SiteSettings,
) {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    settings.mapsSearchQuery,
  )}&output=embed`;
}

export function createWhatsappUrl(
  settings: SiteSettings,
  message: string,
) {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`;
}