// Presentation contract only. Each collection keeps its own independent ontology.
export type Collection = "projects" | "experiments" | "texts";
export type Detail = {
  slug: string; title: string; meta: string[]; paragraphs: string[];
  images?: { src: string; alt: string; width: number; height: number }[];
  links: { label: string; href: string }[];
  related?: { collection: Collection; slug: string; label: string }[];
  original?: string;
};
