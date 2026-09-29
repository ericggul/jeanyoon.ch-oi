import type { Project } from "./types";

export const menuDescription = "Selected projects.";
export const selectMessage = "Select a project.";
export const emptyMessage = "[Projects to come.]";

// Interface samples only; these are not claims about existing works.
export const sampleProjects: Project[] = [
  { id: "sample-1", title: "Project title", year: "2026", kind: "Web artwork", summary: "A short description will appear here.", url: "", status: "sample", order: 1 },
  { id: "sample-2", title: "Another project", year: "2025", kind: "Installation", summary: "Project information can come from a Google Sheet.", url: "", status: "sample", order: 2 },
  { id: "sample-3", title: "A third entry", year: "2024", kind: "Research", summary: "A short project description will appear here.", url: "", status: "sample", order: 3 },
];
export type { Project } from "./types";
