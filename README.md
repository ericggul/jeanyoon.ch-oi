# Portfolio v4

A separate Next.js App Router prototype for Jeanyoon Choi's future portfolio. The root page redirects to the literal terminal-format portfolio at `/oi`. The structure and wording are placeholders.

## Run locally

```bash
pnpm install
pnpm dev
```

The server listens on all network interfaces. Next.js starts at port 3000 and automatically tries 3001, 3002, etc. when a port is occupied; leave other projects running. Use the port printed in the terminal.

When port 3000 is occupied, open `http://localhost:3001/` on this Mac or `http://macbook-air-5.local:3001/` on an iPhone connected to the same local network. The root redirects to `/oi`. Local development uses **HTTP**, not HTTPS. The `.local` hostname is allowed for Next.js development assets and hot reload.

Run only one dev server for this checkout. If Next.js reports an existing server for this directory, use its URL or stop that portfolio-v4 process before restarting. This project does not modify `../portfolio-v3`.

## Connect a Google Sheet

1. Make a sheet with the headers in `data/projects.example.csv`: `id,title,year,kind,summary,url,status,order`.
2. Publish only the intended project tab as CSV, or use its public CSV export URL. Anyone with the URL may be able to read the published data.
3. Copy `.env.example` to `.env.local` and set `GOOGLE_SHEET_CSV_URL` to that full HTTPS CSV URL.
4. Restart the dev server. The portfolio will read the sheet rows. Changes are revalidated about every five minutes in production.

`id` and `title` are required. Set `status` to `hidden` to omit a row. Empty optional fields are allowed. Sheet content is rendered as text; the URL column only accepts HTTP(S) links. When the sheet cannot be loaded, the site displays marked sample entries and logs the error.

## Search and migration status

The site URL is fixed to `https://jeanyoon.ch`; there is no launch environment switch. Crawling is allowed. See [AGENTS.md](AGENTS.md) for the v3-to-v4 migration boundaries and cutover checklist.

## Search and analytics

See [docs/SEO.md](docs/SEO.md) for the bilingual content modules, per-artwork publishing, generated sitemap and LLM text, GA4 setup, and Search Console/Bing/Naver owner steps. No local server is needed for `node scripts/check-seo.cjs`.
