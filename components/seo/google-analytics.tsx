"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_ID } from "@/lib/seo/site";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(["jeanyoon.ch", "www.jeanyoon.ch"].includes(window.location.hostname)); }, []);
  if (!enabled) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `}</Script>
  </>;
}
