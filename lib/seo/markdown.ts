// Markdown alternates of each public page, for LLM agents and fetch tools
// (`<page>.md`, or the page URL requested with `Accept: text/markdown`).
// Same facts as the page; the HTML URL stays canonical.
import { profile } from "@/content/about";
import { artworks } from "@/content/artworks";
import { projects } from "@/content/projects";
import { experiments } from "@/content/experiments";
import type { Collection } from "@/lib/content/types";
import { absoluteUrl } from "./site";
import { artworkPath, artworkText } from "./artworks";
import { entryPath, readText } from "./collections";
import { enrichment, enrichmentMarkdown } from "./enrichment";

const header = (title: string, path: string, facts: (string | false | undefined)[]) => [
  `# ${title}`, "",
  `Canonical URL: ${absoluteUrl(path)}`,
  ...facts.filter((fact): fact is string => Boolean(fact)), "",
];
const footer = [
  "---", "",
  `${profile.name} (${profile.koreanName}) is a Korean computational artist and researcher (b. 1999), PhD candidate at KAIST XD Lab, making multi-device web artworks. Profile: ${absoluteUrl("/oi/en")}. Index: ${absoluteUrl("/llms.txt")}.`, "",
];

export function entryMarkdown(collection: Collection, slug: string): string | undefined {
  const extra = enrichment(collection, slug);
  if (collection === "texts") {
    let entry;
    try { entry = readText(slug); } catch { return; }
    return [...header(entry.title, entryPath(collection, slug), [`Type: essay / research note`, `Author: ${profile.name} (${profile.koreanName})`, `Date: ${entry.date}`]),
      ...enrichmentMarkdown(extra), "## Full text", "", entry.english.trim(), "", ...footer].join("\n");
  }
  if (collection === "experiments") {
    const entry = experiments.find((item) => item.slug === slug);
    if (!entry) return;
    return [...header(entry.title, entryPath(collection, slug), [`Type: experiment`, `Artist: ${profile.name} (${profile.koreanName})`, `Year: ${entry.year}`, entry.medium && `Medium: ${entry.medium}`, entry.context && `Context: ${entry.context}`]),
      ...enrichmentMarkdown(extra), "## Description", "", ...[entry.summary, ...entry.paragraphs].filter(Boolean).flatMap((p) => [p, ""]),
      ...(entry.links.length ? ["## Links", "", ...entry.links.map((link) => `- [${link.label.replace(/\s*↗$/, "")}](${link.href})`), ""] : []),
      ...(entry.images?.length ? ["## Images", "", ...entry.images.map((image) => `- ${absoluteUrl(image.src)} — ${image.alt}`), ""] : []), ...footer].join("\n");
  }
  const entry = projects.find((item) => item.slug === slug);
  if (!entry) return;
  return [...header(entry.title, entryPath(collection, slug), [`Type: project (collaboration / commission)`, `Period: ${entry.period}`, `Role of ${profile.name}: ${entry.roles.join(", ")}`, `Context: ${entry.context}`, entry.location && `Location: ${entry.location}`]),
    ...enrichmentMarkdown(extra), "## Description", "", ...entry.paragraphs.flatMap((p) => [p, ""]),
    ...(entry.links.length ? ["## Links", "", ...entry.links.map((link) => `- [${link.label.replace(/\s*↗$/, "")}](${link.href})`), ""] : []),
    ...entry.relatedExperiments.map((id) => `Related experiment: ${absoluteUrl(entryPath("experiments", id))}`), "", ...footer].join("\n");
}

export function artworkMarkdown(slug: string): string | undefined {
  const artwork = artworks.find((item) => item.slug === slug);
  const text = artwork && artworkText(artwork, "en");
  if (!artwork || !text) return;
  return [...header(text.title, artworkPath(artwork, "en"), [`Type: artwork (multi-device web artwork)`, `Artists: ${(artwork.creators ?? [profile.name]).join(", ")}`, `Year: ${artwork.year}`, text.medium && `Medium: ${text.medium}`,
    artworkText(artwork, "ko") && `Korean page: ${absoluteUrl(artworkPath(artwork, "ko"))}`]),
    ...enrichmentMarkdown(enrichment("artworks", slug)), "## Description", "", text.summary, "", ...text.paragraphs.flatMap((p) => [p, ""]),
    ...(artwork.exhibitions?.length ? ["## Exhibitions", "", ...artwork.exhibitions.map((e) => `- ${[e.name, e.venue, e.dates].filter(Boolean).join(", ")}${e.url ? ` (${e.url})` : ""}`), ""] : []),
    ...[artwork.site && `Artwork website: ${artwork.site}`, artwork.video && `Video: ${artwork.video.url}`].filter(Boolean) as string[], "",
    ...(artwork.references?.length ? ["## References", "", ...artwork.references.map((ref) => `- [${ref.label}](${ref.url})`), ""] : []),
    ...(artwork.images?.length ? ["## Images", "", ...artwork.images.map((image) => `- ${absoluteUrl(image.src)} — ${image.caption}`), ""] : []), ...footer].join("\n");
}

export function markdownResponse(markdown: string, canonicalPath: string) {
  return new Response(markdown, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
    // The HTML page remains the indexed/cited URL.
    Link: `<${absoluteUrl(canonicalPath)}>; rel="canonical"`,
    Vary: "Accept",
  } });
}
