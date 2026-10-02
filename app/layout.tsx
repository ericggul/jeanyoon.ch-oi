import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/seo/google-analytics";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

import { siteDescriptions } from "@/lib/seo/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: SITE_NAME },
  description: siteDescriptions.en,
  applicationName: SITE_NAME,
  // Pure-black v3 mark (AGENTS.md). Listed explicitly: a config `icons` field
  // replaces file-convention icons, which previously dropped apple-touch-icon.
  // app/favicon.ico is still emitted by the file convention.
  // Google favicons need a square multiple of 48px; 96 and 192 qualify.
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: siteDescriptions.en,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ background: "#000", colorScheme: "dark" }}>
      <body style={{ margin: 0, background: "#000" }}>{children}<GoogleAnalytics /></body>
    </html>
  );
}
