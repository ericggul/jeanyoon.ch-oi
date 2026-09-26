import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { artworks } from "@/lib/artworks";
import ArtworkPreview from "./preview";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return artworks.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  return { title: artwork?.title ?? "Artwork", robots: { index: false, follow: false } };
}
export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  if (!artwork) notFound();
  return <ArtworkPreview title={artwork.title} year={artwork.year} slug={artwork.slug} />;
}
