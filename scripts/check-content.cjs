const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./check-seo.cjs');
async function main() {
  const { projects } = load('@/content/projects');
  const { experiments } = load('@/content/experiments');
  const { texts } = load('@/content/texts');
  const { getDetail } = load('@/lib/content/details');
  const { GET } = load('@/app/api/content/[collection]/[slug]/route');
  assert.deepEqual(experiments.slice(0, 3).map(x => x.slug), ['ddong-meong', 'c-val', 'fractal-clock']);
  let images = 0;
  for (const [collection, entries] of Object.entries({ projects, experiments, texts })) {
    assert.equal(new Set(entries.map(x => x.slug)).size, entries.length);
    for (const entry of entries) {
      assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      const detail = await getDetail(collection, entry.slug);
      assert.equal(detail.title, entry.title);
      assert(detail.paragraphs.length);
      assert(detail.paragraphs.every(x => typeof x === 'string' && x.trim().length));
      for (const link of detail.links) assert(['https:', 'http:'].includes(new URL(link.href).protocol));
      for (const image of detail.images || []) {
        assert(fs.existsSync(path.join(__dirname, '../public', image.src)));
        assert(image.width > 0 && image.height > 0 && image.alt);
        images++;
      }
      for (const related of detail.related || []) assert(await getDetail(related.collection, related.slug));
      if (collection === 'texts') {
        assert(detail.original);
        assert(!detail.images);
        assert(!/[가-힣]/.test(detail.paragraphs.join('\n')), entry.slug);
      }
      const response = await GET(new Request('http://localhost/api/content'), { params: Promise.resolve({ collection, slug: entry.slug }) });
      assert.equal(response.status, 200);
      assert.equal((await response.json()).slug, entry.slug);
    }
  }
  for (const [collection, slug] of [['artworks','omega'], ['texts','__proto__'], ['texts','missing'], ['projects','missing']]) {
    assert.equal((await GET(new Request('http://localhost'), {params: Promise.resolve({collection, slug})})).status, 404);
  }
  assert(!experiments.some(x => ['SoTA','Ω','≠ (Nonequality)','Banpo-Xism'].includes(x.title)));
  console.log(`Content checks passed: ${projects.length} projects, ${experiments.length} experiments, ${texts.length} texts, ${images} images; details, links, references and 404s.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
