"use client";

import { useEffect, useState } from "react";
import styles from "../../terminal.module.css";

export default function ArtworkPreview({ title, year, slug }: { title: string; year: string; slug: string }) {
  const prompt = `jeanyoon.ch@oi /oi/artworks % open ${slug}\n`;
  const text = `${title} (${year})\n\n[Artwork page to come.]`;
  const total = prompt.length + text.length;
  const [count, setCount] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let position = 0;
    const finish = () => { if (media.matches) { position = total; setCount(total); } };
    finish();
    media.addEventListener("change", finish);
    const timer = window.setInterval(() => {
      position = Math.min(total, position + 2);
      setCount(position);
      if (position === total) window.clearInterval(timer);
    }, 22);
    return () => { window.clearInterval(timer); media.removeEventListener("change", finish); };
  }, [total]);
  return (
    <main className={styles.terminal}>
      <h1 className={styles.srOnly}>{title} ({year})</h1>
      <div aria-hidden="true" className={styles.identity}>{prompt.slice(0, count)}</div>
      <div aria-hidden="true">{text.slice(0, Math.max(0, count - prompt.length))}</div>
      <span className={styles.cursor} aria-hidden="true">█</span>
      <p className={styles.srOnly}>Artwork page to come.</p>
    </main>
  );
}
