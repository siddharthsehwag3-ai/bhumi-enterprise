import type { MetadataRoute } from "next";
import {
  getPublishedBatteryCategories,
} from "@/lib/battery-database";
import {
  getPublishedWifiServices,
} from "@/lib/wifi-database";
import { createAbsoluteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();

  const fixedPages: MetadataRoute.Sitemap = [
    {
      url: createAbsoluteUrl("/"),
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: createAbsoluteUrl("/batteries"),
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: createAbsoluteUrl("/wifi-services"),
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: createAbsoluteUrl("/reviews"),
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: createAbsoluteUrl("/contact"),
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [batteryCategories, wifiServices] =
      await Promise.all([
        getPublishedBatteryCategories(),
        getPublishedWifiServices(),
      ]);

    const batteryPages: MetadataRoute.Sitemap =
      batteryCategories.map((category) => ({
        url: createAbsoluteUrl(
          `/batteries/${category.slug}`,
        ),
        lastModified: generatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const wifiPages: MetadataRoute.Sitemap =
      wifiServices.map((service) => ({
        url: createAbsoluteUrl(
          `/wifi-services/${service.slug}`,
        ),
        lastModified: generatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    return [
      ...fixedPages,
      ...batteryPages,
      ...wifiPages,
    ];
  } catch (error) {
    console.error(
      "Could not add database pages to sitemap:",
      error,
    );

    return fixedPages;
  }
}