# Portfolio v4

A separate Next.js App Router prototype for Jeanyoon Choi's future portfolio. The root page redirects to the literal terminal-format portfolio at `/oi`. Content is stored in independent local collections.

## Run locally

```bash
pnpm install
pnpm dev
```

The server listens on all network interfaces. Next.js starts at port 3000 and automatically tries 3001, 3002, etc. when a port is occupied; leave other projects running. Use the port printed in the terminal.

When port 3000 is occupied, open `http://localhost:3001/` on this Mac or `http://macbook-air-5.local:3001/` on an iPhone connected to the same local network. The root redirects to `/oi`. Local development uses **HTTP**, not HTTPS. The `.local` hostname is allowed for Next.js development assets and hot reload.

Run only one dev server for this checkout. If Next.js reports an existing server for this directory, use its URL or stop that portfolio-v4 process before restarting. This project does not modify `../portfolio-v3`.

## Edit content

Content is maintained locally, with separate types for projects, experiments, artworks and texts. See [content/README.md](content/README.md) for entry locations and [content/MIGRATION.md](content/MIGRATION.md) for source and translation decisions. There is no Sheet dependency or sample-data fallback.

Run `node scripts/check-content.cjs`, `node scripts/check-seo.cjs`, and `pnpm typecheck` for in-process validation.

## Search and migration status

The site URL is fixed to `https://jeanyoon.ch`; there is no launch environment switch. Crawling is allowed. See [AGENTS.md](AGENTS.md) for the v3-to-v4 migration boundaries and cutover checklist.

## Search and analytics

See [docs/SEO.md](docs/SEO.md) for the bilingual content modules, per-artwork publishing, generated sitemap and LLM text, GA4 setup, and Search Console/Bing/Naver owner steps. No local server is needed for `node scripts/check-seo.cjs`.
