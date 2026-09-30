import { collectionRoute } from "@/lib/seo/entry-route";

const route = collectionRoute("projects");
export const metadata = route.metadata;
export default route.Page;
