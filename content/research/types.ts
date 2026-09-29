// Bibliographic records only; independent of artwork/project data and UI behavior.
export type ResearchPublication = {
  id: string;
  title: string;
  authors: readonly string[];
  year: number;
  kind: "conference-paper" | "journal-article" | "preprint";
  venue: string;
  venueLabel?: string;
  distinction?: string;
  publisher?: string;
  repository?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  articleNumber?: string;
  doi?: string;
  url: string;
  scholarUrl: string;
};

export type ResearchManuscript = {
  id: string;
  title: string;
  kind: "manuscript";
  status: "Under Review";
  submittedTo: string;
  url: string;
};

export type ResearchEntry = ResearchPublication | ResearchManuscript;
