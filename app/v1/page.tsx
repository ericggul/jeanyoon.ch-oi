import type { Metadata } from "next";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Plain HTML study",
  description: "A plain HTML study for Jeanyoon Choi's portfolio.",
  robots: { index: false, follow: true },
};

export default async function PlainHtml() {
  const projects = await getProjects();
  return (
    <main>
      <h1>Jeanyoon Choi</h1>
      <p>Artist working with the web, interaction, and computational media.</p>
        <section id="works" aria-labelledby="works-title">
          <h2 id="works-title">Selected works</h2>
          <ol>
            {projects.map((project) => (
              <li key={project.id}>
                <h3>{project.url ? <a href={project.url}>{project.title}</a> : project.title}</h3>
                <p>{[project.year, project.kind].filter(Boolean).join(" / ")}</p>
                <p>{project.summary}</p>
                {project.status === "sample" && <small>Placeholder entry</small>}
              </li>
            ))}
          </ol>
        </section>
        <section id="about" aria-labelledby="about-title">
          <h2 id="about-title">About</h2>
          <p>Biography and practice statement to be written for the new portfolio.</p>
        </section>
        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>Contact details to be added.</p>
        </section>
    </main>
  );
}
