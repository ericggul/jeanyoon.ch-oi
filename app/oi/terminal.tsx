"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { siteContent as copy, type SiteSection } from "@/content/site";
import { research } from "@/content/research";
import { artworks } from "@/lib/artworks";
import type { Project } from "@/lib/projects";
import styles from "./terminal.module.css";

type Section = SiteSection;
type Choice = { label: string; section?: Section; project?: Project; href?: string; windowSize?: { width: number; height: number } };
type Line = { text: string; tone?: "identity" | "path" | "muted"; heading?: boolean };
type Turn = { promptPath?: string; path: string; command: string; lines: Line[]; choices: Choice[] };

const introduction: Line[] = [
  { text: copy.name, heading: true },
  ...copy.introduction.map((text) => ({ text })),
];
const artworkChoices: Choice[] = artworks.map((artwork) => ({
  label: `${artwork.title} (${artwork.year})`,
  href: `/oi/artworks/${artwork.slug}`,
  windowSize: { width: artwork.width, height: artwork.height },
}));
const researchChoices: Choice[] = research.map((publication) => ({
  label: `${publication.title} (${publication.year}) — ${publication.publisher ?? publication.repository ?? publication.venue}${publication.kind === "preprint" ? " [preprint]" : ""}`,
  href: publication.url,
}));
const homeChoices = copy.menu.map((section) => ({ label: section, section }));
const back: Choice = { label: copy.backToOi, section: "oi" };
const hint = copy.hint;
const initial: Turn = { path: "~", command: "cd /oi", lines: introduction, choices: homeChoices };
const prompt = (turn: Turn) => `${copy.identity} ${turn.promptPath ?? turn.path} % `;
const length = (turn: Turn) => prompt(turn).length + turn.command.length + 1
  + turn.lines.reduce((n, line) => n + line.text.length + 1, 0)
  + hint.length + 1 + turn.choices.reduce((n, choice) => n + choice.label.length + 1, 0);

