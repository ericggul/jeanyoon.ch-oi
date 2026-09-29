import { artworks } from "@/content/artworks";
import type { Artwork, Locale } from "@/content/artworks/types";

import { artworkDiscovery } from "./artwork-content";

export function artworkText(artwork: Artwork, locale: Locale) {
  const text = artwork.content?.[locale] ?? (locale === "ko" ? artworkDiscovery[artwork.slug]?.ko : undefined);
  return text?.title.trim() && text.summary.trim() && text.paragraphs.some((p) => p.trim()) ? text : undefined;
}
export function artworkPath(artwork: Artwork, locale: Locale) {
  return `/oi/artworks/${artwork.slug}${locale === "en" ? "" : "/ko"}`;
}
export function artworkLocales(artwork: Artwork) {
  return (["en", "ko"] as const).filter((locale) => artworkText(artwork, locale));
}
export function publishedArtworks(locale: Locale) {
  return artworks.filter((artwork) => artworkText(artwork, locale));
}
