import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { artworks } from "@/lib/artworks";
import ArtworkPreview from "./preview";
import { artworkLocales, artworkPath } from "@/lib/seo/artworks";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return artworks.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  return { title: artwork?.title ?? "Artwork", robots: { index: false, follow: true } };
}
export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);
  if (!artwork) notFound();
  const [locale] = artworkLocales(artwork);
  if (locale) permanentRedirect(artworkPath(artwork, locale));
  return <ArtworkPreview title={artwork.title} year={artwork.year} slug={artwork.slug} />;
}
