"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { siteContent as copy, type SiteSection } from "@/content/site";
import { cvPage, profile, explore } from "@/content/about";
import { research } from "@/content/research";
import { artworks, introduction as artworksIntroduction } from "@/content/artworks";
import { displayArtworkTitle } from "@/content/artworks/title";
import { projects } from "@/content/projects";
import { experiments } from "@/content/experiments";
import { texts } from "@/content/texts";
import { contactLinks, introduction as contactIntroduction } from "@/content/contact";
import type { Collection, Detail } from "@/lib/content/types";
import InlineGallery from "./inline-gallery";
import styles from "./terminal.module.css";

type Section = SiteSection;
type Choice = { label: string; description?: string; section?: Section; entry?: { collection: Collection; slug: string }; original?: Detail; href?: string; download?: string; windowSize?: { width: number; height: number } };
type Line = { text: string; tone?: "identity" | "path" | "muted"; heading?: boolean; lang?: "en" | "ko" };
type Turn = { promptPath?: string; path: string; command: string; lines: Line[]; choices: Choice[]; detail?: Detail };

const introduction: Line[] = [
  { text: copy.heading, heading: true },
  ...copy.introduction.map((text) => ({ text })),
];
const artworkChoices: Choice[] = artworks.map((artwork) => ({
  label: `${displayArtworkTitle(artwork.title)} (${artwork.year})`,
  description: artwork.menuDescription,
  href: `/oi/artworks/${artwork.slug}`,
  windowSize: { width: artwork.width, height: artwork.height },
}));
const researchChoices: Choice[] = research.map((publication) => ({
  label: publication.kind === "manuscript"
    ? `${publication.title} | ${publication.status}`
    : `${publication.title} (${publication.year}) | ${publication.venueLabel ?? publication.repository ?? publication.venue}${publication.distinction ? ` | ${publication.distinction}` : ""}${publication.kind === "preprint" ? " [preprint]" : ""}`,
  description: publication.menuDescription,
  href: publication.url,
}));
const contactChoices: Choice[] = contactLinks.map((link) => ({ ...link }));
const homeChoices: Choice[] = copy.menu.map(({ id, description }) => ({ label: id, description, section: id }));
const back: Choice = { label: copy.backToOi, description: copy.backToOiDescription, section: "oi" };
const aboutChoices: Choice[] = [
  ...explore.sections.flatMap((section) => homeChoices.filter((choice) => choice.section === section)),
  cvPage, ...homeChoices.filter(({ section }) => section === "contact"), back,
];
const hint = copy.hint;
const initial: Turn = { path: "~", command: "cd /oi", lines: introduction, choices: homeChoices };
const prompt = (turn: Turn) => `${copy.identity} ${turn.promptPath ?? turn.path} % `;
const length = (turn: Turn) => prompt(turn).length + turn.command.length + 1
  + turn.lines.reduce((n, line) => n + line.text.length + 1, 0)
  + hint.length + 1 + turn.choices.reduce((n, choice) => n + choice.label.length + 1, 0);

function sectionTurn(section: Section, from: string): Turn {
  const lines: Line[] = section === "oi" ? []
    : section === "artworks" ? [{ text: artworksIntroduction }]
    : section === "research" ? []
    : section === "about" ? [{ text: profile.name, heading: true }, ...profile.en.paragraphs.map((text) => ({ text, lang: "en" as const })), { text: `\n${explore.introduction}` }]
    : section === "projects" ? []
    : section === "contact" ? [{ text: contactIntroduction }]
    : [];
  return {
    promptPath: from,
    path: section === "oi" ? "/oi" : `/oi/${section}`,
    command: section === "oi" ? "cd /oi" : from === "/oi" ? `cd ${section}` : `cd /oi/${section}`,
    lines,
    choices: section === "oi" ? homeChoices : section === "artworks" ? [...artworkChoices, back] : section === "research" ? [...researchChoices, back] : section === "about" ? aboutChoices : section === "contact" ? [...contactChoices, back] : section === "projects"
      ? [...projects.map((entry) => ({ label: `${entry.title} (${entry.period}) | ${entry.roles.join(", ")}`, description: entry.context, entry: { collection: "projects" as const, slug: entry.slug } })), back]
      : section === "experiments" ? [...experiments.map((entry) => ({ label: `${entry.title} (${entry.year})`, description: entry.context || entry.summary, entry: { collection: "experiments" as const, slug: entry.slug } })), back]
      : section === "texts" ? [...texts.map((entry) => ({ label: `${entry.title} (${entry.date.slice(0, 4)})`, description: entry.description, entry: { collection: "texts" as const, slug: entry.slug } })), back] : [back],
  };
}

