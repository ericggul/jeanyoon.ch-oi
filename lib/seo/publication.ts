import type { Metadata } from "next";
import type { ResearchPublication } from "@/content/research";
import { absoluteUrl } from "./site";
import { pageMetadata } from "./metadata";

const slash = (date: string) => date.replaceAll("-", "/");
export function citationText(entry: ResearchPublication) {
  const authors = entry.authors.length > 1 ? `${entry.authors.slice(0, -1).join(", ")}, and ${entry.authors.at(-1)}` : entry.authors[0];
  return `${authors}. ${entry.year}. ${entry.title}. In ${entry.venue}${entry.pages ? `, ${entry.pages}` : ""}.${entry.publisher ? ` ${entry.publisher}.` : ""}${entry.doi ? ` https://doi.org/${entry.doi}` : ""}`;
}

// Page metadata plus Highwire `citation_*` tags read by Google Scholar and reference managers.
export function publicationMetadata(entry: ResearchPublication, path: string): Metadata {
  const base = pageMetadata({ description: entry.abstract ?? entry.title, path });
  const [first, last] = (entry.pages ?? "").split(/[–-]/);
  return {
    ...base,
    alternates: { ...base.alternates, types: { "text/markdown": absoluteUrl(`${path}.md`) } },
    other: {
      citation_title: entry.title,
      citation_author: entry.authors.map((name) => { const parts = name.split(" "); return `${parts.at(-1)}, ${parts.slice(0, -1).join(" ")}`; }),
      ...(entry.published ? { citation_publication_date: slash(entry.published), citation_online_date: slash(entry.published) } : { citation_publication_date: String(entry.year) }),
      ...(entry.kind === "conference-paper" ? { citation_conference_title: entry.venue } : { citation_journal_title: entry.venue }),
      ...(first ? { citation_firstpage: first } : {}), ...(last ? { citation_lastpage: last } : {}),
      ...(entry.doi ? { citation_doi: entry.doi, citation_pdf_url: `https://dl.acm.org/doi/pdf/${entry.doi}` } : {}),
      ...(entry.publisher ? { citation_publisher: entry.publisher } : {}),
      ...(entry.abstract ? { citation_abstract: entry.abstract } : {}),
    },
  };
}

export function publicationMarkdown(entry: ResearchPublication, path: string) {
  return [
    `# ${entry.title}`, "",
    `Canonical URL: ${absoluteUrl(path)}`,
    ...(entry.doi ? [`DOI: https://doi.org/${entry.doi}`] : []),
    `Authors: ${entry.authors.join(", ")}`,
    `Venue: ${entry.venue}`, ...(entry.publisher ? [`Publisher: ${entry.publisher}`] : []),
    `Publication date: ${entry.published ?? entry.year}`, ...(entry.pages ? [`Pages: ${entry.pages}`] : []),
    ...(entry.distinction ? [`Distinction: ${entry.distinction}`] : []),
    ...(entry.relatedArtwork ? [`Artwork: ${absoluteUrl(`/oi/artworks/${entry.relatedArtwork}`)}`] : []),
    "", "## Abstract", "", entry.abstract ?? "", "",
    "## Preferred citation", "", citationText(entry), "",
    ...(entry.links?.length ? ["## Links", "", ...entry.links.map((link) => `- [${link.label}](${link.href})`), ""] : []),
    "Formerly published at https://portfolio-jyc.org/publications/sota-dis-2026.", "",
  ].join("\n");
}
