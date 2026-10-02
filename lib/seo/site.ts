// Fixed branding: change only on the user's explicit naming instruction (see AGENTS.md).
export const SITE_NAME = "jeanyoon.ch/oi";
// Explicit user instruction (2026-10-02): only the home profiles /oi, /oi/en, /oi/ko
// use the artist name as their page title; every other page keeps SITE_NAME.
export const HOME_TITLE = "Jeanyoon Choi";
// Explicit user instruction (2026-10-02): individual artwork/experiment/project/text/
// publication pages are titled "<title> - Jeanyoon Choi". Lists, CV etc. keep SITE_NAME.
export function detailTitle(title: string) { return `${title} - ${HOME_TITLE}`; }
export const SITE_URL = "https://jeanyoon.ch";
export const GA_ID = "G-EEL6QFJKB8";
export const locales = ["en", "ko"] as const;
export function absoluteUrl(path: string) { return new URL(path, SITE_URL).href; }