export default function TerminalSession({ initialSection }: { initialSection?: "artworks" }) {
  const [turns, setTurns] = useState<Turn[]>(() => initialSection ? [initial, sectionTurn(initialSection, "/oi")] : [initial]);
  const [characters, setCharacters] = useState(0);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    const timer = window.setInterval(() => setCharacters((count) => Math.min(total, count + Math.max(2, Math.ceil(total / 160)))), 22);
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

  async function choose(choice: Choice) {
    if (!ready || locked.current || choice.href) return;
    locked.current = true;
    setError("");
    const from = current.path === "~" ? "/oi" : current.path;
    let next: Turn;
    if (choice.entry) {
      const { collection, slug } = choice.entry;
      setLoading(true);
      try {
        const response = await fetch(`/api/content/${collection}/${slug}`);
        if (!response.ok) throw new Error("Unable to load this entry.");
        const detail: Detail = await response.json();
        next = {
          promptPath: from, path: `/oi/${collection}/${slug}`, command: `cat ${slug}`,
          lines: [{ text: detail.title, heading: true }, { text: detail.meta.filter(Boolean).join(" | "), tone: "muted" }, ...detail.paragraphs.map((text) => ({ text: `\n${text}` }))],
          detail,
          choices: [...detail.links.map((link) => ({ ...link })), ...(detail.related ?? []).map(({ collection, slug, label }) => ({ label, entry: { collection, slug } })),
            ...(detail.original ? [{ label: "Read original notes", description: "Unedited source notes and collected references.", original: detail }] : []),
            { label: `back to ../${collection}`, description: `Return to ${collection}.`, section: collection }, back],
        };
      } catch {
        setError("Could not load this entry. Please select it again to retry.");
        locked.current = false;
        return;
      } finally { setLoading(false); }
    } else if (choice.original) {
      next = { promptPath: from, path: from, command: "cat original", lines: [{ text: choice.original.title, heading: true }, { text: choice.original.original! }], choices: [{ label: "Read English version", entry: { collection: "texts", slug: choice.original.slug } }, { label: "back to ../texts", section: "texts" }, back] };
    } else {
      next = sectionTurn(choice.section ?? "oi", from);
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

  // Unopened sections are real menu panels, not a search-only duplicate document.
  // They are already in the response HTML; selecting the menu moves the same
  // content into the transcript and removes its dormant instance.
  const dormant = copy.menu.map(({ id }) => id).filter((section) => !turns.some((turn) => turn.path === `/oi/${section}`));
  const rendered = [
    ...turns.map((turn, index) => ({ turn, key: `turn-${index}`, dormant: false })),
    ...dormant.map((section) => ({ turn: sectionTurn(section, "/oi"), key: `panel-${section}`, dormant: true })),
  ];

  return (
    <main className={styles.terminal} aria-label={`${profile.name} — oi`}>
      <div className={styles.srOnly} role="status" aria-live="polite">{announcement}</div>
      {rendered.map(({ turn, key, dormant }, turnIndex) => {
        const active = !dormant && turnIndex === turns.length - 1;
        let remaining = active ? characters : length(turn);
        function slice(text: string) {
          const visible = text.slice(0, Math.max(0, remaining));
          remaining -= text.length;
          return { visible, content: <>{visible}<span hidden>{text.slice(visible.length)}</span></> };
        }
        const identity = slice(`${copy.identity} `);
        const path = slice(`${turn.promptPath ?? turn.path} `);
        const command = slice(`% ${turn.command}\n`);
        return (
          <section key={key} id={dormant ? `panel-${turn.path.split("/").pop()}` : undefined} hidden={dormant} className={styles.turn} aria-label={turn.command}>
            {turnIndex === 0 ? <div className={styles.command} aria-hidden={active && !ready}>
              <span className={styles.identity}>{identity.content}</span><span className={styles.path}>{path.content}</span>{command.content}
            </div> : <h2 className={styles.command} aria-hidden={active && !ready}>
              <span className={styles.identity}>{identity.content}</span><span className={styles.path}>{path.content}</span>{command.content}
            </h2>}
            {turn.lines.map((line, index) => {
              const text = slice(`${line.text}\n`);
              const Tag = line.heading ? (turnIndex === 0 ? "h1" : "h3") : "p";
              return <Tag key={index} lang={line.lang} hidden={!text.visible} className={line.tone ? styles[line.tone] : undefined} aria-hidden={active && !ready}>{text.content}</Tag>;
            })}
            {turn.detail?.images?.length && (!active || ready) ? <InlineGallery images={turn.detail.images} /> : null}
            {(() => {
              const text = slice(`${hint}\n`);
              return <div hidden={!text.visible} className={styles.hint} aria-hidden={active && !ready}>{text.content}</div>;
            })()}
            <div ref={active ? menu : undefined} className={styles.choices} aria-label="Choose a destination">
              {turn.choices.map((choice, index) => {
                const revealed = slice(`${choice.label}\n`);
                const label = revealed.visible.trimEnd();
                const fullLabel = <>{label}<span hidden>{choice.label.slice(label.length)}</span></>;
                if ((!active || !ready) && !dormant) return choice.href
                  ? <a key={index} hidden={!label} className={styles.previousChoice} href={choice.href} tabIndex={-1} aria-hidden={!ready && active} onClick={(event) => event.preventDefault()}>{"  "}{fullLabel}</a>
                  : <span key={index} hidden={!label} className={styles.previousChoice} aria-hidden={!ready && active}>{"  "}{fullLabel}</span>;
                const props = {
                  className: `${styles.choice} ${!dormant && selected === index ? styles.selected : ""}`,
                  onPointerEnter: () => setSelected(index), onFocus: () => setSelected(index),
                };
                const isSelected = !dormant && selected === index;
                const content = <><span aria-hidden="true">{isSelected ? "> " : "  "}</span>{label}{isSelected && choice.description && <span className={styles.choiceDescription}>{` | ${choice.description}`}</span>}</>;
                const external = choice.href?.startsWith("http");
                const newWindow = Boolean(choice.windowSize) || (external && !turn.detail);
                return choice.href
                  ? <a key={index} {...props} href={choice.href} target={newWindow ? "_blank" : undefined} rel={newWindow ? "noopener noreferrer" : undefined} download={choice.download} onClick={(event) => openArtwork(event, choice)} aria-label={choice.windowSize ? `${label}${isSelected && choice.description ? ` | ${choice.description}` : ""} — opens in a new window or tab` : undefined}>{content}</a>
                  : <button key={index} {...props} type="button" onClick={() => choose(choice)}>{content}</button>;
              })}
            </div>
            {active && <span className={styles.cursor} aria-hidden="true">█</span>}
          </section>
        );
      })}
      {loading && <p className={styles.muted} role="status">loading…</p>}
      {error && <p role="alert">{error}</p>}
      <div ref={end} />
      <noscript>
        <style>{`.${styles.terminal} .${styles.turn}[hidden] { display: block !important; } .${styles.terminal} .${styles.turn} [hidden] { display: revert !important; }`}</style>
        {profile.name} — {copy.introduction[0]}
      </noscript>
    </main>
  );
}
