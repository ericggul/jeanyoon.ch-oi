import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_LAUNCHED !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  const site = process.env.SITE_URL || "https://jeanyoon.ch";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.replace(/\/$/, "")}/sitemap.xml`,
  };
}
