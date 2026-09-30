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
  if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
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
  const { artworks } = load('@/content/artworks');
  const { artworkText, artworkLocales } = load('@/lib/seo/artworks');
  const { artworkMetadata } = load('@/lib/seo/metadata');
  const { serializeJsonLd, artworkSchema } = load('@/lib/seo/structured-data');
  const sitemap = load('@/app/sitemap').default;
  const { llmsIndex, llmsFull } = load('@/lib/seo/llms');
  // Explicit user naming requirement: generic SEO work must never rename the site.
  const favicon = fs.readFileSync(path.join(root, 'public/favicon.png'));
  assert.equal(favicon.readUInt32BE(16), 96);
  assert.equal(favicon.readUInt32BE(20), 96);
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
  for (const route of ['layout', 'oi/page', 'oi/research/banpo-xism/page']) {
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
  for (const artwork of artworks) {
    assert.deepEqual(artworkLocales(artwork), ['en', 'ko']);
    const metadata = await load('@/app/oi/artworks/[slug]/page').generateMetadata({ params: Promise.resolve({ slug: artwork.slug }) });
    assertSiteMetadata(metadata);
    assert.equal(metadata.robots.index, true);
    assert.equal(metadata.alternates.canonical, `https://jeanyoon.ch/oi/artworks/${artwork.slug}`);
    const html = renderToStaticMarkup(await load('@/app/oi/artworks/[slug]/page').default({ params: Promise.resolve({ slug: artwork.slug }) }));
    for (const image of artwork.images) {
      assert(html.includes(`src="${image.src}"`), `Missing server-rendered gallery image ${image.src}`);
      assert(sitemap().find((entry) => entry.url === metadata.alternates.canonical).images.includes(`https://jeanyoon.ch${image.src}`));
    }
    assert(html.includes('Artwork by Jeanyoon Choi'));
    assert(html.includes('href="/oi"'));
    assert.equal(artworkSchema(artwork, 'en')['@graph'][1].image.length, artwork.images.length);
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
      const url = `https://jeanyoon.ch/oi/artworks/seo-test-only${lang === "en" ? "" : "/ko"}`;
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
  assert(!terminalHtml.includes('최정윤'));
  assert(!terminalHtml.includes('인터랙티브'));
  assert(terminalHtml.includes('id="panel-about" hidden=""'));
  assert(terminalHtml.includes('id="panel-artworks" hidden=""'));
  assert(terminalHtml.includes('href="/oi/artworks/banpo-xism"'));
  assert(terminalHtml.includes('provocatively interactive environments'));
  assert(terminalHtml.includes('href="mailto:jeanyoon.choi@kaist.ac.kr"'));
  // The terminal links the /oi/cv page (which offers the PDF download).
  assert((terminalHtml.match(/href="\/oi\/cv"/g) || []).length >= 1);
  for (const term of ['미디어 아트', '컨템포러리 웹 아트', '넷 아트', 'media art research', 'contemporary web art', 'net art']) {
    assert(llmsFull().includes(term), `Missing LLM text: ${term}`);
  }
  assert(llmsFull().includes('동시대 사회기술 시스템의 복잡성'));
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
  // Entry pages, SoTA citation record and the portfolio-jyc.org redirect map.
  const { entryList, collections } = load('@/lib/seo/collections');
  for (const collection of collections) {
    const route = load(`@/app/oi/${collection}/[slug]/page`);
    const index = load(`@/app/oi/${collection}/page`);
    assertSiteMetadata(index.metadata);
    assert.equal(index.metadata.alternates.canonical, `https://jeanyoon.ch/oi/${collection}`);
    assert(sitemap().some((entry) => entry.url === `https://jeanyoon.ch/oi/${collection}`));
    const indexHtml = renderToStaticMarkup(index.default());
    for (const entry of entryList(collection)) {
      const url = `https://jeanyoon.ch/oi/${collection}/${entry.slug}`;
      const params = Promise.resolve({ slug: entry.slug });
      const metadata = await route.generateMetadata({ params });
      assertSiteMetadata(metadata);
      assert.equal(metadata.alternates.canonical, url);
      assert(metadata.description.length > 20 && metadata.description.length <= 170, url);
      assert(sitemap().some((item) => item.url === url), `Sitemap misses ${url}`);
      assert(llmsIndex().includes(url));
      assert(indexHtml.includes(`href="/oi/${collection}/${entry.slug}"`));
      assert(terminalHtml.includes(`href="/oi/${collection}/${entry.slug}"`), `Terminal does not link ${url}`);
    }
    const sample = entryList(collection)[0];
    const html = renderToStaticMarkup(await route.default({ params: Promise.resolve({ slug: sample.slug }) }));
    // Direct entry URLs render the terminal with the entry already opened.
    assert(html.includes('application/ld+json') && html.includes(`cat ${sample.slug}`) && html.includes(sample.title) && html.includes('id="panel-'));
    await assert.rejects(() => route.default({ params: Promise.resolve({ slug: "missing" }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
  }
  const sotaPage = load('@/app/oi/research/sota/page');
  assertSiteMetadata(sotaPage.metadata);
  assert.equal(sotaPage.metadata.other.citation_doi, '10.1145/3800645.3812889');
  const sotaHtml = renderToStaticMarkup(sotaPage.default());
  assert(sotaHtml.includes('ScholarlyArticle') && sotaHtml.includes('cat sota') && sotaHtml.includes('id="panel-'));
  assert((await load('@/app/oi/research/sota.md/route').GET().text()).includes('https://jeanyoon.ch/oi/research/sota'));
  const staticRoutes = new Set(['/oi', '/oi/en', '/oi/cv', '/oi/research/sota', '/oi/research/sota.md', '/llms.txt', '/cv/JeanyoonChoi_CV.pdf', ...collections.map((c) => `/oi/${c}`)]);
  for (const { source, destination } of require('../content/legacy-redirects.json')) {
    const [, section, collection, slug] = destination.split('/');
    const ok = staticRoutes.has(destination)
      || (section === 'oi' && collections.includes(collection) && entryList(collection).some((entry) => entry.slug === slug))
      || (section === 'oi' && collection === 'artworks' && artworks.some((entry) => entry.slug === slug))
      || fs.existsSync(path.join(root, 'public', destination));
    assert(ok, `Legacy redirect ${source} -> ${destination} has no destination`);
  }
  console.log('SEO checks passed: bilingual HTML, real-content filtering, canonical/hreflang, sitemap, artwork schema, text routes, PNG share image and 404s.');
}
module.exports = { load };
if (require.main === module) main().catch((error) => { console.error(error); process.exitCode = 1; });
