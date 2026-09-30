import type { MetadataRoute } from "next";
import rootSitemap from "../sitemap";

// Same sitemap at /oi/sitemap.xml: a Search Console URL-prefix property for
// https://jeanyoon.ch/oi/ only accepts sitemaps located under /oi/.
export default function sitemap(): MetadataRoute.Sitemap {
  return rootSitemap();
}
