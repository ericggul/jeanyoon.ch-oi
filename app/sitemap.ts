import type { MetadataRoute } from "next";
import { artworks } from "@/content/artworks";
import { absoluteUrl } from "@/lib/seo/site";
import { profileLanguages } from "@/lib/seo/metadata";
import { artworkLocales, artworkPath } from "@/lib/seo/artworks";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/oi", "/oi/en", "/oi/ko"].map((path) => ({ url: absoluteUrl(path), alternates: { languages: profileLanguages } })),
    ...artworks.flatMap((artwork) => {
      const available = artworkLocales(artwork);
      const languages = Object.fromEntries(available.map((lang) => [lang, absoluteUrl(artworkPath(artwork, lang))]));
      return available.map((lang) => ({
        url: absoluteUrl(artworkPath(artwork, lang)),
        alternates: { languages },
        ...(artwork.updated ? { lastModified: artwork.updated } : {}),
        ...(artwork.image ? { images: [absoluteUrl(artwork.image)] } : {}),
      }));
    }),
  ];
}
