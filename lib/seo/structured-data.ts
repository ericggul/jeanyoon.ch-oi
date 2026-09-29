import { profile } from "@/content/about";
import type { Artwork, Locale } from "@/content/artworks/types";
import { absoluteUrl, SITE_NAME } from "./site";
import { artworkPath, artworkText } from "./artworks";

import { artworks } from "@/content/artworks";
import { contactLinks } from "@/content/contact";
import { artworkDiscovery } from "./artwork-content";

export function artworkImages(artwork: Artwork) {
  return (artwork.images ?? []).map((image) => ({
    "@type": "ImageObject", "@id": absoluteUrl(image.src) + "#image",
    contentUrl: absoluteUrl(image.src), url: absoluteUrl(image.src),
    name: `${artwork.title} (${artwork.year}) by ${(artwork.creators ?? [profile.name]).join(", ")} — ${image.caption}`,
    description: image.alt, caption: image.caption, width: image.width, height: image.height,
    encodingFormat: "image/webp", representativeOfPage: image.src === artwork.image,
    about: [{ "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`) }, { "@id": absoluteUrl("/oi#person") }],
    // Artwork authorship is not a claim of photographic copyright or license.
    isPartOf: { "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`) },
  }));
}

export function person() {
  return { "@type": "Person", "@id": absoluteUrl("/oi#person"), name: profile.name,
    alternateName: [...profile.alternateNames, ...(profile.koreanName ? [profile.koreanName] : [])],
    url: absoluteUrl("/oi"), jobTitle: ["Computational Artist", "Web Art Researcher"],
    sameAs: contactLinks.filter((link) => /linkedin.com|instagram.com/.test(link.href)).map((link) => link.href),
    subjectOf: artworks.map((artwork) => ({ "@type": "WebPage", url: absoluteUrl(artworkPath(artwork, "en")), about: { "@id": absoluteUrl("/oi#person") }, mainEntity: { "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`) } })),
    knowsAbout: [...profile.en.topics, ...profile.ko.topics], description: profile.en.description };
}
export function profileSchema(locale?: Locale) {
  const path = locale ? `/oi/${locale}` : "/oi";
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: absoluteUrl("/"), name: SITE_NAME,
      inLanguage: ["en", "ko"], publisher: { "@id": absoluteUrl("/oi#person") } },
    { "@type": "ProfilePage", "@id": absoluteUrl(`${path}#page`), url: absoluteUrl(path),
      name: SITE_NAME, description: profile[locale ?? "en"].description,
      inLanguage: locale ?? "en", mainEntity: { "@id": absoluteUrl("/oi#person") }, isPartOf: { "@id": absoluteUrl("/#website") } },
  ] };
}
export function artworkSchema(artwork: Artwork, locale: Locale) {
  const text = artworkText(artwork, locale)!;
  const url = absoluteUrl(artworkPath(artwork, locale));
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "VisualArtwork", "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`),
      name: text.title, description: text.summary, url, mainEntityOfPage: url,
      creator: artwork.creators && artwork.creators.length > 1
        ? artwork.creators.map((name) => name === profile.name
          ? { "@id": absoluteUrl("/oi#person") }
          : { "@type": "Person", name })
        : { "@id": absoluteUrl("/oi#person") }, inLanguage: locale,
      ...(artwork.year ? { dateCreated: artwork.year } : {}),
      ...(artwork.updated ? { dateModified: artwork.updated } : {}),
      ...(artwork.images?.length ? { image: artworkImages(artwork) } : artwork.image ? { image: absoluteUrl(artwork.image) } : {}),
      ...(artworkDiscovery[artwork.slug] ? {
        alternateName: artworkDiscovery[artwork.slug].aliases,
        about: artworkDiscovery[artwork.slug].topics.map((name) => ({ "@type": "DefinedTerm", name })),
      } : {}),
      ...(artwork.site ? { sameAs: artwork.site } : {}),
      ...(text.medium ? { artMedium: text.medium } : {}),
      ...(text.keywords?.length ? { keywords: text.keywords } : {}),
      ...(artwork.references?.length ? { citation: artwork.references.map((ref) => ref.url) } : {}),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/oi") },
      { "@type": "ListItem", position: 2, name: text.title, item: url },
    ] },
  ] };
}
export function serializeJsonLd(data: unknown) { return JSON.stringify(data).replace(/</g, "\\u003c"); }
