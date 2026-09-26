import { llmsIndex, textResponse } from "@/lib/seo/llms";
export const dynamic = "force-static";
export function GET() { return textResponse(llmsIndex()); }
