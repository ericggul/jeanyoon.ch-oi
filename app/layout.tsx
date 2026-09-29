import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/seo/google-analytics";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

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
  description: "Artworks, projects, and research by Jeanyoon Choi.",
  applicationName: SITE_NAME,
  twitter: { card: "summary_large_image", title: SITE_NAME },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "Artworks, projects, and research by Jeanyoon Choi.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ background: "#000", colorScheme: "dark" }}>
      <body style={{ margin: 0, background: "#000" }}>{children}<GoogleAnalytics /></body>
    </html>
  );
}
