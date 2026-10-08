import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";

// Search and AI-assistant crawlers are named explicitly so that no default policy of
// theirs (or a future wildcard change) excludes them; all may crawl everything.
const assistants = [
  "Googlebot", "Bingbot", "Yeti", "DuckDuckBot", "Applebot", "Applebot-Extended", "Google-Extended",
  "OAI-SearchBot", "ChatGPT-User", "GPTBot", "Claude-SearchBot", "Claude-User", "ClaudeBot",
  "PerplexityBot", "Perplexity-User", "Meta-ExternalAgent", "MistralAI-User", "DuckAssistBot", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, { userAgent: assistants, allow: "/" }],
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/oi/sitemap.xml")],
  };
}
