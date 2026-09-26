import type { Metadata } from "next";
import { profile } from "@/content/profile";
import type { Artwork, Locale } from "@/content/artworks/types";
import { absoluteUrl } from "./site";
import { artworkLocales, artworkPath, artworkText } from "./artworks";

export const profileLanguages = {
  en: absoluteUrl("/oi/en"), ko: absoluteUrl("/oi/ko"), "x-default": absoluteUrl("/oi"),
};
export function pageMetadata({ title, description, path, locale = "en", languages, image }: {
  title: string; description: string; path: string; locale?: Locale;
  languages?: Record<string, string>; image?: { url: string; alt: string };
}): Metadata {
  const preview = image ?? { url: absoluteUrl("/share-image"), alt: "Jeanyoon Choi — Interactive & Computational Art" };
  return {
    title: { absolute: title }, description,
    alternates: { canonical: absoluteUrl(path), ...(languages ? { languages } : {}) },
    openGraph: { type: "website", siteName: profile.name, url: absoluteUrl(path), title, description,
      locale: locale === "ko" ? "ko_KR" : "en_US", images: [preview] },
    twitter: { card: "summary_large_image", title, description, images: [preview] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}
export function profileMetadata(locale: Locale) {
  return pageMetadata({ ...profile[locale], path: `/oi/${locale}`, locale, languages: profileLanguages });
}
export function artworkMetadata(artwork: Artwork, locale: Locale) {
  const text = artworkText(artwork, locale)!;
  return pageMetadata({
    title: `${text.title} — ${locale === "ko" ? `${profile.koreanName} (${profile.name})` : profile.name}`, description: text.summary,
    path: artworkPath(artwork, locale), locale,
    languages: Object.fromEntries(artworkLocales(artwork).map((language) => [language, absoluteUrl(artworkPath(artwork, language))])),
    image: artwork.image ? { url: absoluteUrl(artwork.image), alt: text.imageAlt || text.title } : undefined,
  });
}
