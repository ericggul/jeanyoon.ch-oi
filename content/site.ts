import { menuDescription as artworksDescription } from "./artworks";
import { menuDescription as projectsDescription } from "./projects";
import { menuDescription as experimentsDescription } from "./experiments";
import { menuDescription as researchDescription } from "./research";
import { menuDescription as aboutDescription } from "./about";
import { menuDescription as textsDescription } from "./texts";
import { menuDescription as contactDescription } from "./contact";

// Public-facing site copy and navigation. Content is independent of its presentation.
export const siteContent = {
  identity: "jeanyoon.ch@oi",
  heading: "Welcome to jeanyoon.ch/oi",
  introduction: [
    "Jeanyoon Choi (b.1999) is a Computational Artist researching in interconnectivity and complexity through Multi-Device Web Artworks.",
    "You can learn more about my:",
  ],
  menu: [
    { id: "artworks", description: artworksDescription },
    { id: "projects", description: projectsDescription },
    { id: "experiments", description: experimentsDescription },
    { id: "research", description: researchDescription },
    { id: "about", description: aboutDescription },
    { id: "texts", description: textsDescription },
    { id: "contact", description: contactDescription },
  ],
  hint: "↑ ↓ select · enter open · or click / tap",
  backToOi: "../  back to oi",
  backToOiDescription: "Return to the main menu.",
  backToProjects: "../  back to projects",
  backToProjectsDescription: "Return to the project list.",
  openWebsite: "open website ↗",
  openWebsiteDescription: "Open the project website in a new tab.",
  sampleLabel: "[sample]",
  sampleEntry: "[sample entry]",
  noScript: "This interactive page requires JavaScript.",
} as const;

export type SiteSection = "oi" | (typeof siteContent.menu)[number]["id"];
