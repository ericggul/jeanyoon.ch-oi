export type TextEntry = {
  slug: string;
  title: string;
  date: string;
  original: string;
  english: string;
  source: string;
};
export type TextSummary = Pick<TextEntry, "slug" | "title" | "date"> & { description: string };
