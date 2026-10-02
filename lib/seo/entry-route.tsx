import { notFound } from "next/navigation";
import { getDetail } from "@/lib/content/details";
import type { Collection } from "@/lib/content/types";
import { projects } from "@/content/projects";
import JsonLd from "@/components/seo/json-ld";
import TerminalSession from "@/app/oi/terminal";
import { collectionCopy, entryList, entryPath } from "./collections";
import { pageMetadata } from "./metadata";
import { absoluteUrl, detailTitle } from "./site";
import { collectionSchema, entrySchema } from "./structured-data";

type Props = { params: Promise<{ slug: string }> };

async function load(collection: Collection, slug: string) {
  const summary = entryList(collection).find((entry) => entry.slug === slug);
  const detail = summary && await getDetail(collection, slug);
  if (!summary || !detail) notFound();
  return { summary, detail };
}

// Shared route module for /oi/{projects,experiments,texts}/[slug].
export function entryRoute(collection: Collection) {
  return {
    generateStaticParams: () => entryList(collection).map(({ slug }) => ({ slug })),
    async generateMetadata({ params }: Props) {
      const { summary, detail } = await load(collection, (await params).slug);
      const image = detail.images?.[0];
      return pageMetadata({ title: detailTitle(detail.title), description: summary.description, path: entryPath(collection, summary.slug), image: image ? { url: absoluteUrl(image.src), alt: image.alt } : undefined });
    },
    async Page({ params }: Props) {
      const { summary, detail } = await load(collection, (await params).slug);
      const project = collection === "projects" ? projects.find((entry) => entry.slug === summary.slug) : undefined;
      const schema = entrySchema(collection, detail, { date: summary.date, description: summary.description, location: project?.location, roles: project?.roles });
      return <><JsonLd data={schema} /><TerminalSession initialEntry={{ path: entryPath(collection, summary.slug), parent: collection, detail }} /></>;
    },
  };
}

export function collectionRoute(collection: Collection) {
  return {
    metadata: pageMetadata({ description: collectionCopy[collection].description, path: `/oi/${collection}` }),
    Page: () => <><JsonLd data={collectionSchema(collection, entryList(collection))} /><TerminalSession initialSection={collection} /></>,
  };
}
