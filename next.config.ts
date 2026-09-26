import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  devIndicators: false,
  allowedDevOrigins: ["macbook-air-5.local"],
};

export default nextConfig;
