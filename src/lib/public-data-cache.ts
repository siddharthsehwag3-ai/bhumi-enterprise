import "server-only";

import { unstable_cache } from "next/cache";

import {
  getPublishedBatteryCategories,
  getPublishedBatteryCategory,
  getPublishedProductsByCategory,
} from "@/lib/battery-database";

import {
  getPublishedWifiServices,
  getPublishedWifiService,
} from "@/lib/wifi-database";

import { getSiteSettings } from "@/lib/site-settings";

export const getCachedSiteSettings = unstable_cache(
  async () => getSiteSettings(),
  ["public-site-settings"],
  {
    revalidate: 3600,
    tags: ["site-settings"],
  },
);

export const getCachedBatteryCategories = unstable_cache(
  async () => getPublishedBatteryCategories(),
  ["public-battery-categories"],
  {
    revalidate: 3600,
    tags: ["battery-catalogue"],
  },
);

export const getCachedBatteryCategory = unstable_cache(
  async (slug: string) =>
    getPublishedBatteryCategory(slug),
  ["public-battery-category"],
  {
    revalidate: 3600,
    tags: ["battery-catalogue"],
  },
);

export const getCachedBatteryProducts = unstable_cache(
  async (categorySlug: string) =>
    getPublishedProductsByCategory(categorySlug),
  ["public-battery-products"],
  {
    revalidate: 3600,
    tags: ["battery-catalogue"],
  },
);

export const getCachedWifiServices = unstable_cache(
  async () => getPublishedWifiServices(),
  ["public-wifi-services"],
  {
    revalidate: 3600,
    tags: ["wifi-services"],
  },
);

export const getCachedWifiService = unstable_cache(
  async (slug: string) =>
    getPublishedWifiService(slug),
  ["public-wifi-service"],
  {
    revalidate: 3600,
    tags: ["wifi-services"],
  },
);