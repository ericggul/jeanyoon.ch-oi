import { practice } from "@/content/practice";
import { profile } from "@/content/profile";
import { research } from "@/content/research";
import { artworks } from "@/lib/artworks";
import { absoluteUrl, locales, SITE_NAME } from "./site";
import { artworkLocales, artworkPath, artworkText } from "./artworks";

export function llmsIndex() {
  return [
    `# ${SITE_NAME}`,
    "", `> ${profile.en.description}`, "", profile.ko.description, "",
    "This is the artist's own portfolio. Artwork pages describe the artist's work; linked publications retain their listed authors and publication status.",
    "", "## Artist", "",
    `- [Interactive portfolio](${absoluteUrl("/oi")})`,
    `- [Artist profile — English](${absoluteUrl("/oi/en")})`,
    `- [작가 소개 — 한국어](${absoluteUrl("/oi/ko")})`,
    "", "## Artworks", "",
    ...artworks.flatMap((artwork) => artworkLocales(artwork).map((locale) => {
      const text = artworkText(artwork, locale)!;
      return `- [${text.title} (${locale})](${absoluteUrl(artworkPath(artwork, locale))}): ${text.summary}`;
    })),
    "", "## Research", "",
    ...research.filter((entry) => entry.kind !== "manuscript").map((entry) =>
      `- [${entry.title}](${entry.url}): ${entry.authors.join(", ")}. ${entry.year}. ${entry.venue}${entry.kind === "preprint" ? " [preprint]" : ""}.`),
    "", "## Optional", "",
    `- [Full text](${absoluteUrl("/llms-full.txt")}): Public profile and completed artwork descriptions with their source URLs.`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`, "",
  ].join("\n");
}
export function llmsFull() {
  return [llmsIndex(), ...locales.flatMap((locale) => [
    `## ${locale === "ko" ? "작가 소개" : "Artist profile"} (${locale})`,
    `Source: ${absoluteUrl(`/oi/${locale}`)}`, "", ...profile[locale].paragraphs, "",
    ...practice.flatMap((section) => [`### ${section[locale].heading}`, "", ...section[locale].paragraphs, ""]),
  ]), ...artworks.flatMap((artwork) => artworkLocales(artwork).flatMap((locale) => {
    const text = artworkText(artwork, locale)!;
    return [`## ${text.title} (${locale})`, `Source: ${absoluteUrl(artworkPath(artwork, locale))}`,
      `Artist: ${profile.name}`, `Year: ${artwork.year}`, ...(text.medium ? [`Medium: ${text.medium}`] : []),
      "", text.summary, "", ...text.paragraphs, "",
      ...(artwork.references ?? []).map((ref) => `${ref.label}: ${ref.url}`), ""];
  }))].join("\n");
}
export function textResponse(text: string) {
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
