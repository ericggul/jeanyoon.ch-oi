# Portfolio v4 agent notes

## Current task boundary

This is a new, separate portfolio project. **Agents working inside `portfolio-v4/`: when necessary, go up one directory and explore `../portfolio-v3/` to understand the existing portfolio's files, structure, content, and routes.** Treat v3 as a read-only migration reference. Its working tree has existing uncommitted changes. Do not copy its Prisma schema, content taxonomy, styling, assets, analytics, or routes into v4 by default.

The eventual public address is `https://jeanyoon.ch/oi`. The domain has been purchased through AWS, but Vercel and GitHub for v4 are not set up yet. Do not alter DNS, Vercel, the old site, or the old domain as part of local v4 development.

## Current prototype

- `/` redirects to `/oi`, which renders the current terminal page.
- `/oi` is a literal terminal-text study: output begins at the upper-left, without page chrome, navigation, columns, or oversized headings.
- Content lives in independent `content/artworks`, `content/projects`, `content/experiments`, and `content/texts` collections. See `content/README.md`.
- Projects describe contributions and commissions; experiments describe individual studies. Related entries are linked by ID.
- Projects, experiments and texts open inside the terminal. Long text bodies are loaded on selection.
- The former Google Sheet/sample adapter was removed during the September 2026 local-content migration.

## Fixed site name — explicit user requirement

The exact site name is **`jeanyoon.ch/oi`**. Every page's browser/SEO title is `jeanyoon.ch/oi` (`SITE_NAME`), **except: the home profiles `/oi`, `/oi/en`, `/oi/ko` are titled exactly `Jeanyoon Choi` (`HOME_TITLE`); individual artwork, experiment, project, text and publication pages are titled `<title> - Jeanyoon Choi` (`detailTitle()`)** — explicit user instructions, 2026-10-02. Collection lists, CV and other pages stay `jeanyoon.ch/oi`. Use `SITE_NAME` for all other metadata titles, Open Graph/Twitter titles, `og:site_name`, `applicationName`, `WebSite` names, and other site-branding labels. Do not add prefixes, suffixes, artwork names, translated names, keywords, or title templates. Never produce any combination such as "Jeanyoon Choi: oi" or "Jeanyoon Choi — oi" anywhere in titles, labels or hidden text (Google rewrites title links from such text).

SEO work may change only search/LLM/hidden-facing data (metadata, JSON-LD, LLM text, aria/hidden attributes, sitemap, icons). Never edit user-visible copy for SEO.

AI agents must preserve this naming rule during all future SEO, search-engine, LLM discovery, content, and refactoring work. Only a new explicit user instruction to change the site name/titles may override it; a general request to improve SEO is not permission. Keep the artist's actual identity and artwork/publication titles in their respective content and entity data. Run `node scripts/check-seo.cjs` after SEO changes.

## CV — single source of truth

`content/cv/cv.tex` is the only CV source. `/oi/cv` (with `/cv` redirecting to it) parses it at render time via `content/cv/index.ts`, and `pnpm cv` (tectonic) compiles it to `public/cv/JeanyoonChoi_CV.pdf`. To update the CV, replace/edit the `.tex` file, then run `pnpm cv`. Never duplicate CV data into TS/JSON. If a new LaTeX command appears in the source, extend the parser rather than hand-editing output.

## Favicon

The favicon is the pure-black v3 mark (explicit user requirement). Do not redesign or regenerate it without an explicit user instruction.

## Migration and SEO

The site URL is fixed to `https://jeanyoon.ch`, with no launch environment switch or preview indexing block. SEO modules generate canonicals, language alternates, structured data, sitemap and LLM text from real content. See `docs/SEO.md`. Keep unfinished artwork previews and design studies out of the index. Before public cutover, replace sample data and verify public metadata.

At cutover, connect `jeanyoon.ch` to the new Vercel project and route `/` permanently to `/oi`. Keep `portfolio-jyc.org` registered and its existing project serving until the new site is ready. Then map important v3 URLs individually to relevant v4 destinations with permanent redirects, including `www` and apex variants. Do not send every old deep link to `/oi`. Keep redirects for at least one year after cutover. Verify with Search Console, including old and new URL variants.

Useful v3 references: `../portfolio-v3/app` for the current route inventory; `../portfolio-v3/prisma/schema.prisma` for prior work/text fields; `../portfolio-v3/app/layout.tsx` and `app/sitemap.ts` for existing metadata and sitemap behavior. Verify the live deployment before assuming the local checkout matches it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Server operation

Never start a dev or production server unless the user explicitly requests it. Use in-process checks for validation. Do not stop or restart other projects.
