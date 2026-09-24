import type { Metadata } from "next";
import { Fragment } from "react";
import { getProjects } from "@/lib/projects";
import styles from "./terminal.module.css";

export const metadata: Metadata = {
  title: "Terminal study",
  description: "A terminal-format study for Jeanyoon Choi's portfolio.",
  robots: { index: false, follow: true },
};

export default async function Terminal() {
  const projects = await getProjects();
  return (
    <main className={styles.terminal}>
      <pre className={styles.output}>
        {"jeanyoon@portfolio ~ % cat profile.txt\n"}
        <span role="heading" aria-level={1}>Jeanyoon Choi</span>
        {"\nArtist working with the web, interaction, and computational media.\n\n"}
        {"jeanyoon@portfolio ~ % ls works\n"}
        {projects.map((project) => (
          <Fragment key={project.id}>
            {project.year || "----"}{"  "}
            {project.url ? <a href={project.url}>{project.title}</a> : project.title}
            {project.kind ? `  (${project.kind})` : ""}{"\n"}
            {project.summary}{project.status === "sample" ? " [placeholder]" : ""}{"\n\n"}
          </Fragment>
        ))}
        {"jeanyoon@portfolio ~ % cat contact.txt\n"}
        {"Contact details to be added.\n\n"}
        {"jeanyoon@portfolio ~ % "}<span aria-hidden="true">█</span>
      </pre>
    </main>
  );
}
