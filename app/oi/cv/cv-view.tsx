"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Cv, CvInline } from "@/content/cv";
import { cvDownload, profile } from "@/content/about";
import { siteContent as copy } from "@/content/site";
import { SITE_URL } from "@/lib/seo/site";
import styles from "../terminal.module.css";
import cvStyles from "./cv.module.css";

// Typed reveal at the terminal's pace (2 characters / 22ms). The full text is
// server-rendered; unrevealed characters sit in hidden spans until reached.
export default function CvView({ cv }: { cv: Cv }) {
  const prompt = { identity: `${copy.identity} `, path: "/oi ", command: "% cat cv\n" };
  const footer = [
    { label: cvDownload.label, href: cvDownload.href, download: cvDownload.download },
    { label: copy.backToOi, href: "/oi" },
  ];
  const lineLength = (parts: CvInline[]) => parts.reduce((n, part) => n + part.text.length, 0);
  const total = prompt.identity.length + prompt.path.length + prompt.command.length
    + cv.name.length + 1
    + cv.header.reduce((n, line) => n + lineLength(line.left) + 1, 0)
    + (cv.updated ? `Updated ${cv.updated}`.length + 1 : 0)
    + cv.sections.reduce((n, section) => n + section.title.length + 1
      + section.entries.flat().reduce((m, line) => m + lineLength(line.left) + lineLength(line.right) + 1, 0), 0)
    + footer.reduce((n, link) => n + link.label.length + 1, 0);

  const [count, setCount] = useState(0);
  const end = useRef<HTMLSpanElement>(null);
  const follow = useRef(true);
  const ready = count >= total;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { if (media.matches) setCount(total); };
    finish();
    media.addEventListener("change", finish);
    const timer = window.setInterval(() => setCount((value) => Math.min(total, value + 2)), 22);
    return () => { window.clearInterval(timer); media.removeEventListener("change", finish); };
  }, [total]);

  useEffect(() => {
    const onScroll = () => { follow.current = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100; };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest("a, button, input, textarea")) return;
      event.preventDefault();
      setCount(total);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, [total]);

  useEffect(() => { if (follow.current && !ready) end.current?.scrollIntoView({ block: "nearest" }); }, [count, ready]);

  let remaining = count;
  const started = () => remaining > 0;
  function take(text: string): ReactNode {
    const visible = text.slice(0, Math.max(0, remaining));
    remaining -= text.length;
    return <>{visible}<span hidden>{text.slice(visible.length)}</span></>;
  }
  function text(parts: CvInline[]) {
    return parts.map((part, index) => {
      const className = [part.bold && cvStyles.bold, part.italic && cvStyles.italic].filter(Boolean).join(" ") || undefined;
      const content = take(part.text);
      if (!part.href) return <span key={index} className={className}>{content}</span>;
      // Links to this site (e.g. "Portfolio") stay in-site: https://jeanyoon.ch/oi -> /oi.
      const href = part.href.startsWith(`${SITE_URL}/`) ? part.href.slice(SITE_URL.length) : part.href;
      const external = /^https?:/.test(href);
      return <a key={index} className={`${cvStyles.link} ${className ?? ""}`} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{content}</a>;
    });
  }
  function line(key: string | number, className: string | undefined, render: () => ReactNode) {
    const hidden = !started();
    const content = render();
    remaining -= 1; // newline
    return <p key={key} hidden={hidden} className={className}>{content}</p>;
  }

  const header = (
    <>
      <div className={styles.command}>
        <span className={styles.identity}>{take(prompt.identity)}</span><span className={styles.path}>{take(prompt.path)}</span>{take(prompt.command)}
      </div>
      <header className={cvStyles.header} hidden={!started()}>
        {(() => { const hidden = !started(); const name = take(cv.name); remaining -= 1; return <h1 hidden={hidden} className={cvStyles.name}>{name}</h1>; })()}
        {cv.header.map((entry, index) => line(index, undefined, () => text(entry.left)))}
        {cv.updated && line("updated", styles.muted, () => take(`Updated ${cv.updated}`))}
      </header>
    </>
  );
  const sections = cv.sections.map((section) => {
    const sectionHidden = !started();
    const title = take(section.title);
    remaining -= 1;
    return (
      <section key={section.title} hidden={sectionHidden} className={cvStyles.section}>
        <h2 className={cvStyles.title}>{title}</h2>
        {section.entries.map((entry, entryIndex) => (
          <div key={entryIndex} hidden={!started()} className={cvStyles.entry}>
            {entry.map((row, rowIndex) => line(rowIndex, cvStyles.line, () => <>
              <span>{text(row.left)}</span>
              {row.right.length ? <span className={cvStyles.right}>{text(row.right)}</span> : null}
            </>))}
          </div>
        ))}
      </section>
    );
  });
  const links = footer.map(({ label, href, download }) => {
    const hidden = !started();
    const content = take(label);
    remaining -= 1;
    return <a key={href} hidden={hidden} className={styles.choice} href={href} download={download}>{content}</a>;
  });

  return (
    <main className={`${styles.terminal} ${cvStyles.page}`} aria-label={`${profile.name} — CV`}>
      {header}
      <article className={cvStyles.cv}>{sections}</article>
      <nav className={styles.choices} aria-label="CV actions">{links}</nav>
      <span ref={end} className={styles.cursor} aria-hidden="true">█</span>
      <noscript><style>{`.${cvStyles.page} [hidden] { display: revert !important; }`}</style></noscript>
    </main>
  );
}
