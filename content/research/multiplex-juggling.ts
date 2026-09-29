import type { ResearchPublication } from "./types";

// Verified against the journal landing page and Volume 22, Issue 1 contents.
// https://cs.uwaterloo.ca/journals/JIS/VOL22/Butler/butler12.html
export const multiplexJuggling = {
  id: "multiplex-juggling",
  title: "Enumerating Multiplex Juggling Patterns",
  authors: ["Steve Butler", "Jeongyoon Choi", "Kimyung Kim", "Kyuhyeok Seo"],
  year: 2019,
  kind: "journal-article",
  venue: "Journal of Integer Sequences",
  venueLabel: "Journal of Integer Sequences 22(1), Article 19.1.7",
  volume: "22",
  issue: "1",
  articleNumber: "19.1.7",
  url: "https://cs.uwaterloo.ca/journals/JIS/VOL22/Butler/butler12.html",
  scholarUrl: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=dBBmS0oAAAAJ&citation_for_view=dBBmS0oAAAAJ:Tyk-4Ss8FVUC",
} satisfies ResearchPublication;
