import { profile } from "@/content/about";
import { entryList, entryPath, readText } from "@/lib/seo/collections";
import { enrichment } from "@/lib/seo/enrichment";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/site";

// Atom feed of the texts: a discovery channel for search engines (Google, Naver) and readers.
export const dynamic = "force-static";
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = entryList("texts").map((entry) => ({ ...entry, text: readText(entry.slug) }))
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const updated = `${items[0]?.date ?? "2026-01-01"}T00:00:00Z`;
  const xml = [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">`,
    `<title>${escape(SITE_NAME)}</title>`,
    `<subtitle>${escape(`Texts by ${profile.name} (${profile.koreanName}) on system art, multi-device web artwork, interaction and AI.`)}</subtitle>`,
    `<id>${absoluteUrl("/oi/texts")}</id>`,
    `<link rel="self" type="application/atom+xml" href="${absoluteUrl("/oi/feed.xml")}"/>`,
    `<link rel="alternate" type="text/html" href="${absoluteUrl("/oi/texts")}"/>`,
    `<updated>${updated}</updated>`,
    `<author><name>${escape(profile.name)}</name><uri>${absoluteUrl("/oi")}</uri></author>`,
    ...items.map(({ slug, title, date, description, text }) => {
      const url = absoluteUrl(entryPath("texts", slug));
      return [`<entry>`, `<title>${escape(title)}</title>`, `<id>${url}</id>`, `<link rel="alternate" type="text/html" href="${url}"/>`,
        `<published>${date}T00:00:00Z</published>`, `<updated>${date}T00:00:00Z</updated>`,
        `<summary>${escape(enrichment("texts", slug)?.abstract ?? description)}</summary>`,
        `<content type="html">${escape(text.english.trim().split(/\n\s*\n/).map((p) => `<p>${escape(p)}</p>`).join(""))}</content>`,
        `</entry>`].join("");
    }),
    `</feed>`,
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
