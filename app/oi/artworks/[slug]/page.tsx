import { SITE_NAME } from "@/lib/seo/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { artworks } from "@/content/artworks";
import { research } from "@/content/research";
import ArtworkView from "./artwork-view";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return artworks.map(({ slug }) => ({ slug }));
}
export const metadata: Metadata = {
  title: { absolute: SITE_NAME }, robots: { index: false, follow: true },
};
export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  if (!artwork) notFound();
  const paper = research.find((entry) => entry.id === artwork.relatedResearchId);
  return <ArtworkView artwork={artwork} paper={paper ? { url: paper.url, label: "Read DIS paper ↗" } : undefined} otherArtworks={artworks.filter((entry) => entry.slug !== slug).map(({ slug, title, year }) => ({ slug, title, year }))} />;
}
