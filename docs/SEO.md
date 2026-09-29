# Search and citation setup

## What is implemented

- Canonical origin: `https://jeanyoon.ch`, fixed in `lib/seo/site.ts`. No site URL or launch environment variables.
- `/` permanently redirects to `/oi`. `/oi` preserves the terminal UI without a text-index widget or added profile-link navigation. Its actual menu panels are rendered in the initial HTML, hidden until their existing menu is selected. The same content then appears in the transcript. The initial name is an `h1`, subsequent commands are `h2`, subsection titles are `h3`, and descriptions are paragraphs; CSS preserves terminal size/spacing. The typing effect reveals text already in the DOM rather than withholding it from the response. A no-JavaScript stylesheet exposes the same panels.
- English and Korean profile pages render full HTML without JavaScript, link reciprocally, declare their content language and use self-canonicals plus reciprocal `hreflang`. No automatic browser-language redirect.
- Metadata, Open Graph, Twitter cards and a generated 1200×630 PNG sharing image at `/share-image`.
- `Person`, `WebSite`, `ProfilePage`, and completed works' `VisualArtwork` and `BreadcrumbList` JSON-LD. These express the content; they do not promise a Google rich result.
- `/sitemap.xml` includes the public profiles and only artwork translations with a title, summary and nonempty body. Revision dates are actual record dates, never the current build time.
- `/robots.txt` permits crawling. All four completed interactive artwork routes are indexable. Incomplete translations remain absent from the sitemap and LLM lists.
- `/llms.txt` follows the community proposal; `/llm.txt` is the requested compatibility spelling; `/llms-full.txt` exposes the same public profile and completed artwork text, with source URLs. All are generated from content modules. No separately maintained AI copy, unpublished manuscripts, or sample Sheet projects are promoted as completed works.
- GA4 measurement ID `G-EEL6QFJKB8`, stream ID `15848583095` (stream name: Jeanyoon Choi). Tag loads only on the public hostnames `jeanyoon.ch` and `www.jeanyoon.ch`, excluding localhost, `.local` and Vercel preview hosts.

## Where to edit

| Content | File |
| --- | --- |
| Identity, exact Korean name, bilingual profile | `content/about/index.ts` |
| Existing terminal wording | `content/site.ts` |
| SEO/LLM practice topic context | `lib/seo/practice.ts` |
| Independent publication records | `content/research/*.ts` |
| Artwork type and localized text fields | `content/artworks/types.ts` |
| Current artwork registry | `content/artworks/index.ts` |
| Metadata and canonical helpers | `lib/seo/metadata.ts` |
| Structured data | `lib/seo/structured-data.ts` |
| LLM text output | `lib/seo/llms.ts` |

Use 최정윤 (Jeanyoon Choi) together in Korean-facing copy. The Korean name is 최정윤; the English identity remains Jeanyoon Choi. Jean-Yoon Choi is an existing v3 spelling. Do not invent social accounts, credentials, exhibition histories or work facts for search keywords.

## Adding a real artwork

Edit the per-work module in `content/artworks/` and register its `Artwork` record in `content/artworks/index.ts`. Existing popup `width` and `height` remain presentation fields.

```ts
import type { Artwork } from './types';
export const work: Artwork = {
  slug: 'stable-work-slug',
  title: 'Actual work title',
  year: '2026',
  width: 960,
  height: 720,
  content: {
    en: {
      title: 'Actual English title',
      summary: 'A factual short description of the actual work.',
      paragraphs: ['Describe what visitors encounter, what they do, and how the work responds.'],
      keywords: ['only topics materially present in this artwork'],
      medium: 'Actual medium',
      imageAlt: 'Describe the actual image, without keyword stuffing.',
    },
    ko: {
      title: '실제 한국어 작품명',
      summary: '실제 작품의 내용에 근거한 한국어 요약.',
      paragraphs: ['관객이 마주하는 것, 하는 행동, 작품의 반응을 구체적으로 설명합니다.'],
      keywords: ['작품에 실제로 해당하는 주제'],
      medium: '실제 매체',
      imageAlt: '실제 이미지에 대한 설명.',
    },
  },
  image: '/artworks/stable-work-slug/installation.jpg', // Supply the real file.
  updated: '2026-09-26', // Use the actual content revision date.
  references: [{ label: 'Exhibition or publication', url: 'https://actual-source.example/' }],
};
```

This documentation example is not registered or indexed. With real text registered, `/oi/artworks/<slug>/en` and `/ko` render the descriptions, with sharing metadata and structured data. The interactive `/oi/artworks/<slug>` is the canonical English document. The existing `/en` reference document points its canonical to that interactive page; `/ko` is self-canonical. Missing translations return 404 and never receive `hreflang` links. The profiles, sitemap and LLM documents update from the same record. Rebuild/redeploy after content edits.

