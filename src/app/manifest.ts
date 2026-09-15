import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bhumi Enterprise",
    short_name: "Bhumi Enterprise",
    description:
      "Battery sales, free battery installation, battery checkup and WiFi assistance in Bahadurgarh.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f8f5",
    theme_color: "#059669",
    orientation: "portrait-primary",
    categories: [
      "business",
      "shopping",
      "utilities",
    ],
    icons: [
      {
        src: "/bhumi-logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}