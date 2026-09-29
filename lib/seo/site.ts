// Fixed branding: change only on the user's explicit naming instruction (see AGENTS.md).
export const SITE_NAME = "jeanyoon.ch/oi";
export const SITE_URL = "https://jeanyoon.ch";
export const GA_ID = "G-EEL6QFJKB8";
export const locales = ["en", "ko"] as const;
export function absoluteUrl(path: string) { return new URL(path, SITE_URL).href; }
