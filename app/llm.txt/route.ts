import { llmsIndex, textResponse } from "@/lib/seo/llms";
// Compatibility spelling requested by the owner. The proposal uses /llms.txt.
export const dynamic = "force-static";
export function GET() { return textResponse(llmsIndex()); }
