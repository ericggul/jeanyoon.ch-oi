import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo/site";
import { siteDescriptions } from "@/lib/seo/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: siteDescriptions.en,
    start_url: "/oi",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
