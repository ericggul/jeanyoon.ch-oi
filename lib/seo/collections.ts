import fs from "node:fs";
import path from "node:path";
import { projects } from "@/content/projects";
import { experiments } from "@/content/experiments";
import { texts } from "@/content/texts";
import type { TextEntry } from "@/content/texts/types";
import type { Collection } from "@/lib/content/types";

// Server-rendered, indexable counterparts of the entries the terminal opens inline.
// They are also the destinations of the old portfolio-jyc.org URLs.
export const collections = ["projects", "experiments", "texts"] as const satisfies readonly Collection[];
export const collectionCopy: Record<Collection, { heading: string; description: string }> = {
  projects: { heading: "Projects", description: "Commissions, exhibitions and collaborations Jeanyoon Choi contributed to, with roles, periods and locations." },
  experiments: { heading: "Experiments", description: "Interactive web experiments and studies by Jeanyoon Choi, from 2020 onward, with documentation images and links." },
  texts: { heading: "Texts", description: "Jeanyoon Choi's research notes and essays on system art, multi-device web artwork, interaction and AI." },
};

export const entryPath = (collection: Collection, slug: string) => `/oi/${collection}/${slug}`;

export function summarise(text: string, max = 160) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, flat.lastIndexOf(" ", max - 1)).replace(/[\s,;:.–—-]+$/, "") + "…";
}

export function entryList(collection: Collection) {
  if (collection === "projects") return projects.map((entry) => ({ slug: entry.slug, title: entry.title, date: entry.period, description: summarise(entry.paragraphs[0] ?? entry.context) }));
  if (collection === "experiments") return experiments.map((entry) => ({ slug: entry.slug, title: entry.title, date: entry.year, description: summarise([entry.summary, ...entry.paragraphs].filter(Boolean).join(" ")) }));
  // Some catalog descriptions are a single short opening line; use the essay itself instead.
  return texts.map((entry) => ({ slug: entry.slug, title: entry.title, date: entry.date,
    description: entry.description.length >= 80 ? entry.description : summarise(readText(entry.slug).english) }));
}

// Synchronous read for build-time text outputs (llms-full.txt).
export function readText(slug: string): TextEntry {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/texts/entries", `${slug}.json`), "utf8"));
}
