// Generates content/legacy-redirects.json: every indexed portfolio-jyc.org (v3) URL
// mapped to its equivalent jeanyoon.ch/oi page. Used by next.config.ts here and
// copied into ../portfolio-v3/v4-redirects.json for the old deployment.
//   node scripts/build-legacy-redirects.cjs [path-to-portfolio-v3]
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const v3 = path.resolve(process.argv[2] ?? path.join(root, "../portfolio-v3"));
const BLOG_INDEX = "https://storage.googleapis.com/portfolio-jyc-blog/index.json";

const slugs = (collection) => fs.readdirSync(path.join(root, "content", collection, "entries")).map((file) => file.replace(/\.json$/, ""));
const read = (collection, slug) => JSON.parse(fs.readFileSync(path.join(root, "content", collection, "entries", `${slug}.json`), "utf8"));
const texts = new Set(slugs("texts"));

// v3 records not carried as a v4 text/experiment/project `source`.
const works = {
  cmfxi7bvf0000aqhb3v8w5ytx: "/oi/artworks/sota",
  cmfxi7bvh0001aqhbacb9z7e9: "/oi/artworks/omega",
  clrhocwxp0000t7flufzc1356: "/oi/artworks/not-equal",
};
// Research-blog slugs that were normalised during migration.
const renamedPosts = {
  "button-based-interaction-and-amplified-interaction": "button-based-interaction-amplified-interaction-and-mobile-jockey",
  "dark-matter-berlin-vs-mdwa": "dark-matter-berlin-vs-multi-device-web-artwork",
  "system-dynamics-depciting-the-ecosystem-as-mdwa": "system-dynamics-depciting-the-ecosystem-as-multi-device-web-artwork-mdwa",
  "dis-entanglement-and-entanglement": "disentanglement-and-entanglement",
  "integration-of-real-world-apireal-world-data-collaged-collective-world": "integration-of-real-world-api-real-world-data-collaged-collective-world",
  "behavioural-interface-natural-nudging": "behavioural-interface",
  "brutal-interfacenaked-interface": "brutal-interface-naked-interface",
  "my-interpretation-of-hyperobject-accelerating-interaction": "my-interpretation-of-hyperobject-accelerating-interactionn",
  "conducting-screens": "conducting-screens-a-possible-approach-to-multi-device-web-artwork",
};

function sha(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : /\.(webp|jpe?g|png|gif)$/i.test(entry.name) ? [full] : [];
  });
}

async function main() {
  const map = new Map();
  const add = (source, destination) => { if (!map.has(source)) map.set(source, destination); };

  add("/", "/oi");
  add("/about", "/oi/en");
  add("/works", "/oi/experiments");
  add("/texts", "/oi/texts");
  add("/research-blog", "/oi/texts");
  add("/research-blog/all", "/oi/texts");
  add("/nonequality", "/oi/artworks/not-equal");
  add("/artworks/civilisation", "/oi/experiments/the-symphony-of-civilisation");
  add("/publications/sota-dis-2026", "/oi/research/sota");
  add("/publications/sota-dis-2026.md", "/oi/research/sota.md");
  add("/cv/JeanyoonChoi_CV.pdf", "/cv/JeanyoonChoi_CV.pdf");
  add("/llms.txt", "/llms.txt");
  for (const [id, destination] of Object.entries(works)) add(`/works/${id}`, destination);

  // Experiments before projects: a v3 work record is an experiment; LING is both.
  for (const collection of ["texts", "experiments", "projects"]) {
    for (const slug of slugs(collection)) {
      const entry = read(collection, slug);
      for (const source of [entry.source, ...(entry.sources ?? [])]) {
        const match = source?.match(/^https:\/\/(?:www\.)?portfolio-jyc\.org(\/.+)$/);
        if (match) add(match[1], `/oi/${collection}/${slug}`);
      }
    }
  }

  const blog = await (await fetch(BLOG_INDEX)).json();
  for (const { slug } of blog.posts) {
    const target = texts.has(slug) ? slug : renamedPosts[slug];
    add(`/research-blog/${slug}`, target && texts.has(target) ? `/oi/texts/${target}` : "/oi/texts");
  }

  // Byte-identical documentation images keep their image-search history.
  const v4Images = new Map(files(path.join(root, "public")).map((file) => [sha(file), "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/")]));
  for (const file of files(path.join(v3, "public/assets"))) {
    const destination = v4Images.get(sha(file));
    if (destination) add("/" + path.relative(path.join(v3, "public"), file).split(path.sep).join("/"), destination);
  }

  // Unknown or removed IDs land on the matching index rather than a 404.
  const fallbacks = [
    { source: "/works/:id", destination: "/oi/experiments" },
    { source: "/text/:id", destination: "/oi/texts" },
    { source: "/research-blog/:slug", destination: "/oi/texts" },
  ];
  const redirects = [...[...map].map(([source, destination]) => ({ source, destination })), ...fallbacks];
  const output = path.join(root, "content/legacy-redirects.json");
  fs.writeFileSync(output, JSON.stringify(redirects, null, 2) + "\n");
  console.log(`${redirects.length} legacy redirects written to ${path.relative(root, output)}`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
