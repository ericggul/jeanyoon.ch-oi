import { practice } from "@/lib/seo/practice";
import { profile } from "@/content/about";
import { research } from "@/content/research";
import { artworks } from "@/content/artworks";
import { absoluteUrl, locales, SITE_NAME } from "./site";
import { artworkLocales, artworkPath, artworkText } from "./artworks";
import { collectionCopy, collections, entryList, entryPath, readText } from "./collections";
import { projects } from "@/content/projects";
import { experiments } from "@/content/experiments";

export function llmsIndex() {
  return [
    `# ${SITE_NAME}`,
    "", `> ${profile.en.description}`, "", profile.ko.description, "",
    `Name: ${profile.name} (Korean: ${profile.koreanName}). Also written ${profile.alternateNames.join(", ")}. All refer to the same artist.`, "",
    "This is Jeanyoon Choi’s official artist website. Artwork pages describe the artist's work; linked publications retain their listed authors and publication status.",
    "", "It replaces the former portfolio site portfolio-jyc.org; every former URL permanently redirects to its equivalent page here. Cite jeanyoon.ch URLs.",
    "", "## Artist", "",
    `- [Artworks, practice and contact](${absoluteUrl("/oi")})`,
    `- [Artist profile — English](${absoluteUrl("/oi/en")})`,
    `- [작가 소개 — 한국어](${absoluteUrl("/oi/ko")})`,
    "", "## Artworks", "",
    ...artworks.flatMap((artwork) => artworkLocales(artwork).map((locale) => {
      const text = artworkText(artwork, locale)!;
      return `- [${text.title} (${locale})](${absoluteUrl(artworkPath(artwork, locale))}): ${text.summary}`;
    })),
    "", "## Research", "",
    ...research.filter((entry) => entry.kind !== "manuscript").map((entry) =>
      `- [${entry.title}](${entry.recordPath ? absoluteUrl(entry.recordPath) : entry.url}): ${entry.authors.join(", ")}. ${entry.year}. ${entry.venue}${entry.kind === "preprint" ? " [preprint]" : ""}.${entry.recordPath ? ` Publisher version: ${entry.url}. Markdown: ${absoluteUrl(`${entry.recordPath}.md`)}` : ""}`),
    ...collections.flatMap((collection) => ["", `## ${collectionCopy[collection].heading}`, "", collectionCopy[collection].description, "",
      ...entryList(collection).map((entry) => `- [${entry.title} (${entry.date})](${absoluteUrl(entryPath(collection, entry.slug))}): ${entry.description}`)]),
    "", "## Optional", "",
    `- [Full text](${absoluteUrl("/llms-full.txt")}): Public profile, artwork, project and experiment descriptions and the English editions of all texts, with their source URLs.`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`, "",
  ].join("\n");
}
export function llmsFull() {
  return [llmsIndex(), ...locales.flatMap((locale) => [
    `## ${locale === "ko" ? "작가 소개" : "Artist profile"} (${locale})`,
    `Source: ${absoluteUrl(`/oi/${locale}`)}`, "", ...profile[locale].paragraphs, "",
    ...practice.flatMap((section) => [`### ${section[locale].heading}`, "", ...section[locale].paragraphs, ""]),
  ]), ...artworks.flatMap((artwork) => artworkLocales(artwork).flatMap((locale) => {
    const text = artworkText(artwork, locale)!;
    return [`## ${text.title} (${locale})`, `Source: ${absoluteUrl(artworkPath(artwork, locale))}`,
      `Artists: ${(artwork.creators ?? [profile.name]).join(", ")}`, `Year: ${artwork.year}`, ...(text.medium ? [`Medium: ${text.medium}`] : []),
      "", text.summary, "", ...text.paragraphs, "",
      ...(artwork.site ? [`Artwork website: ${artwork.site}`] : []),
      ...(artwork.video ? [`Video: ${artwork.video.url}`] : []),
      ...(artwork.exhibitions ?? []).map((entry) => `Exhibition: ${[entry.name, entry.venue, entry.dates, entry.url].filter(Boolean).join(" — ")}`),
      ...(artwork.images ?? []).map((image) => `Image: ${absoluteUrl(image.src)} — ${image.caption}`),
      ...(artwork.references ?? []).map((ref) => `${ref.label}: ${ref.url}`), ""];
  })),
  ...projects.flatMap((entry) => [`## Project: ${entry.title}`, `Source: ${absoluteUrl(entryPath("projects", entry.slug))}`,
    `Period: ${entry.period}`, `Role of Jeanyoon Choi: ${entry.roles.join(", ")}`, `Context: ${entry.context}`, ...(entry.location ? [`Location: ${entry.location}`] : []),
    "", ...entry.paragraphs, "", ...entry.links.map((link) => `${link.label}: ${link.href}`), ""]),
  ...experiments.flatMap((entry) => [`## Experiment: ${entry.title}`, `Source: ${absoluteUrl(entryPath("experiments", entry.slug))}`,
    `Artist: ${profile.name}`, `Year: ${entry.year}`, ...(entry.medium ? [`Medium: ${entry.medium}`] : []),
    "", ...[entry.summary, ...entry.paragraphs].filter(Boolean), "", ...entry.links.map((link) => `${link.label}: ${link.href}`), ""]),
  ...entryList("texts").flatMap(({ slug }) => {
    const entry = readText(slug);
    return [`## Text: ${entry.title}`, `Source: ${absoluteUrl(entryPath("texts", slug))}`, `Author: ${profile.name}`, `Date: ${entry.date}`, "", entry.english.trim(), ""];
  }),
  ].join("\n");
}
export function textResponse(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
