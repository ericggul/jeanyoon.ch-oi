import type { NextConfig } from "next";
import legacyRedirects from "./content/legacy-redirects.json";

// Old portfolio-jyc.org URLs, applied only if that domain is ever attached to this
// project. The v3 deployment serves the same map (see scripts/build-legacy-redirects.cjs).
const legacyHost = [{ type: "host" as const, value: "(?:www\\.)?portfolio-jyc\\.org" }];

// Markdown alternates (lib/seo/markdown.ts) for LLM agents: `<page>.md`, or the page
// itself requested with `Accept: text/markdown`. Browsers never send that header.
const entryPage = "/oi/:collection(texts|experiments|projects|artworks)/:slug";
const wantsMarkdown = [{ type: "header" as const, key: "accept", value: ".*text/markdown.*" }];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  allowedDevOrigins: ["macbook-air-5.local"],
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source, destination: `https://jeanyoon.ch${destination}`, permanent: true, has: legacyHost,
    }));
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: `${entryPage}\\.md`, destination: "/md/:collection/:slug" },
        { source: entryPage, has: wantsMarkdown, destination: "/md/:collection/:slug" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      { source: entryPage, headers: [
        { key: "Link", value: `</oi/:collection/:slug.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain"` },
        { key: "Vary", value: "Accept" },
      ] },
      { source: "/oi", headers: [{ key: "Link", value: `</llms.txt>; rel="describedby"; type="text/plain"` }] },
      // The internal route is reachable only through the rewrites above.
      { source: "/md/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
