"use client";

import { useEffect, useState } from "react";
import type { Artwork } from "@/content/artworks/types";
import { profile } from "@/content/about";
import { displayArtworkTitle } from "@/content/artworks/title";
import styles from "../../terminal.module.css";
import gallery from "./gallery.module.css";

type OtherArtwork = Pick<Artwork, "slug" | "title" | "year">;

function TypedCaption({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(text.length); return; }
    let position = 0;
    const timer = window.setInterval(() => {
      position = Math.min(text.length, position + 6);
      setCount(position);
      if (position === text.length) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [text]);
  return <figcaption className={gallery.caption}><span aria-hidden="true">{text.slice(0, count)}</span><span className={styles.srOnly}>{text}</span></figcaption>;
}

export default function ArtworkView({ artwork, otherArtworks, paper }: { artwork: Artwork; otherArtworks: OtherArtwork[]; paper?: { label: string; url: string } }) {
  const content = artwork.content?.en;
  const images = artwork.images ?? [];
  const [activeImage, setActiveImage] = useState(0);
  const prompt = `jeanyoon.ch@oi /oi/artworks % open ${artwork.slug}\n`;
  const heading = `${displayArtworkTitle(artwork.title)} (${artwork.year})\n\n`;
  const summary = `${content?.summary ?? ""}\n`;
  const paragraphs = content?.paragraphs ?? [];
  const tail = paragraphs.map((paragraph) => `\n${paragraph}\n`).join("");
  const footerLines: { text: string; href?: string; external?: boolean; space?: boolean }[] = [
    ...(artwork.video ? [{ text: artwork.video.label, href: artwork.video.url, external: true }] : []),
    ...(artwork.site ? [{ text: "Visit artwork site ↗", href: artwork.site, external: true }] : []),
    ...(paper ? [{ text: paper.label, href: paper.url, external: true }] : []),
    { text: `Medium: ${content?.medium ?? "Not specified"}\n`, space: true },
    { text: "Exhibitions:" },
    ...(artwork.exhibitions ?? []).map(({ name, venue, dates, url }) => ({
      text: `  ${name}${venue ? `, ${venue}` : ""}${dates ? ` (${dates})` : ""}${url ? " ↗" : ""}`,
      href: url, external: Boolean(url),
    })),
    { text: "Other artworks:", space: true },
    ...otherArtworks.map(({ slug, title, year }) => ({ text: `  ${displayArtworkTitle(title)} (${year})`, href: `/oi/artworks/${slug}` })),
    { text: "back to ../oi", href: "/oi", space: true },
  ];
  const total = prompt.length + heading.length + summary.length + tail.length + footerLines.reduce((sum, line) => sum + line.text.length, 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) { setCount(total); return; }
    let position = 0;
    const timer = window.setInterval(() => {
      position = Math.min(total, position + 9);
      setCount(position);
      if (position === total) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [total]);

  useEffect(() => {
    if (images.length < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]") || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      event.preventDefault();
      setActiveImage((index) => (index + (event.key === "ArrowRight" ? 1 : -1) + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  const promptEnd = prompt.length;
  const headingEnd = promptEnd + heading.length;
  const summaryEnd = headingEnd + summary.length;
  const footerStart = summaryEnd + tail.length;
  const image = images[activeImage];
  let footerRemaining = Math.max(0, count - footerStart);

  return <main lang="en" className={`${styles.terminal} ${gallery.artwork}`}>
    <h1 className={styles.srOnly}>{displayArtworkTitle(artwork.title)} ({artwork.year})</h1>
    <div aria-hidden="true" className={styles.identity}>{prompt.slice(0, count)}</div>
    <div aria-hidden="true" className={gallery.heading}>{heading.slice(0, Math.max(0, count - promptEnd))}</div>
    <div aria-hidden="true" className={gallery.summary}>{summary.slice(0, Math.max(0, count - headingEnd))}</div>
    {image && <div hidden={count < summaryEnd} className={gallery.viewer}>
      <figure className={gallery.figure}>
        <div className={gallery.imageStage}>
          {images.map((entry, index) => <img key={entry.src} hidden={index !== activeImage} src={entry.src} alt={`${entry.alt} Artwork by ${(artwork.creators ?? [profile.name]).join(", ")}.`} width={entry.width} height={entry.height} loading={index === 0 ? "eager" : "lazy"} decoding="async" />)}
        </div>
        {count >= summaryEnd && <TypedCaption key={image.src} text={image.caption} />}
      </figure>
      <div className={gallery.browseLabel}>browse images</div>
      <nav className={gallery.imageIndex} aria-label="Artwork images">
        <button type="button" onClick={() => setActiveImage((index) => (index - 1 + images.length) % images.length)} aria-label="Previous image">←</button>
        {images.map((entry, index) => <span key={entry.src} className={gallery.indexEntry}>
          {index > 0 && <span aria-hidden="true"> / </span>}
          <button type="button" className={activeImage === index ? gallery.currentIndex : undefined} aria-label={`Image ${index} of ${images.length - 1}`} aria-current={activeImage === index ? "true" : undefined} onClick={() => setActiveImage(index)}>{index}</button>
        </span>)}
        <button type="button" onClick={() => setActiveImage((index) => (index + 1) % images.length)} aria-label="Next image">→</button>
      </nav>
    </div>}
    {count > summaryEnd && <div aria-hidden="true" className={gallery.body}>{tail.slice(0, Math.min(tail.length, count - summaryEnd))}</div>}
    {<div hidden={count <= footerStart} className={gallery.footer}>
      {footerLines.map((line, index) => {
        const visible = line.text.slice(0, Math.max(0, footerRemaining));
        footerRemaining -= line.text.length;

        const className = `${gallery.footerLine} ${line.href ? gallery.footerLink : ""} ${line.space ? gallery.space : ""}`;
        return line.href && (!visible || visible.length === line.text.length)
          ? <a key={index} hidden={!visible} className={className} href={line.href} {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{visible || line.text}</a>
          : <span key={index} hidden={!visible} className={className}>{visible || line.text}</span>;
      })}
    </div>}
    {count < total && <span className={styles.cursor} aria-hidden="true">█</span>}
    <div className={styles.srOnly}>{content?.summary}{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
  </main>;
}
