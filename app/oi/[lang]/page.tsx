import { notFound } from "next/navigation";
import { profile } from "@/content/about";
import { research } from "@/content/research";
import { displayArtworkTitle } from "@/content/artworks/title";
import { locales } from "@/lib/seo/site";
import { profileMetadata } from "@/lib/seo/metadata";
import { profileSchema } from "@/lib/seo/structured-data";
import { publishedArtworks, artworkPath, artworkText } from "@/lib/seo/artworks";
import JsonLd from "@/components/seo/json-ld";
import styles from "@/components/seo/text.module.css";

type Props = { params: Promise<{ lang: string }> };
function locale(value: string) { if (value !== "en" && value !== "ko") notFound(); return value; }
export function generateStaticParams() { return locales.map((lang) => ({ lang })); }
export async function generateMetadata({ params }: Props) { return profileMetadata(locale((await params).lang)); }
export default async function ProfilePage({ params }: Props) {
  const lang = locale((await params).lang);
  const copy = profile[lang];
  const works = publishedArtworks(lang);
  return <main lang={lang} className={styles.text}>
    <JsonLd data={profileSchema(lang)} />
    <nav aria-label={lang === "ko" ? "언어 및 홈" : "Language and home"}>
      <a href="/oi">← oi</a><a href="/oi/en" hrefLang="en">English</a><a href="/oi/ko" hrefLang="ko">한국어</a>
    </nav>
    <h1>{copy.title}</h1>
    {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    {works.length > 0 && <section>
      <h2>{lang === "ko" ? "작품" : "Artworks"}</h2>
      <ul>{works.map((work) => <li key={work.slug}>
        <a href={artworkPath(work, lang)}>{displayArtworkTitle(artworkText(work, lang)!.title)}</a> ({work.year})
        <p>{artworkText(work, lang)!.summary}</p>
      </li>)}</ul>
    </section>}
    <section>
      <h2>{lang === "ko" ? "연구 및 출판" : "Research and publications"}</h2>
      <ul>{research.filter((entry) => entry.kind !== "manuscript").map((entry) => <li key={entry.id}>
        <a href={entry.url}>{entry.title}</a> ({entry.year})
        <p>{entry.authors.join(", ")}. {entry.venue}.{entry.kind === "preprint" ? " [preprint]" : ""}</p>
      </li>)}</ul>
    </section>
  </main>;
}
