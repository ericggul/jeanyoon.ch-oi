import { profile } from "@/content/about";
import { pageMetadata, profileLanguages, siteDescriptions } from "@/lib/seo/metadata";
import { profileSchema } from "@/lib/seo/structured-data";
import JsonLd from "@/components/seo/json-ld";
import TerminalSession from "./terminal";

export const metadata = pageMetadata({ ...profile.en, description: siteDescriptions.en, path: "/oi", languages: profileLanguages });

export default async function Terminal({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section } = await searchParams;
  return <>
    <JsonLd data={profileSchema()} />
    <TerminalSession initialSection={section === "artworks" ? "artworks" : undefined} />
  </>;
}
