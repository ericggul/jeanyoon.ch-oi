import { collectionRoute } from "@/lib/seo/entry-route";

const route = collectionRoute("texts");
export const metadata = route.metadata;
export default route.Page;
