// Search/LLM-only descriptions of each entry, written from the entry's own text
// (lib/seo/entry-content/*.json). Used in meta descriptions, JSON-LD, LLM text and
// Markdown alternates — never rendered as page copy.
import textsA from "./entry-content/texts-a.json";
import textsB from "./entry-content/texts-b.json";
import textsC from "./entry-content/texts-c.json";
import experimentEntries from "./entry-content/experiments.json";
import projectEntries from "./entry-content/projects.json";
import artworkEntries from "./entry-content/artworks.json";
import researchEntries from "./entry-content/research.json";
import profileEntry from "./entry-content/profile.json";
import { absoluteUrl } from "./site";

export type QA = { q: string; a: string };
export type Term = { term: string; definition: string };
export type Enrichment = {
  slug: string; description: string; abstract: string; questions: QA[];
  concepts: string[]; mentions: { name: string; url?: string }[]; terms: Term[]; ko: string;
};
export type EnrichedKind = "texts" | "experiments" | "projects" | "artworks" | "research";

const entries: Record<EnrichedKind, Enrichment[]> = {
  texts: [...textsA, ...textsB, ...textsC] as Enrichment[],
  experiments: experimentEntries as Enrichment[],
  projects: projectEntries as Enrichment[],
  artworks: artworkEntries as Enrichment[],
  research: researchEntries as Enrichment[],
};

export function enrichment(kind: EnrichedKind, slug: string): Enrichment | undefined {
  return entries[kind].find((entry) => entry.slug === slug);
}

export const profileQuestions: QA[] = profileEntry.questions;

const sourcePath = (kind: EnrichedKind, slug: string) =>
  kind === "artworks" ? `/oi/artworks/${slug}` : kind === "research" ? `/oi/research/${slug}` : `/oi/${kind}/${slug}`;

// The artist's own vocabulary, each term linked to the entry that defines it.
export function glossary(): (Term & { source: string })[] {
  const seen = new Set<string>();
  const all = [
    ...(profileEntry.terms as Term[]).map((term) => ({ ...term, source: absoluteUrl("/oi/en") })),
    ...(Object.keys(entries) as EnrichedKind[]).flatMap((kind) => entries[kind].flatMap((entry) =>
      entry.terms.map((term) => ({ ...term, source: absoluteUrl(sourcePath(kind, entry.slug)) })))),
  ];
  return all.filter(({ term }) => {
    const key = term.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// JSON-LD fragments shared by every entry type.
// `omit` leaves out fields a schema already states from its own record.
export function enrichmentSchema(entry: Enrichment | undefined, omit: ("abstract" | "keywords" | "about")[] = []) {
  if (!entry) return {};
  const schema: Record<string, unknown> = {
    abstract: entry.abstract,
    keywords: entry.concepts.join(", "),
    about: entry.concepts.map((name) => ({ "@type": "Thing", name })),
    ...(entry.mentions.length ? { mentions: entry.mentions.map(({ name, url }) => ({ "@type": "Thing", name, ...(url ? { sameAs: url } : {}) })) } : {}),
    ...(entry.terms.length ? { hasDefinedTerm: entry.terms.map(({ term, definition }) => ({ "@type": "DefinedTerm", name: term, description: definition })) } : {}),
  };
  for (const key of omit) delete schema[key];
  return schema;
}

export function enrichmentMarkdown(entry: Enrichment | undefined) {
  if (!entry) return [];
  return [
    "## Summary", "", entry.abstract, "",
    ...(entry.ko ? ["## 요약 (Korean)", "", entry.ko, ""] : []),
    ...(entry.terms.length ? ["## Concepts defined", "", ...entry.terms.map(({ term, definition }) => `- **${term}**: ${definition}`), ""] : []),
    ...(entry.questions.length ? ["## Questions this answers", "", ...entry.questions.flatMap(({ q, a }) => [`### ${q}`, "", a, ""])] : []),
    ...(entry.concepts.length ? [`Topics: ${entry.concepts.join(", ")}`, ""] : []),
    ...(entry.mentions.length ? [`References: ${entry.mentions.map(({ name, url }) => url ? `[${name}](${url})` : name).join(", ")}`, ""] : []),
  ];
}
