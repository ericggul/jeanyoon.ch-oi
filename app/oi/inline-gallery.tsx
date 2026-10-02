"use client";
import { useState } from "react";
import type { Detail } from "@/lib/content/types";
import styles from "./terminal.module.css";

// Every image is server-rendered as a real <img> (Google Images indexes only page
// images); inactive ones stay hidden, so the visible gallery is unchanged.
export default function InlineGallery({ images, hidden }: { images: NonNullable<Detail["images"]>; hidden?: boolean }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return <div className={styles.inlineGallery} hidden={hidden} onKeyDown={(event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault(); event.stopPropagation();
    setActive((index) => (index + (event.key === "ArrowRight" ? 1 : -1) + images.length) % images.length);
  }}>
    {images.map((image, index) => <img key={image.src} src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" hidden={index !== active} />)}
    <div className={styles.hint}>browse images</div>
    <nav aria-label="Experiment images" className={styles.inlineImageIndex}>
      {images.map((entry, index) => <button key={entry.src} type="button" className={`${styles.choice} ${index === active ? styles.selected : ""}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}>{index}</button>)}
    </nav>
  </div>;
}
