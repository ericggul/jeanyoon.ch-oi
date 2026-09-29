// A contribution to a commission, exhibition or collaboration, not an artwork schema.
export type Project = {
  slug: string;
  title: string;
  period: string;
  roles: string[];
  context: string;
  location: string;
  paragraphs: string[];
  links: { label: string; href: string }[];
  relatedExperiments: string[];
  sources: string[];
};
