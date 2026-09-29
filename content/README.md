# Content layout

Each destination owns its schema and records. Shared terminal rendering does not impose a shared artwork ontology.

| Destination | Edit records | List order |
| --- | --- | --- |
| About | `about/index.ts` | Same file |
| Artworks | `artworks/<slug>.ts` | `artworks/index.ts` |
| Projects | `projects/entries/<slug>.json` | `projects/index.ts` |
| Experiments | `experiments/entries/<slug>.json` | `experiments/index.ts` |
| Research | `research/<paper>.ts` | `research/index.ts` |
| Texts | `texts/entries/<slug>.json` | `texts/catalog.json` |
| Contact | `contact/index.ts` | Same file |

## Separate meanings

- **Project:** a contribution or collaboration, with period, roles, context, location, paragraphs, links and optional related experiment IDs. The list shows title/year/roles; context appears on hover or keyboard selection.
- **Experiment:** a study or individual output, with year, context, medium, summary, paragraphs, images and links. Context appears on selection. Images live in `public/experiments/<slug>/`.
- **Text:** exact source notes in `original`, new English edition in `english`, title, date and source URL. Paragraphs are separated by blank lines. No images or old Korean/English translation fields.
- **Artwork:** retains its own existing exhibition, medium, image, publication and bilingual search structure.

A project and experiment may concern the same collaboration while describing different things. Link them through `relatedExperiments`; do not copy the artwork schema into either collection.

## Adding an entry

Projects and experiments: add one JSON file matching that collection's `types.ts`, then import it in the ordered `index.ts` array.

Texts: add one JSON file matching `texts/types.ts`, add its small list record to `catalog.json`, and its dynamic import to `loaders.ts`. The catalog's `description` is the hover text. Full text bodies load only after selection, through the validated `/api/content/[collection]/[slug]` route. This avoids shipping every essay in the first-page bundle.

`lib/content/details.ts` adapts each collection to terminal presentation. It is not the source ontology. Projects, experiments and texts remain inside the terminal; artwork selections keep their separate-window behaviour. Experiment galleries use the same numbered-image interaction.

`site.ts` holds opening copy and menu order. Each collection's `menuDescription` supplies its home-menu preview. `app/oi/terminal.tsx` handles interaction. Search-only text remains in `lib/seo/`. The shared CV is managed in `content/cv/`; its public PDF is `public/cv/JeanyoonChoi_CV.pdf`.

Run `node scripts/check-content.cjs`, `node scripts/check-seo.cjs`, and `pnpm typecheck` after editing. See `MIGRATION.md` for source decisions.
