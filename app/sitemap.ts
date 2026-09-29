import type { MetadataRoute } from "next";
import { artworks } from "@/content/artworks";
import { absoluteUrl } from "@/lib/seo/site";
import { profileLanguages } from "@/lib/seo/metadata";
import { artworkLocales, artworkPath } from "@/lib/seo/artworks";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/oi", "/oi/en", "/oi/ko"].map((path) => ({ url: absoluteUrl(path), alternates: { languages: profileLanguages } })),
    { url: absoluteUrl("/oi/cv") },
    ...artworks.flatMap((artwork) => {
      const available = artworkLocales(artwork);
      const languages = Object.fromEntries(available.map((lang) => [lang, absoluteUrl(artworkPath(artwork, lang))]));
      return available.map((lang) => ({
        url: absoluteUrl(artworkPath(artwork, lang)),
        alternates: { languages },
        ...(artwork.updated ? { lastModified: artwork.updated } : {}),
        ...((artwork.images?.length || artwork.image) ? { images: artwork.images?.length ? artwork.images.map((image) => absoluteUrl(image.src)) : [absoluteUrl(artwork.image!)] } : {}),
      }));
    }),
  ];
}
