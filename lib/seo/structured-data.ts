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
import { enrichment, enrichmentSchema, glossary } from "./enrichment";
import { research } from "@/content/research";

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

// Video documentation as a VideoObject; players are referenced by embed URL only.
export function videoEmbedUrl(url: string) {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[/?].*?h=([0-9a-f]+))?/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}${vimeo[2] ? `?h=${vimeo[2]}` : ""}`;
  return url;
}
export function artworkVideo(artwork: Artwork) {
  if (!artwork.video) return;
  const text = artworkText(artwork, "en");
  return { "@type": "VideoObject", "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#video`),
    name: `${text?.title ?? artwork.title} (${artwork.year}) — video documentation`,
    description: text?.summary ?? `Video documentation of ${artwork.title} by ${profile.name}.`,
    url: artwork.video.url, embedUrl: videoEmbedUrl(artwork.video.url),
    ...(artwork.image ? { thumbnailUrl: absoluteUrl(artwork.image) } : {}),
    ...(artwork.video.uploaded ? { uploadDate: artwork.video.uploaded } : {}),
    creator: { "@id": absoluteUrl("/oi#person") }, about: { "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`) }, inLanguage: "en" };
}
// Each documented showing as an ExhibitionEvent featuring the work.
const months: Record<string, string> = { january: "01", february: "02", march: "03", april: "04", may: "05", june: "06", july: "07", august: "08", september: "09", october: "10", november: "11", december: "12" };
export function exhibitionDates(dates?: string) {
  if (!dates) return {};
  const range = dates.match(/^(\d{1,2}) (\w+)(?: (\d{4}))? [–-] (\d{1,2}) (\w+) (\d{4})$/);
  if (range) {
    const [, d1, m1, y1, d2, m2, y2] = range;
    const start = `${y1 ?? y2}-${months[m1.toLowerCase()]}-${d1.padStart(2, "0")}`;
    const end = `${y2}-${months[m2.toLowerCase()]}-${d2.padStart(2, "0")}`;
    return months[m1.toLowerCase()] && months[m2.toLowerCase()] ? { startDate: start, endDate: end } : {};
  }
  const month = dates.match(/^(\w+) (\d{4})$/);
  if (month && months[month[1].toLowerCase()]) return { startDate: `${month[2]}-${months[month[1].toLowerCase()]}` };
  return {};
}
export function artworkExhibitions(artwork: Artwork) {
  return (artwork.exhibitions ?? []).map((entry, index) => ({
    "@type": "ExhibitionEvent", "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#exhibition-${index + 1}`),
    name: entry.name, ...(entry.venue ? { location: { "@type": "Place", name: entry.venue } } : {}),
    ...exhibitionDates(entry.dates), ...(entry.url ? { url: entry.url } : {}),
    workFeatured: { "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`) },
  }));
}

export function person() {
  return { "@type": "Person", "@id": absoluteUrl("/oi#person"), name: profile.name,
    alternateName: [...profile.alternateNames, profile.koreanName],
    disambiguatingDescription: profile.disambiguation.en,
    givenName: profile.givenName, familyName: profile.familyName, birthDate: "1999", nationality: { "@type": "Country", name: "South Korea" },
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Seoul National University" }, { "@type": "CollegeOrUniversity", name: "Royal College of Art" }],
    affiliation: { "@type": "CollegeOrUniversity", name: "KAIST", alternateName: "Korea Advanced Institute of Science and Technology" },
    url: absoluteUrl("/oi"), jobTitle: ["Computational Artist", "Web Art Researcher"],
    sameAs: [...new Set([...contactLinks.filter((link) => /linkedin.com|instagram.com/.test(link.href)).map((link) => link.href), ...profile.identifiers, ...profile.profiles])],
    award: ["ACM DIS 2026 Honourable Mention (SoTA: An Interactive Art Exhibition for Public AI Engagement)"],
    hasOccupation: [{ "@type": "Occupation", name: "Computational artist" }, { "@type": "Occupation", name: "Researcher" }],
    worksFor: { "@type": "ResearchOrganization", name: "KAIST Experience Design Lab (XD Lab)", url: "https://www.xdlab.net/" },
    subjectOf: artworks.map((artwork) => ({ "@type": "WebPage", url: absoluteUrl(artworkPath(artwork, "en")), about: { "@id": absoluteUrl("/oi#person") }, mainEntity: { "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#artwork`) } })),
    knowsAbout: [...profile.en.topics, ...profile.ko.topics], description: profile.en.description,
    // Published papers credited to the artist (co-authorship kept as listed).
    ...{ "@reverse": { author: research.flatMap((entry) => entry.kind === "manuscript" ? [] : [{ "@type": "ScholarlyArticle", name: entry.title, url: entry.recordPath ? absoluteUrl(entry.recordPath) : entry.url }]) } } };
}

// The artist's own vocabulary, defined in the texts/works that introduce each term.
export function glossarySchema() {
  const terms = glossary();
  return { "@type": "DefinedTermSet", "@id": absoluteUrl("/oi/texts#glossary"), name: `Concepts in ${profile.name}'s practice`, creator: { "@id": absoluteUrl("/oi#person") },
    hasDefinedTerm: terms.map(({ term, definition, source }) => ({ "@type": "DefinedTerm", name: term, description: definition, url: source, inDefinedTermSet: absoluteUrl("/oi/texts#glossary") })) };
}
export function profileSchema(locale?: Locale) {
  const path = locale ? `/oi/${locale}` : "/oi";
  return { "@context": "https://schema.org", "@graph": [person(),
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: absoluteUrl("/"), name: SITE_NAME,
      // Google site-name candidates: only the two names the owner accepts.
      alternateName: [profile.name],
      inLanguage: ["en", "ko"], publisher: { "@id": absoluteUrl("/oi#person") } },
    { "@type": "ProfilePage", "@id": absoluteUrl(`${path}#page`), url: absoluteUrl(path),
      name: SITE_NAME, description: profile[locale ?? "en"].description,
      inLanguage: locale ?? "en", mainEntity: { "@id": absoluteUrl("/oi#person") }, isPartOf: { "@id": absoluteUrl("/#website") } },
    glossarySchema(),
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
      ...(artwork.video ? { video: { "@id": absoluteUrl(`/oi/artworks/${artwork.slug}#video`) } } : {}),
      ...(text.medium ? { artMedium: text.medium } : {}),
      ...(text.keywords?.length ? { keywords: text.keywords } : {}),
      ...(artwork.references?.length ? { citation: artwork.references.map((ref) => ref.url) } : {}),
      ...(locale === "en" ? enrichmentSchema(enrichment("artworks", artwork.slug), ["about", "keywords"]) : {}),
    },
    ...(artworkVideo(artwork) ? [artworkVideo(artwork)] : []),
    ...artworkExhibitions(artwork),
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
  const common = { "@id": `${url}#entry`, name: detail.title, url, mainEntityOfPage: url, description: extra.description, inLanguage: "en", isPartOf: { "@id": absoluteUrl("/#website") },
    ...enrichmentSchema(enrichment(collection, detail.slug)), encoding: { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: `${url}.md` } };
  const entity = collection === "texts"
    ? { "@type": "BlogPosting", ...common, headline: detail.title, author: artist, publisher: artist, ...(extra.date ? { datePublished: extra.date } : {}) }
    : collection === "experiments"
      ? { "@type": "CreativeWork", ...common, creator: artist, ...(extra.date ? { dateCreated: extra.date } : {}),
        ...(detail.images?.length ? { image: detail.images.map((image, index) => ({ "@type": "ImageObject", "@id": `${absoluteUrl(image.src)}#image`,
          contentUrl: absoluteUrl(image.src), url: absoluteUrl(image.src), name: `${detail.title} — Jeanyoon Choi (${index + 1})`, description: image.alt, caption: image.alt,
          width: image.width, height: image.height, encodingFormat: "image/webp", representativeOfPage: index === 0,
          about: [{ "@id": `${url}#entry` }, artist], isPartOf: { "@id": `${url}#entry` } })) } : {}) }
      : { "@type": "CreativeWork", ...common, ...(extra.date ? { temporalCoverage: extra.date } : {}),
        contributor: { "@type": "Role", roleName: extra.roles ?? [], contributor: artist },
        ...(extra.location ? { locationCreated: { "@type": "Place", name: extra.location } } : {}) };
  return { "@context": "https://schema.org", "@graph": [person(), entity,
    breadcrumb([{ name: collectionCopy[collection].heading, path: `/oi/${collection}` }, { name: detail.title, path }])] };
}
export function collectionSchema(collection: Collection, items: { slug: string; title: string }[]) {
  const url = absoluteUrl(`/oi/${collection}`);
  return { "@context": "https://schema.org", "@graph": [person(),
    ...(collection === "texts" ? [glossarySchema()] : []),
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
      ...enrichmentSchema(enrichment("research", entry.id), ["about", "abstract"]),
      ...(entry.relatedArtwork ? { about: { "@id": absoluteUrl(`/oi/artworks/${entry.relatedArtwork}#artwork`) } } : {}) },
    breadcrumb([{ name: entry.title, path }])] };
}
export function serializeJsonLd(data: unknown) { return JSON.stringify(data).replace(/</g, "\\u003c"); }
