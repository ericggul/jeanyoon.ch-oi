# Portfolio v4 agent notes

## Current task boundary

This is a new, separate portfolio project. **Agents working inside `portfolio-v4/`: when necessary, go up one directory and explore `../portfolio-v3/` to understand the existing portfolio's files, structure, content, and routes.** Treat v3 as a read-only migration reference. Its working tree has existing uncommitted changes. Do not copy its Prisma schema, content taxonomy, styling, assets, analytics, or routes into v4 by default.

The eventual public address is `https://jeanyoon.ch/oi`. The domain has been purchased through AWS, but Vercel and GitHub for v4 are not set up yet. Do not alter DNS, Vercel, the old site, or the old domain as part of local v4 development.

## Current prototype

- `/` redirects to `/oi`, which renders the current terminal page.
- `/oi` is a literal terminal-text study: output begins at the upper-left, without page chrome, navigation, columns, or oversized headings.
- The page reads the small `Project` data adapter in `lib/projects.ts`.
- Until `GOOGLE_SHEET_CSV_URL` is configured, entries are explicitly marked samples.
- The content ontology, route tree, and chosen public design remain open decisions.

## Google Sheet

Use a publicly readable, published CSV URL in `GOOGLE_SHEET_CSV_URL` (server-side only). Header names are `id,title,year,kind,summary,url,status,order`. `id` and `title` are required. `status=hidden` omits a row. The URL field accepts only HTTP(S) links. The server refreshes successful sheet fetches every five minutes. If the sheet is unavailable or malformed, sample entries appear and an error is logged. Revisit this fallback before launch so an outage cannot silently replace real work with samples.

Do not put private sheet data or service credentials into a public CSV. If private access becomes necessary, design a server-side Google API integration then.

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
