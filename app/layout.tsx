import type { Metadata, Viewport } from "next";
import GoogleAnalytics from "@/components/seo/google-analytics";
import { SITE_URL } from "@/lib/seo/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Jeanyoon Choi", template: "%s | Jeanyoon Choi" },
  description: "Artworks, projects, and research by Jeanyoon Choi.",
  applicationName: "Jeanyoon Choi",
  openGraph: {
    type: "website",
    siteName: "Jeanyoon Choi",
    title: "Jeanyoon Choi",
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
