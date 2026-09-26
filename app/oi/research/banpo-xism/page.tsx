import type { Metadata } from "next";
import { banpoXism } from "@/content/research/banpo-xism";
import Manuscript from "./manuscript";

export const metadata: Metadata = {
  title: banpoXism.title,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Manuscript title={banpoXism.title} status={banpoXism.status} />;
}
