// Public-facing site copy and navigation. Content is independent of its presentation.
export const siteContent = {
  identity: "jeanyoon.ch@oi",
  name: "Jeanyoon Choi",
  introduction: [
    "Jeanyoon Choi (b.1999) is a Computational Artist researching in interconnectivity and complexity through Multi-Device Web Artworks.",
    "You can learn more about my:",
  ],
  menu: ["artworks", "projects", "experiments", "research", "about", "texts", "contact"],
  hint: "↑ ↓ select · enter open · or click / tap",
  backToOi: "../  back to oi",
  backToProjects: "../  back to projects",
  openWebsite: "open website ↗",
  sampleLabel: "[sample]",
  sampleEntry: "[sample entry]",
  projects: { select: "Select a project.", empty: "[Projects to come.]" },
  about: ["Computational Artist", "[Full introduction to come.]"],
  experiments: "[Experiments to come.]",
  texts: "[Texts to come.]",
  contact: "[Contact details to come.]",
  noScript: "This interactive page requires JavaScript.",
} as const;

export type SiteSection = "oi" | (typeof siteContent.menu)[number];
