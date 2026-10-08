import type { Metadata } from "next";
import { profile } from "@/content/about";
import type { Artwork, Locale } from "@/content/artworks/types";
import { absoluteUrl, detailTitle, HOME_TITLE, SITE_NAME } from "./site";
import { artworkLocales, artworkPath, artworkText } from "./artworks";

import { artworkDiscovery } from "./artwork-content";
import { enrichment } from "./enrichment";

export const siteDescriptions = {
  en: "Jeanyoon Choi (최정윤, Jean-Yoon Choi): computational artist and KAIST PhD candidate creating interactive multi-device web artworks about AI, complex systems and society.",
  ko: "최정윤(Jeanyoon Choi)의 복잡계 인터랙티브 아트. 휴대전화와 스크린을 연결해 AI와 사회 시스템의 복잡성을 탐구하는 멀티 디바이스 웹 아트워크, 전시 이미지와 연구를 만나보세요.",
};

export const profileLanguages = {
  en: absoluteUrl("/oi/en"), ko: absoluteUrl("/oi/ko"), "x-default": absoluteUrl("/oi"),
};
// Machine-readable alternates advertised in <head>: the texts feed everywhere, plus a
// page's Markdown version when it has one (lib/seo/markdown.ts).
const feed = { "application/atom+xml": [{ url: absoluteUrl("/oi/feed.xml"), title: SITE_NAME }] };
export function pageMetadata({ description, path, locale = "en", languages, image, title = SITE_NAME, markdown }: {
  description: string; path: string; locale?: Locale; title?: string;
  languages?: Record<string, string>; image?: { url: string; alt: string }; markdown?: boolean;
}): Metadata {
  const preview = image ?? { url: absoluteUrl("/share-image"), alt: SITE_NAME };
  return {
    title: { absolute: title }, description,
    alternates: { canonical: absoluteUrl(path), ...(languages ? { languages } : {}),
      types: { ...feed, ...(markdown ? { "text/markdown": absoluteUrl(`${path}.md`) } : {}) } },
    openGraph: { type: "website", siteName: SITE_NAME, url: absoluteUrl(path), title, description,
      locale: locale === "ko" ? "ko_KR" : "en_US", images: [preview] },
    twitter: { card: "summary_large_image", title, description, images: [preview] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}
export function profileMetadata(locale: Locale) {
  return pageMetadata({ description: siteDescriptions[locale], path: `/oi/${locale}`, locale, languages: profileLanguages, title: HOME_TITLE });
}
export function artworkMetadata(artwork: Artwork, locale: Locale) {
  const text = artworkText(artwork, locale)!;
  return pageMetadata({
    description: locale === "en" ? artworkDiscovery[artwork.slug]?.description ?? enrichment("artworks", artwork.slug)?.description ?? text.summary : text.summary,
    path: artworkPath(artwork, locale), locale, title: detailTitle(text.title), markdown: locale === "en",
    languages: { ...Object.fromEntries(artworkLocales(artwork).map((language) => [language, absoluteUrl(artworkPath(artwork, language))])), "x-default": absoluteUrl(artworkPath(artwork, "en")) },
    image: artwork.image ? { url: absoluteUrl(artwork.image), alt: text.imageAlt || artwork.images?.find((image) => image.src === artwork.image)?.alt || text.title } : undefined,
  });
}
