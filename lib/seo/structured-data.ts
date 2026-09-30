import { profile } from "@/content/about";
import type { Artwork, Locale } from "@/content/artworks/types";
import { absoluteUrl, SITE_NAME } from "./site";
import { artworkPath, artworkText } from "./artworks";

import { artworks } from "@/content/artworks";
import { contactLinks } from "@/content/contact";
import { artworkDiscovery } from "./artwork-content";
import type { Collection, Detail } from "@/lib/content/types";
import type { ResearchPublication } from "@/content/research";
import { collectionCopy, entryPath } from "./collections";

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
    sameAs: [...contactLinks.filter((link) => /linkedin.com|instagram.com/.test(link.href)).map((link) => link.href), ...profile.identifiers],
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
const breadcrumb = (items: { name: string; path: string }[]) => ({ "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/oi") },
  ...items.map((item, index) => ({ "@type": "ListItem", position: index + 2, name: item.name, item: absoluteUrl(item.path) })),
] });

export function entrySchema(collection: Collection, detail: Detail, extra: { date?: string; description: string; location?: string; roles?: string[] }) {
  const path = entryPath(collection, detail.slug);
  const url = absoluteUrl(path);
  const artist = { "@id": absoluteUrl("/oi#person") };
  const common = { "@id": `${url}#entry`, name: detail.title, url, mainEntityOfPage: url, description: extra.description, inLanguage: "en", isPartOf: { "@id": absoluteUrl("/#website") } };
  const entity = collection === "texts"
    ? { "@type": "BlogPosting", ...common, headline: detail.title, author: artist, publisher: artist, ...(extra.date ? { datePublished: extra.date } : {}) }
    : collection === "experiments"
      ? { "@type": "CreativeWork", ...common, creator: artist, ...(extra.date ? { dateCreated: extra.date } : {}),
        ...(detail.images?.length ? { image: detail.images.map((image) => ({ "@type": "ImageObject", contentUrl: absoluteUrl(image.src), description: image.alt, width: image.width, height: image.height })) } : {}) }
      : { "@type": "CreativeWork", ...common, ...(extra.date ? { temporalCoverage: extra.date } : {}),
        contributor: { "@type": "Role", roleName: extra.roles ?? [], contributor: artist },
        ...(extra.location ? { locationCreated: { "@type": "Place", name: extra.location } } : {}) };
  return { "@context": "https://schema.org", "@graph": [person(), entity,
    breadcrumb([{ name: collectionCopy[collection].heading, path: `/oi/${collection}` }, { name: detail.title, path }])] };
}
export function collectionSchema(collection: Collection, items: { slug: string; title: string }[]) {
  const url = absoluteUrl(`/oi/${collection}`);
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "CollectionPage", "@id": `${url}#page`, url, name: SITE_NAME, description: collectionCopy[collection].description,
      isPartOf: { "@id": absoluteUrl("/#website") }, about: { "@id": absoluteUrl("/oi#person") },
      mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: absoluteUrl(entryPath(collection, item.slug)) })) } },
    breadcrumb([{ name: collectionCopy[collection].heading, path: `/oi/${collection}` }])] };
}
export function publicationSchema(entry: ResearchPublication, path: string) {
  const url = absoluteUrl(path);
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "ScholarlyArticle", "@id": `${url}#article`, url, mainEntityOfPage: url, headline: entry.title, name: entry.title,
      ...(entry.abstract ? { abstract: entry.abstract } : {}), datePublished: entry.published ?? String(entry.year),
      author: entry.authors.map((name) => name === profile.name ? { "@id": absoluteUrl("/oi#person") } : { "@type": "Person", name }),
      isPartOf: { "@type": "PublicationEvent", name: entry.venue }, ...(entry.publisher ? { publisher: { "@type": "Organization", name: entry.publisher } } : {}),
      ...(entry.pages ? { pagination: entry.pages } : {}),
      ...(entry.doi ? { identifier: { "@type": "PropertyValue", propertyID: "DOI", value: entry.doi }, sameAs: [`https://doi.org/${entry.doi}`] } : {}),
      ...(entry.relatedArtwork ? { about: { "@id": absoluteUrl(`/oi/artworks/${entry.relatedArtwork}#artwork`) } } : {}) },
    breadcrumb([{ name: entry.title, path }])] };
}
export function serializeJsonLd(data: unknown) { return JSON.stringify(data).replace(/</g, "\\u003c"); }
