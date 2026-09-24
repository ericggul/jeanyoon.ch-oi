import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose a design",
  robots: { index: false, follow: true },
};

export default function Home() {
  return (
    <main>
      <h1>Jeanyoon Choi</h1>
      <p>Portfolio v4 — two early design sketches.</p>
      <nav aria-label="Design versions">
        <ul>
          <li><Link href="/v1">v1: plain HTML</Link></li>
          <li><Link href="/v2">v2: terminal</Link></li>
        </ul>
      </nav>
      <p>These are placeholders for a new portfolio structure.</p>
    </main>
  );
}
