import type { Metadata } from "next";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const launched = process.env.SITE_LAUNCHED === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Jeanyoon Choi", template: "%s | Jeanyoon Choi" },
  description: "The portfolio of Jeanyoon Choi. Artworks, projects, and research.",
  applicationName: "Jeanyoon Choi",
  openGraph: {
    type: "website",
    siteName: "Jeanyoon Choi",
    title: "Jeanyoon Choi",
    description: "Artworks, projects, and research by Jeanyoon Choi.",
  },
  robots: { index: launched, follow: launched },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
