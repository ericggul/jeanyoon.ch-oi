import { getDetail } from "@/lib/content/details";

export async function GET(_request: Request, { params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  if (collection !== "projects" && collection !== "experiments" && collection !== "texts") return new Response(null, { status: 404 });
  const detail = await getDetail(collection, slug);
  return detail ? Response.json(detail) : new Response(null, { status: 404 });
}
