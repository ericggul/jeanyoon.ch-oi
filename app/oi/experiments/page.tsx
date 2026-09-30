import { collectionRoute } from "@/lib/seo/entry-route";

const route = collectionRoute("experiments");
export const metadata = route.metadata;
export default route.Page;
