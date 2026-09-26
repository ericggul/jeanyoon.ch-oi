"use client";

import { useEffect, useState } from "react";
import styles from "../../terminal.module.css";

export default function Manuscript({ title, status }: { title: string; status: string }) {
  const text = `${title} | ${status}`;
  const [count, setCount] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let position = 0;
    const finish = () => { if (media.matches) { position = text.length; setCount(position); } };
    finish();
    media.addEventListener("change", finish);
    const timer = window.setInterval(() => {
      position = Math.min(text.length, position + 2);
      setCount(position);
      if (position === text.length) window.clearInterval(timer);
    }, 22);
    return () => { window.clearInterval(timer); media.removeEventListener("change", finish); };
  }, [text]);
  return <main className={styles.terminal}>
    <h1 className={styles.srOnly}>{text}</h1>
    <div aria-hidden="true">{text.slice(0, count)}<span className={styles.cursor}>█</span></div>
  </main>;
}
