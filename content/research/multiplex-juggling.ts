import type { ResearchPublication } from "./types";

// Matches the 2017 arXiv record listed on the supplied Scholar profile.
// A later journal version exists (Journal of Integer Sequences 22, 2019,
// Article 19.1.7); do not combine its date/venue with the preprint's metadata.
// https://cs.uwaterloo.ca/journals/JIS/VOL22/Butler/butler12.pdf
export const multiplexJuggling = {
  id: "multiplex-juggling",
  title: "Enumerating multiplex juggling patterns",
  authors: ["Steve Butler", "Jeongyoon Choi", "Kimyung Kim", "Kyuhyeok Seo"],
  repository: "arXiv",
  year: 2017,
  kind: "preprint",
  venue: "arXiv:1702.05808",
  doi: "10.48550/arXiv.1702.05808",
  url: "https://arxiv.org/abs/1702.05808",
  scholarUrl: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=dBBmS0oAAAAJ&citation_for_view=dBBmS0oAAAAJ:Tyk-4Ss8FVUC",
} satisfies ResearchPublication;
