export type Experiment = {
  slug: string;
  title: string;
  year: string;
  context: string;
  medium: string;
  summary: string;
  paragraphs: string[];
  images: { src: string; alt: string; width: number; height: number }[];
  links: { label: string; href: string }[];
  source: string;
};
