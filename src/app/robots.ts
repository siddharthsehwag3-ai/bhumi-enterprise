import type { MetadataRoute } from "next";
import { createAbsoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
        ],
      },
    ],
    sitemap: createAbsoluteUrl("/sitemap.xml"),
    host: createAbsoluteUrl("/"),
  };
}