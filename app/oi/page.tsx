import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";
import TerminalSession from "./terminal";

export const metadata: Metadata = {
  title: "oi",
  description: "Jeanyoon Choi — Computational Artist. Artworks, projects, experiments, research, about, texts, and contact.",
};

export default async function Terminal() {
  return <TerminalSession projects={await getProjects()} />;
}
