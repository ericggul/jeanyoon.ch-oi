import { profile } from "@/content/profile";
import type { Artwork, Locale } from "@/content/artworks/types";
import { absoluteUrl } from "./site";
import { artworkPath, artworkText } from "./artworks";

export function person() {
  return { "@type": "Person", "@id": absoluteUrl("/oi#person"), name: profile.name,
    alternateName: [...profile.alternateNames, ...(profile.koreanName ? [profile.koreanName] : [])],
    url: absoluteUrl("/oi"), jobTitle: ["Computational Artist", "Web Art Researcher"],
    knowsAbout: [...profile.en.topics, ...profile.ko.topics], description: profile.en.description };
}
export function profileSchema(locale?: Locale) {
  const path = locale ? `/oi/${locale}` : "/oi";
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: absoluteUrl("/"), name: profile.name,
      inLanguage: ["en", "ko"], publisher: { "@id": absoluteUrl("/oi#person") } },
    { "@type": "ProfilePage", "@id": absoluteUrl(`${path}#page`), url: absoluteUrl(path),
      name: profile[locale ?? "en"].title, description: profile[locale ?? "en"].description,
      inLanguage: locale ?? "en", mainEntity: { "@id": absoluteUrl("/oi#person") }, isPartOf: { "@id": absoluteUrl("/#website") } },
  ] };
}
export function artworkSchema(artwork: Artwork, locale: Locale) {
  const text = artworkText(artwork, locale)!;
  const url = absoluteUrl(artworkPath(artwork, locale));
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "VisualArtwork", "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`),
      name: text.title, description: text.summary, url, mainEntityOfPage: url,
      creator: { "@id": absoluteUrl("/oi#person") }, inLanguage: locale,
      ...(artwork.year ? { dateCreated: artwork.year } : {}),
      ...(artwork.updated ? { dateModified: artwork.updated } : {}),
      ...(artwork.image ? { image: absoluteUrl(artwork.image) } : {}),
      ...(text.medium ? { artMedium: text.medium } : {}),
      ...(text.keywords?.length ? { keywords: text.keywords } : {}),
      ...(artwork.references?.length ? { citation: artwork.references.map((ref) => ref.url) } : {}),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: profile.name, item: absoluteUrl("/oi") },
      { "@type": "ListItem", position: 2, name: text.title, item: url },
    ] },
  ] };
}
export function serializeJsonLd(data: unknown) { return JSON.stringify(data).replace(/</g, "\\u003c"); }
