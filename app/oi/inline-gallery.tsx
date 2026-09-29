"use client";
import { useState } from "react";
import type { Detail } from "@/lib/content/types";
import styles from "./terminal.module.css";

export default function InlineGallery({ images }: { images: NonNullable<Detail["images"]> }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const image = images[active];
  return <div className={styles.inlineGallery} onKeyDown={(event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault(); event.stopPropagation();
    setActive((index) => (index + (event.key === "ArrowRight" ? 1 : -1) + images.length) % images.length);
  }}>
    <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
    <div className={styles.hint}>browse images</div>
    <nav aria-label="Experiment images" className={styles.inlineImageIndex}>
      {images.map((entry, index) => <button key={entry.src} type="button" className={`${styles.choice} ${index === active ? styles.selected : ""}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}>{index}</button>)}
    </nav>
  </div>;
}
