// Bibliographic records only; independent of artwork/project data and UI behavior.
export type ResearchPublication = {
  id: string;
  title: string;
  menuDescription?: string;
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
  abstract?: string;
  /** ISO publication date, when known. */
  published?: string;
  /** Artwork slug this publication studies. */
  relatedArtwork?: string;
  /** Local citation record, e.g. /oi/research/sota. */
  recordPath?: string;
  links?: readonly { label: string; href: string }[];
};

export type ResearchManuscript = {
  id: string;
  title: string;
  menuDescription?: string;
  kind: "manuscript";
  status: "Under Review";
  submittedTo: string;
  url: string;
};

export type ResearchEntry = ResearchPublication | ResearchManuscript;
