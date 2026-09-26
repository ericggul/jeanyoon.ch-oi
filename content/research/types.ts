// Bibliographic records only; independent of artwork/project data and UI behavior.
export type ResearchPublication = {
  id: string;
  title: string;
  authors: readonly string[];
  year: number;
  kind: "conference-paper" | "journal-article" | "preprint";
  venue: string;
  publisher?: string;
  repository?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url: string;
  scholarUrl: string;
};
