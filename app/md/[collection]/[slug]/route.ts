import { artworks } from "@/content/artworks";
import { collections, entryList, entryPath } from "@/lib/seo/collections";
import { artworkMarkdown, entryMarkdown, markdownResponse } from "@/lib/seo/markdown";

// Served at /oi/<collection>/<slug>.md and for `Accept: text/markdown` (next.config.ts rewrites).
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return [...collections.flatMap((collection) => entryList(collection).map(({ slug }) => ({ collection, slug }))),
    ...artworks.map(({ slug }) => ({ collection: "artworks", slug }))];
}
export async function GET(_request: Request, { params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  if (collection === "artworks") {
    const markdown = artworkMarkdown(slug);
    return markdown ? markdownResponse(markdown, `/oi/artworks/${slug}`) : new Response(null, { status: 404 });
  }
  if (collection !== "texts" && collection !== "experiments" && collection !== "projects") return new Response(null, { status: 404 });
  const markdown = entryMarkdown(collection, slug);
  return markdown ? markdownResponse(markdown, entryPath(collection, slug)) : new Response(null, { status: 404 });
}
