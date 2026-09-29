import { notFound } from "next/navigation";
import { artworks } from "@/content/artworks";
import { displayArtworkTitle } from "@/content/artworks/title";
import { profile } from "@/content/about";
import { artworkLocales, artworkPath, artworkText } from "@/lib/seo/artworks";
import { artworkMetadata } from "@/lib/seo/metadata";
import { artworkSchema } from "@/lib/seo/structured-data";
import JsonLd from "@/components/seo/json-ld";
import styles from "@/components/seo/text.module.css";

type Props = { params: Promise<{ slug: string; lang: string }> };
async function resolve({ params }: Props) {
  const { slug, lang } = await params;
  if (lang !== "en" && lang !== "ko") notFound();
  const artwork = artworks.find((entry) => entry.slug === slug);
  if (!artwork) notFound();
  const text = artworkText(artwork, lang);
  if (!text) notFound();
  return { artwork, text, lang } as const;
}
export function generateStaticParams() {
  return artworks.flatMap((artwork) => artworkLocales(artwork).map((lang) => ({ slug: artwork.slug, lang })));
}
export async function generateMetadata(props: Props) {
  const { artwork, lang } = await resolve(props);
  return artworkMetadata(artwork, lang);
}
export default async function ArtworkPage(props: Props) {
  const { artwork, text, lang } = await resolve(props);
  const artistName = lang === "ko" ? `${profile.koreanName} (${profile.name})` : profile.name;
  const creatorNames = artwork.creators?.join(", ") || artistName;
  return <main lang={lang} className={styles.text}>
    <JsonLd data={artworkSchema(artwork, lang)} />
    <nav aria-label={lang === "ko" ? "작가 및 언어" : "Artist and language"}>
      <a href={`/oi/${lang}`}>← {artistName}</a>
      {artworkLocales(artwork).map((language) => <a key={language} href={artworkPath(artwork, language)} hrefLang={language}>{language === "ko" ? "한국어" : "English"}</a>)}
    </nav>
    <h1>{displayArtworkTitle(text.title)}</h1>
    <p>{creatorNames} · {artwork.year}{text.medium ? ` · ${text.medium}` : ""}</p>
    <p>{text.summary}</p>
    {artwork.image && <img src={artwork.image} alt={text.imageAlt || artwork.images?.find((image) => image.src === artwork.image)?.alt || text.title} />}
    {text.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {artwork.references?.length ? <section>
      <h2>{lang === "ko" ? "관련 자료" : "References"}</h2>
      <ul>{artwork.references.map((ref) => <li key={ref.url}><a href={ref.url}>{ref.label}</a></li>)}</ul>
    </section> : null}
  </main>;
}
