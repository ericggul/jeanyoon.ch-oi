# Content layout

Each menu destination owns its content in `content/<destination>/`. The `index.ts` file exports that destination's menu description and ordered entries; a separate file holds each substantial entry. The entries do **not** share one artwork/project/experiment schema.

| Destination | Edit here |
| --- | --- |
| About, artist identity, and shared CV download | `about/index.ts` |
| Artworks and per-work preview text | `artworks/index.ts`, then the work's own `.ts` file |
| Projects | `projects/index.ts`; `projects/example.csv` is a Sheet-format example |
| Experiments | `experiments/index.ts` |
| Research | `research/index.ts`, then each paper's own `.ts` file |
| Texts | `texts/index.ts` |
| Contact | `contact/index.ts` for ordered links, email addresses, and hover text; CV file at `public/cv/JeanyoonChoi_CV.pdf` |

`site.ts` holds the opening script and menu order. `app/oi/terminal.tsx` renders the interaction; `lib/projects.ts` is the existing optional CSV adapter. Search/LLM-specific practice notes live in `lib/seo/practice.ts`, outside user-facing content.

Edit `menuDescription` inside a destination's own index for its main-menu preview. Edit an artwork or research entry's `menuDescription` inside that entry's file for its list preview. Project list previews use the existing `summary` field. Artwork text, gallery order, video links, and source notes live in each artwork file and `artworks/SOURCES.md`. Optimized WebP files live under `public/artworks/<slug>/`.

The `/oi` About interaction displays only the English paragraphs from `about/index.ts`. Korean profile copy remains available to the Korean search/discovery route.
