import { artworkMetadata } from "@/lib/seo/metadata";
import { artworkSchema } from "@/lib/seo/structured-data";
import JsonLd from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import { artworks } from "@/content/artworks";
import { research } from "@/content/research";
import ArtworkView from "./artwork-view";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return artworks.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  if (!artwork) notFound();
  return artworkMetadata(artwork, "en");
}
export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  if (!artwork) notFound();
  const paper = research.find((entry) => entry.id === artwork.relatedResearchId);
  return <><JsonLd data={artworkSchema(artwork, "en")} /><ArtworkView artwork={artwork} paper={paper ? { url: paper.url, label: "Read DIS paper ↗" } : undefined} otherArtworks={artworks.filter((entry) => entry.slug !== slug).map(({ slug, title, year }) => ({ slug, title, year }))} /></>;
}
