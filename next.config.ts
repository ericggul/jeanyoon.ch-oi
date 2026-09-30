import type { NextConfig } from "next";
import legacyRedirects from "./content/legacy-redirects.json";

// Old portfolio-jyc.org URLs, applied only if that domain is ever attached to this
// project. The v3 deployment serves the same map (see scripts/build-legacy-redirects.cjs).
const legacyHost = [{ type: "host" as const, value: "(?:www\\.)?portfolio-jyc\\.org" }];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  allowedDevOrigins: ["macbook-air-5.local"],
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source, destination: `https://jeanyoon.ch${destination}`, permanent: true, has: legacyHost,
    }));
  },
};

export default nextConfig;
