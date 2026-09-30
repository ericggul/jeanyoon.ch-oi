import { sota } from "@/content/research/sota";
import JsonLd from "@/components/seo/json-ld";
import TerminalSession from "@/app/oi/terminal";
import { publicationSchema } from "@/lib/seo/structured-data";
import { citationText, publicationMetadata } from "@/lib/seo/publication";

const path = sota.recordPath;
export const metadata = publicationMetadata(sota, path);

// Citation record migrated from portfolio-jyc.org/publications/sota-dis-2026, shown in the terminal.
export default function SotaPublication() {
  const detail = {
    slug: sota.id, title: sota.title,
    meta: [sota.authors.join(", "), sota.venue, sota.publisher, sota.published, `pp. ${sota.pages}`, sota.distinction],
    paragraphs: [`Abstract\n${sota.abstract}`, `Citation\n${citationText(sota)}`],
    links: [...sota.links, { label: "Markdown record", href: `${path}.md` }],
  };
  return <><JsonLd data={publicationSchema(sota, path)} /><TerminalSession initialEntry={{ path, parent: "research", detail }} /></>;
}
