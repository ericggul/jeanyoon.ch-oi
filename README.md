# Portfolio v4

A separate Next.js App Router prototype for Jeanyoon Choi's future portfolio. The root page links to two design studies: plain browser HTML at `/v1`, and literal terminal-format text at `/v2`. The structure and wording are placeholders.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. This project does not modify `../portfolio-v3`.

## Connect a Google Sheet

1. Make a sheet with the headers in `data/projects.example.csv`: `id,title,year,kind,summary,url,status,order`.
2. Publish only the intended project tab as CSV, or use its public CSV export URL. Anyone with the URL may be able to read the published data.
3. Copy `.env.example` to `.env.local` and set `GOOGLE_SHEET_CSV_URL` to that full HTTPS CSV URL.
4. Restart the dev server. Both designs will read the same rows. Changes are revalidated about every five minutes in production.

`id` and `title` are required. Set `status` to `hidden` to omit a row. Empty optional fields are allowed. Sheet content is rendered as text; the URL column only accepts HTTP(S) links. When the sheet cannot be loaded, the site displays marked sample entries and logs the error.

## Search and migration status

The prototype is `noindex` and `robots.txt` disallows crawlers by default. `SITE_URL` is prepared for the future canonical host. Do not set `SITE_LAUNCHED=true` until the public `/oi` page, real content, sitemap, canonical URLs, redirects, and domain connection are finished. See [AGENTS.md](AGENTS.md) for the v3-to-v4 migration boundaries and cutover checklist.