export default function TerminalSession({ projects }: { projects: Project[] }) {
  const [turns, setTurns] = useState<Turn[]>([initial]);
  const [characters, setCharacters] = useState(0);
  const [selected, setSelected] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const menu = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  const locked = useRef(false);
  const current = turns[turns.length - 1];
  const total = length(current);
  const ready = characters >= total;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { if (media.matches) setCharacters(total); };
    finish();
    media.addEventListener("change", finish);
    const timer = window.setInterval(() => setCharacters((count) => Math.min(total, count + 2)), 22);
    return () => { window.clearInterval(timer); media.removeEventListener("change", finish); };
  }, [total, turns.length]);

  useEffect(() => {
    const onScroll = () => { follow.current = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (follow.current) end.current?.scrollIntoView({ block: "nearest" });
    if (ready) {
      locked.current = false;
      setAnnouncement(`${current.lines.map((line) => line.text).join(". ")}. Choose ${current.choices.map((choice) => choice.label).join(", ")}.`);
      // Restore keyboard focus after a selection, without moving it on first load.
      if (turns.length > 1) menu.current?.querySelector<HTMLButtonElement | HTMLAnchorElement>("button, a")?.focus({ preventScroll: true });
    }
  }, [characters, ready, current, turns.length]);

  function openArtwork(event: MouseEvent<HTMLAnchorElement>, choice: Choice) {
    if (!choice.windowSize || !choice.href || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Touch/mobile uses the normal target=_blank link. Keep modifier clicks native too.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const width = Math.min(choice.windowSize.width, window.screen.availWidth);
    const height = Math.min(choice.windowSize.height, window.screen.availHeight);
    const screen = window.screen as Screen & { availLeft?: number; availTop?: number };
    // Bias the centered position slightly toward the upper left of this display.
    // Available-screen origins also account for displays left of the primary one.
    const left = Math.round((screen.availLeft ?? 0) + (screen.availWidth - width) * 0.42);
    const top = Math.round((screen.availTop ?? 0) + (screen.availHeight - height) * 0.35);
    // Open synchronously during the click so it retains user activation.
    // Use a blank same-origin window to detach opener before navigating.
    const popup = window.open("about:blank", "_blank", `popup=yes,width=${width},height=${height},left=${left},top=${top}`);
    if (!popup) return; // If blocked, let the normal new-tab link proceed.
    popup.opener = null;
    popup.location.replace(choice.href);
    event.preventDefault();
  }

  function choose(choice: Choice) {
    if (!ready || locked.current || choice.href) return;
    locked.current = true;
    const from = current.path === "~" ? "/oi" : current.path;
    let next: Turn;
    if (choice.project) {
      const project = choice.project;
      next = {
        path: from, command: `cat ${project.id}.txt`,
        lines: [
          { text: project.title, heading: true },
          { text: [project.year, project.kind].filter(Boolean).join("  "), tone: "muted" },
          { text: project.summary },
          ...(project.status === "sample" ? [{ text: copy.sampleEntry, tone: "muted" as const }] : []),
        ],
        choices: [
          ...(project.url ? [{ label: copy.openWebsite, href: project.url }] : []),
          { label: copy.backToProjects, section: "projects" }, back,
        ],
      };
    } else {
      const section = choice.section ?? "oi";
      const lines: Line[] = section === "oi" ? []
        : section === "artworks" || section === "research" ? []
        : section === "about" ? [{ text: copy.name, heading: true }, ...copy.about.map((text, index) => ({ text, ...(index === 1 ? { tone: "muted" as const } : {}) }))]
        : section === "projects" ? [{ text: projects.length ? copy.projects.select : copy.projects.empty, tone: "muted" }]
        : [{ text: copy[section], tone: "muted" }];
      next = {
        promptPath: from,
        path: section === "oi" ? "/oi" : `/oi/${section}`,
        command: section === "oi" ? "cd /oi" : from === "/oi" ? `cd ${section}` : `cd /oi/${section}`,
        lines,
        choices: section === "oi" ? homeChoices : section === "artworks" ? [...artworkChoices, back] : section === "research" ? [...researchChoices, back] : section === "projects"
          ? [...projects.map((project) => ({ label: `${project.title}${project.status === "sample" ? ` ${copy.sampleLabel}` : ""}`, project })), back]
          : [back],
      };
    }
    setTurns((previous) => [...previous, next]);
    setCharacters(0);
    setSelected(0);
    follow.current = true;
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable=true]")) return;
      if (!ready) {
        if (event.key === "Enter") { event.preventDefault(); setCharacters(total); }
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const next = (selected + (event.key === "ArrowDown" ? 1 : -1) + current.choices.length) % current.choices.length;
        setSelected(next);
        menu.current?.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>("button, a")[next]?.focus();
      } else if (event.key === "Enter" && !target.closest("button, a")) {
        event.preventDefault();
        menu.current?.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>("button, a")[selected]?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, selected, current, total]);

  return (
    <main className={styles.terminal} aria-label={`${copy.name} — oi`}>
      <div className={styles.srOnly} role="status" aria-live="polite">{announcement}</div>
      {turns.map((turn, turnIndex) => {
        const active = turnIndex === turns.length - 1;
        let remaining = active ? characters : length(turn);
        function slice(text: string) {
          const visible = text.slice(0, Math.max(0, remaining));
          remaining -= text.length;
          return visible;
        }
        const identity = slice(`${copy.identity} `);
        const path = slice(`${turn.promptPath ?? turn.path} `);
        const command = slice(`% ${turn.command}\n`);
        return (
          <section key={turnIndex} className={styles.turn} aria-label={turn.command}>
            <div className={styles.command} aria-hidden={active && !ready}>
              <span className={styles.identity}>{identity}</span><span className={styles.path}>{path}</span>{command}
            </div>
            {turn.lines.map((line, index) => {
              const text = slice(`${line.text}\n`);
              return text ? <div key={index} className={line.tone ? styles[line.tone] : undefined} role={line.heading ? "heading" : undefined} aria-level={line.heading ? 1 : undefined} aria-hidden={active && !ready}>{text}</div> : null;
            })}
            {(() => {
              const text = slice(`${hint}\n`);
              return text ? <div className={styles.hint} aria-hidden={active && !ready}>{text}</div> : null;
            })()}
            <div ref={active ? menu : undefined} className={styles.choices} aria-label="Choose a destination">
              {turn.choices.map((choice, index) => {
                const label = slice(`${choice.label}\n`).trimEnd();
                if (!label) return null;
                if (!active || !ready) return <div key={index} className={styles.previousChoice} aria-hidden={!ready && active}>{`  ${label}`}</div>;
                const props = {
                  className: `${styles.choice} ${selected === index ? styles.selected : ""}`,
                  onPointerEnter: () => setSelected(index), onFocus: () => setSelected(index),
                };
                const content = <><span aria-hidden="true">{selected === index ? "> " : "  "}</span>{label}</>;
                return choice.href
                  ? <a key={index} {...props} href={choice.href} target="_blank" rel="noreferrer" onClick={(event) => openArtwork(event, choice)} aria-label={choice.windowSize ? `${label} — opens in a new window or tab` : undefined}>{content}</a>
                  : <button key={index} {...props} type="button" onClick={() => choose(choice)}>{content}</button>;
              })}
            </div>
            {active && <span className={styles.cursor} aria-hidden="true">█</span>}
          </section>
        );
      })}
      <div ref={end} />
      <noscript>{copy.noScript} {copy.name} — {copy.introduction[0]}</noscript>
    </main>
  );
}