Use the artwork's real title, artist, year, medium, audience interaction, conceptual question, location/exhibition context where verified, documentation images and relevant source links. Explain relevant concepts in sentences rather than adding lists of unrelated search terms. Do not publish the current placeholder titles/years as substantive work descriptions without checking them. Future independent projects/texts should receive the same full-page treatment when real content is available; Sheet samples remain interface samples.

## Search strategy

1. Name queries: keep the artist's name and confirmed Korean spelling consistent across the profile, artwork credit, university/exhibition pages and bibliographic sources.
2. Practice queries: English `interactive art`, `computational art`, `web art`, `multi-device web artworks`; Korean `인터랙티브 아트`, `컴퓨테이셔널 아트`, `웹 아트`, `멀티 디바이스 웹 아트워크`. These are grounded in the current practice description. Broad terms are competitive; technical setup alone cannot establish ranking.
3. Work queries: publish detailed, original bilingual descriptions and real documentation on stable per-work URLs. Use specific interactions and concepts as the long-tail topics. Link related publications/exhibitions to their actual sources and seek accurate links back from those sources.
4. Evaluate impressions/clicks per page, query, country and language in Search Console after indexing; improve the actual pages with evidence of audience intent. Analytics measures visits, not search ranking.
5. `llms.txt` is a community proposal, not a guaranteed indexing/citation mechanism. Google says ordinary SEO, crawlable text and consistent structured data remain relevant for its AI features and no special AI file is required. Keep content accessible to crawlers and give every factual work page a stable citation URL.

## Owner actions after deploying

1. **Google Search Console:** add Domain property `jeanyoon.ch` (no scheme or path). Copy Google's provided verification TXT into the Route 53 zone, verify, submit `https://jeanyoon.ch/sitemap.xml`. Inspect `/oi`, `/oi/en`, `/oi/ko`: correct canonical, indexable, rendered text, successful crawl. Request indexing once; track the Pages report instead of repeatedly submitting.
2. **GA4:** set the web stream URL to `https://jeanyoon.ch` (already supplied), keep Enhanced measurement → Page views → browser history events enabled. The standard `gtag('config')` sends the initial page view; history measurement covers client-side URL changes. Terminal menu choices that do not change the real URL are not separate page views. Do not add a second manual page-view tracker or duplicate this tag in GTM.
3. **GA collection verification:** after deployment, open `https://jeanyoon.ch/oi` without a tracking blocker. Use Tag Assistant and GA Realtime, then visit `/oi/en` and `/oi/ko`. Confirm one page view per navigation and the exact `G-EEL6QFJKB8` destination. The admin message “Data collection isn't active” alone does not locate a fault; check that the latest code is deployed, `gtag/js?id=G-EEL6QFJKB8` loads and collection requests succeed. Localhost and preview visits intentionally do not activate collection. This implementation was not verified against a live GA account.
4. **Bing Webmaster Tools:** import the verified Search Console property or verify independently, and submit the same sitemap. This establishes Bing discovery; it does not guarantee citations by any assistant.
5. **Naver Search Advisor:** register `https://jeanyoon.ch`, use its newly issued HTML-file or meta verification method, then submit the sitemap. Do not reuse v3's old verification token without verifying ownership requirements for this domain. A provided HTML verification file belongs in `public/`; a provided meta token belongs in Next metadata `verification.other`.
6. **GTM:** no extra container is needed for the requested GA setup. If GTM is adopted later, migrate the existing GA tag rather than running both. Google Analytics itself does not improve ranking.
7. **Hosting:** production must be publicly crawlable without Vercel Deployment Protection or bot challenges. Keep previews out of search using Vercel preview protection/headers, without reintroducing a site launch environment switch.
8. **Old domain:** inventory v3 URLs and redirect each real migrated page to its relevant new destination at cutover. Leave unmigrated destinations working; do not redirect every deep link to `/oi`. Use Search Console's migration workflow only after the migration is real. No v3/DNS settings were changed here.

## Verification without launching a server

```sh
pnpm exec next typegen
pnpm typecheck
node scripts/check-seo.cjs
```

The SEO check renders profile and temporary artwork-fixture HTML in process, checks canonical/hreflang, excludes incomplete translations and previews, verifies sitemap/LLM propagation, JSON-LD escaping, 404 handling, plain-text responses and the PNG share image. It neither opens a port nor starts a dev/production server. Build validation is separate; no live GA collection or search indexing is implied by local checks.

## Official references

- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- Multilingual pages: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Search Console ownership: https://support.google.com/webmasters/answer/9008080
- Sitemaps report: https://support.google.com/webmasters/answer/7451001
- GA4 single-page applications: https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
- Bing ownership/import: https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b
- Naver basics: https://searchadvisor.naver.com/guide/seo-basic-intro
- llms.txt proposal: https://llmstxt.org/

## Root URL and rendered content

The root currently retains its permanent redirect to `/oi`. A redirect is also a signal for Google to use the destination as canonical; a JavaScript redirect does not reliably reserve the source page for crawlers. A text-rich root plus human-only redirection would need a different routing choice and cannot be presented as a guaranteed SEO improvement.

The implementation does not detect bots or serve them a different document. The terminal's dormant panels are the real sections opened by its existing menu; their text and real links are present before interaction. No invisible keyword list or crawler-only article is added. `/oi/en` and `/oi/ko` remain public, self-canonical localized documents discoverable via sitemap, hreflang and LLM documents, without a visible link directory on the terminal. This reduces direct internal navigation to those pages; hiding them from the terminal is an explicit presentation requirement, not an SEO advantage.

Google recognizes tabs, accordions and other user-accessible disclosure UI as legitimate. Permanently hiding unrelated text/links solely to manipulate search is different. Heading semantics help organize meaning and accessibility; heading count/order is not a guaranteed ranking boost. The actual text, crawlable links and consistent rendered experience still matter.

- Redirect behavior: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- JavaScript rendering and crawlable anchors: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Hidden text and legitimate disclosure UI: https://developers.google.com/search/docs/essentials/spam-policies
- Headings and search basics: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Requested keyword coverage

| Korean search intent | English search intent | Actual content destination |
| --- | --- | --- |
| 미디어 아트 · 인터랙티브 아트 | media art · interactive art | Artist title/description and Media art and interactive art section |
| 웹 아트 · 컨템포러리 웹 아트 · 넷 아트 | web art · contemporary web art · net art | Contemporary web art and net art section |
| 미디어 아트 연구 · 웹 아트 연구자 | media art research · web art researcher | Research section and credited publication list |

These SEO topic notes are kept in `lib/seo/practice.ts` and appear in the full LLM document; the actual About menu and language profiles use `content/about/index.ts`. No additional visible link index, no keyword-specific doorway pages, no meta-keywords ranking claim. The research wording points to the existing co-authored SoTA and Passage of Water records without assigning that work solely to this artist. The four artwork records now supply individual English descriptions and Korean reference text; external citations/links and post-deployment Search Console observations remain necessary to evaluate outcomes. Neither topic metadata nor JSON-LD can force first place.


## Artwork and image discovery — 2026-09-29

- The four interactive artwork URLs are indexable, have individual search descriptions and JSON-LD, and use reciprocal English/Korean alternates. Titles remain exactly `jeanyoon.ch/oi`.
- `lib/seo/artwork-content/index.ts` contains search-only descriptions, grounded topic terms, aliases, and Korean public reference text. Terminal prose is unchanged. Existing English artwork modules remain the source of their visible text.
- All 56 existing WebP images retain their requested numbered filenames, bytes, order, captions, and display dimensions. They appear as actual server-rendered gallery images, with inactive slides hidden until selected. All are listed in the sitemap and as `ImageObject` records linking the depicted artwork and artist. Authorship is not a claim that the artist photographed or owns every photograph.
- Artist identity (Jeanyoon Choi / 최정윤), social profiles, artwork entities, co-creators, representative images, and image descriptions are connected. No unrelated keyword list or fabricated image license is added.
- The favicon is the pure-black v3 mark (explicit user requirement): `app/favicon.ico` and `app/apple-icon.png` are byte-identical copies of `../portfolio-v3/app/favicon.ico` and `../portfolio-v3/app/icon/apple-touch-icon.png`; `/favicon.png` is the v3 192px icon downscaled to 96px. Do not redesign or regenerate it without an explicit user instruction.
- Live read-only checks on 2026-09-29 found apex and www both arriving at `/oi`, already returning the correct title and canonical. The reported Google result differs from live HTML. These new local changes still require deployment and subsequent recrawl; they do not update Google's stored result directly.
- After deployment inspect `/oi`, each canonical artwork URL, `/ko` alternates, `/favicon.png`, `/robots.txt`, and `/sitemap.xml`. Request recrawl of the homepage and artwork pages in Search Console and submit the updated sitemap. Monitor image-search impressions for both artist-name spellings as well as artwork names; monitor web-search query/page data separately.
- Google controls chosen site names, snippets, favicons and ranking. GPT/Gemini/Claude indexing and citation are not guaranteed by metadata or LLM text endpoints. Do not claim first place or successful indexing from local checks.

Additional official references:
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/google-images
