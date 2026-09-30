import { sota } from "@/content/research/sota";
import { publicationMarkdown } from "@/lib/seo/publication";

export const dynamic = "force-static";
export function GET() {
  return new Response(publicationMarkdown(sota, sota.recordPath), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
