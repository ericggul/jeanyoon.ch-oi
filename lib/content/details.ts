import { projects } from "@/content/projects";
import { experiments } from "@/content/experiments";
import { textLoaders } from "@/content/texts/loaders";
import type { Collection, Detail } from "./types";

export async function getDetail(collection: Collection, slug: string): Promise<Detail | undefined> {
  if (collection === "projects") {
    const entry = projects.find((item) => item.slug === slug);
    if (!entry) return;
    return { slug, title: entry.title, meta: [entry.period, entry.roles.join(", "), entry.context, entry.location], paragraphs: entry.paragraphs, links: entry.links,
      related: entry.relatedExperiments.flatMap((id) => {
        const experiment = experiments.find((item) => item.slug === id);
        return experiment ? [{ collection: "experiments" as const, slug: id, label: `View experiment: ${experiment.title}` }] : [];
      }) };
  }
  if (collection === "experiments") {
    const entry = experiments.find((item) => item.slug === slug);
    if (!entry) return;
    return { slug, title: entry.title, meta: [entry.year, entry.medium], paragraphs: [entry.summary, ...entry.paragraphs].filter(Boolean),
      // Alt text only (not visible copy): ties each image to the artist's name for image search.
      images: entry.images?.map((image) => ({ ...image, alt: `${image.alt.replace(/\.$/, "")}, from Jeanyoon Choi's experiments.` })), links: entry.links };
  }
  if (collection === "texts" && Object.hasOwn(textLoaders, slug)) {
    const { default: entry } = await textLoaders[slug]();
    return { slug, title: entry.title, meta: [entry.date], paragraphs: entry.english.split(/\n\s*\n/), original: entry.original, links: [] };
  }
}
