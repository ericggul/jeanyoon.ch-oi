export type Locale = "en" | "ko";
export type ArtworkText = {
  title: string;
  summary: string;
  paragraphs: readonly string[];
  keywords?: readonly string[];
  medium?: string;
  imageAlt?: string;
};
export type Artwork = {
  slug: string;
  title: string;
  year: string;
  menuDescription?: string; // Short pre-selection preview; independent of the full work text.
  width: number;
  height: number;
  content?: Partial<Record<Locale, ArtworkText>>;
  image?: string;
  updated?: string; // Actual content revision date, YYYY-MM-DD; not a build timestamp.
  references?: readonly { label: string; url: string }[];
};
