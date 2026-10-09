import type { MetadataRoute } from "next";
import { artworks } from "@/content/artworks";
import { absoluteUrl } from "@/lib/seo/site";
import { profileLanguages } from "@/lib/seo/metadata";
import { artworkLocales, artworkPath, artworkText } from "@/lib/seo/artworks";
import { collections, entryList, entryPath } from "@/lib/seo/collections";
import { experiments } from "@/content/experiments";
import { research } from "@/content/research";
import { profile } from "@/content/about";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/oi", "/oi/en", "/oi/ko"].map((path) => ({ url: absoluteUrl(path), alternates: { languages: profileLanguages } })),
    { url: absoluteUrl("/oi/cv") },
    ...research.flatMap((entry) => entry.kind !== "manuscript" && entry.recordPath
      ? [{ url: absoluteUrl(entry.recordPath), ...(entry.published ? { lastModified: entry.published } : {}) }] : []),
    ...collections.flatMap((collection) => [
      { url: absoluteUrl(`/oi/${collection}`) },
      ...entryList(collection).map((entry) => {
        const images = collection === "experiments" ? experiments.find((item) => item.slug === entry.slug)?.images ?? [] : [];
        return {
          url: absoluteUrl(entryPath(collection, entry.slug)),
          // Only texts carry a real day-level date; years/periods are not revision dates.
          ...(collection === "texts" ? { lastModified: entry.date } : {}),
          ...(images.length ? { images: images.map((image) => absoluteUrl(image.src)) } : {}),
        };
      }),
    ]),
    ...artworks.flatMap((artwork) => {
      const available = artworkLocales(artwork);
      const languages = Object.fromEntries(available.map((lang) => [lang, absoluteUrl(artworkPath(artwork, lang))]));
      return available.map((lang) => ({
        url: absoluteUrl(artworkPath(artwork, lang)),
        alternates: { languages },
        ...(artwork.updated ? { lastModified: artwork.updated } : {}),
        ...((artwork.images?.length || artwork.image) ? { images: artwork.images?.length ? artwork.images.map((image) => absoluteUrl(image.src)) : [absoluteUrl(artwork.image!)] } : {}),
        // Video sitemap entry (title/description from the page's own text).
        ...(artwork.video && artwork.image ? { videos: [{
          title: `${artworkText(artwork, lang)!.title} (${artwork.year}) — ${profile.name}`,
          thumbnail_loc: absoluteUrl(artwork.image),
          description: artworkText(artwork, lang)!.summary.slice(0, 2048),
        }] } : {}),
      }));
    }),
  ];
}
