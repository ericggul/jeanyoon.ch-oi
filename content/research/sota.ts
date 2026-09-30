import type { ResearchPublication } from "./types";

export const sota = {
  id: "sota",
  title: "SoTA: An Interactive Art Exhibition for Public AI Engagement",
  menuDescription: "Interactive art exhibition for public AI engagement.",
  authors: ["Jeanyoon Choi", "Intae Hwang", "SeJoon Park", "Hyungjun Cho", "Heejae Bae", "Yiyun Kang"],
  venueLabel: "DIS",
  distinction: "Honourable Mention",
  publisher: "ACM",
  year: 2026,
  kind: "conference-paper",
  venue: "Proceedings of the 2026 Designing Interactive Systems Conference",
  pages: "4156–4180",
  doi: "10.1145/3800645.3812889",
  url: "https://doi.org/10.1145/3800645.3812889",
  scholarUrl: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=dBBmS0oAAAAJ&citation_for_view=dBBmS0oAAAAJ:W7OEmFMy1HYC",
  // Migrated from portfolio-jyc.org/publications/sota-dis-2026 (the former citation page).
  published: "2026-06-12",
  relatedArtwork: "sota",
  recordPath: "/oi/research/sota",
  abstract: "We introduce SoTA, a multi-device interactive artwork on artificial intelligence (AI). It visualises 118 neural network architectures as artistic objects that can be experienced at an immersive scale, allowing audiences to select, explore, and navigate different models interactively. The installation is also characterised by an intentional narrative shift that moves from open-ended exploration to abstract visualisation. We exhibited SoTA in a public art museum and conducted an in-situ study with 33 participants to investigate how aesthetic experiences foster affective and critical reflection, complementing technical explanation in public AI engagement. Our findings reveal how aesthetic environments create emotional conditions that foster deeper inquiry, leading to enhanced understanding, productive ambivalence, and ultimately personal, philosophical, and societal reflection on AI. We conclude by discussing the opportunities of artistic exhibitions for public AI engagement and suggest three concrete design strategies grounded in our evaluation of SoTA.",
  links: [
    { label: "DOI", href: "https://doi.org/10.1145/3800645.3812889" },
    { label: "ACM Digital Library", href: "https://dl.acm.org/doi/10.1145/3800645.3812889" },
    { label: "PDF (ACM)", href: "https://dl.acm.org/doi/pdf/10.1145/3800645.3812889" },
    { label: "SoTA project site", href: "https://sota-xdlab.net/" },
    { label: "Exhibition video", href: "https://www.youtube.com/watch?v=WYFolg3Y-rU&t=7s" },
    { label: "KAIST XD Lab", href: "https://www.xdlab.net/" },
  ],
} satisfies ResearchPublication;
