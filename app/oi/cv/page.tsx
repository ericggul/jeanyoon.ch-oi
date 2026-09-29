import { profile } from "@/content/about";
import { loadCv } from "@/content/cv";
import { pageMetadata } from "@/lib/seo/metadata";
import CvView from "./cv-view";

export const metadata = pageMetadata({
  description: `Curriculum vitae of ${profile.name}: education, teaching, publications, selected projects, exhibitions, invited talks and performances.`,
  path: "/oi/cv",
});

export default function CvPage() {
  return <CvView cv={loadCv()} />;
}
