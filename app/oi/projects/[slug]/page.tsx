import { entryRoute } from "@/lib/seo/entry-route";

const route = entryRoute("projects");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
