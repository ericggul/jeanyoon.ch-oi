// Exercise real content -> metadata/sitemap/LLM/HTML without starting a server.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(specifier, parent = path.join(root, 'entry.ts')) {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return require(specifier);
  const base = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(parent), specifier);
  if (base.endsWith('.css')) return new Proxy({}, { get: (_, name) => String(name) });
  const filename = [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts')].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!filename) throw new Error(`Cannot resolve ${specifier}`);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  });
  new Function('require', 'module', 'exports', result.outputText)((name) => load(name, filename), module, module.exports);
  return module.exports;
}
async function main() {
  const { artworks } = load('@/lib/artworks');
  const { artworkText, artworkLocales } = load('@/lib/seo/artworks');
  const { artworkMetadata } = load('@/lib/seo/metadata');
  const { serializeJsonLd, artworkSchema } = load('@/lib/seo/structured-data');
  const sitemap = load('@/app/sitemap').default;
  const { llmsIndex, llmsFull } = load('@/lib/seo/llms');
  // Explicit user naming requirement: generic SEO work must never rename the site.
  const fixedName = 'jeanyoon.ch/oi';
  assert.equal(load('@/lib/seo/site').SITE_NAME, fixedName);
  function assertSiteMetadata(metadata) {
    assert.deepEqual(metadata.title, { absolute: fixedName });
    if (metadata.openGraph) {
      assert.equal(metadata.openGraph.title, fixedName);
      assert.equal(metadata.openGraph.siteName, fixedName);
    }
    if (metadata.twitter) assert.equal(metadata.twitter.title, fixedName);
  }
  for (const route of ['layout', 'oi/page', 'oi/research/banpo-xism/page', 'oi/artworks/[slug]/page']) {
    assertSiteMetadata(load(`@/app/${route}`).metadata);
  }
  assert.equal(load('@/app/layout').metadata.applicationName, fixedName);
  for (const lang of ['en', 'ko']) {
    assertSiteMetadata(load('@/lib/seo/metadata').profileMetadata(lang));
    const graph = load('@/lib/seo/structured-data').profileSchema(lang)['@graph'];
    assert.equal(graph.find((entity) => entity['@type'] === 'WebSite').name, fixedName);
    assert.equal(graph.find((entity) => entity['@type'] === 'ProfilePage').name, fixedName);
    assert.equal(graph.find((entity) => entity['@type'] === 'Person').name, 'Jeanyoon Choi');
  }
  assert(llmsIndex().startsWith(`# ${fixedName}\n`));
  assert(llmsFull().startsWith(`# ${fixedName}\n`));

  for (const item of sitemap()) assert(!item.url.includes('oi-v1'));
  for (const artwork of artworks.filter((entry) => !artworkLocales(entry).length)) {
    assert(!sitemap().some((entry) => entry.url.includes(`/artworks/${artwork.slug}`)));
    assert(!llmsIndex().includes(`/artworks/${artwork.slug}`));
  }
  const fixture = { slug: 'seo-test-only', title: 'Fixture', year: '2026', width: 960, height: 720,
    updated: '2026-09-26', image: '/test-image.jpg', content: {
      en: { title: 'Test interaction', summary: 'Test summary', paragraphs: ['A visitor connects two screens.'], medium: 'Web artwork' },
      ko: { title: '상호작용 테스트', summary: '테스트 설명', paragraphs: [] },
    } };
  artworks.push(fixture);
  try {
    assert.equal(artworkText(fixture, 'ko'), undefined);
    assert.deepEqual(artworkLocales(fixture), ['en']);
    assert.equal(artworkMetadata(fixture, 'en').alternates.languages.ko, undefined);
    fixture.content.ko.paragraphs.push('관람자가 두 화면을 연결합니다.');
    for (const lang of ['en', 'ko']) {
      const url = `https://jeanyoon.ch/oi/artworks/seo-test-only/${lang}`;
      assertSiteMetadata(artworkMetadata(fixture, lang));
      assert.equal(artworkMetadata(fixture, lang).alternates.canonical, url);
      assert.equal(artworkMetadata(fixture, lang).alternates.languages[lang], url);
      const entry = sitemap().find((entry) => entry.url === url);
      assert(entry);
      assert.equal(entry.lastModified, '2026-09-26');
      assert(llmsIndex().includes(url));
      assert(llmsFull().includes(fixture.content[lang].paragraphs[0]));
      const component = await load('@/app/oi/artworks/[slug]/[lang]/page').default({ params: Promise.resolve({ slug: fixture.slug, lang }) });
      const html = renderToStaticMarkup(component);
      assert(html.includes(fixture.content[lang].paragraphs[0]));
      assert(html.includes('application/ld+json'));
      assert.equal(artworkSchema(fixture, lang)['@graph'][1].creator['@id'], 'https://jeanyoon.ch/oi#person');
    }
    assert(!serializeJsonLd({ text: '</script><script>alert(1)</script>' }).includes('<'));
  } finally { artworks.pop(); }
  for (const lang of ['en', 'ko']) {
    const html = renderToStaticMarkup(await load('@/app/oi/[lang]/page').default({ params: Promise.resolve({ lang }) }));
    assert(html.includes(`<main lang="${lang}"`));
    assert(html.includes('href="/oi/en"'));
    assert(html.includes('href="/oi/ko"'));
    assert(html.includes(lang === 'ko' ? '인터랙티브' : 'interactive'));
  }
  await assert.rejects(() => load('@/app/oi/[lang]/page').default({ params: Promise.resolve({ lang: 'invalid' }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
  await assert.rejects(() => load('@/app/oi/artworks/[slug]/[lang]/page').default({ params: Promise.resolve({ slug: 'missing', lang: 'en' }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
  const React = require('react');
  const terminalHtml = renderToStaticMarkup(React.createElement(load('@/app/oi/terminal').default, { projects: [] }));
  assert.equal((terminalHtml.match(/<h1[ >]/g) || []).length, 1);
  assert(terminalHtml.includes('<h2'));
  assert(terminalHtml.includes('최정윤'));
  assert(terminalHtml.includes('인터랙티브'));
  assert(terminalHtml.includes('id="panel-about" hidden=""'));
  assert(terminalHtml.includes('id="panel-artworks" hidden=""'));
  assert(terminalHtml.includes('href="/oi/artworks/banpo-xism"'));
  for (const term of ['미디어 아트', '인터랙티브 아트', '미디어 아트 연구', '웹 아트', '컨템포러리 웹 아트', '넷 아트', '웹 아트 연구자', 'media art', 'interactive art', 'media art research', 'web art', 'contemporary web art', 'net art', 'web art researcher']) {
    assert(terminalHtml.includes(term), `Missing actual About content: ${term}`);
    assert(llmsFull().includes(term), `Missing LLM text: ${term}`);
  }
  assert(!terminalHtml.includes('Text index'));
  assert(!terminalHtml.includes('텍스트 목록'));
  assert(!terminalHtml.includes('href="/oi/en"'));
  assert(!terminalHtml.includes('href="/oi/ko"'));
  for (const route of ['llms.txt', 'llm.txt', 'llms-full.txt']) {
    const response = load(`@/app/${route}/route`).GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Content-Type'), 'text/plain; charset=utf-8');
    assert((await response.text()).includes('https://jeanyoon.ch/oi'));
  }
  const { GET } = load('@/app/share-image/route');
  const image = GET();
  assert(image.headers.get('content-type').includes('image/png'));
  const bytes = new Uint8Array(await image.arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  console.log('SEO checks passed: bilingual HTML, real-content filtering, canonical/hreflang, sitemap, artwork schema, text routes, PNG share image and 404s.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
