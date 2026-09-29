// Compile content/cv/cv.tex (the single CV source) into the downloadable PDF.
// Requires tectonic (`brew install tectonic`); run: node scripts/build-cv.cjs
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'content/cv/cv.tex');
const target = path.join(root, 'public/cv/JeanyoonChoi_CV.pdf');
const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-'));

try {
  execFileSync('tectonic', ['--outdir', outdir, source], { stdio: 'inherit' });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(outdir, 'cv.pdf'), target);
  console.log(`Wrote ${path.relative(root, target)}`);
} finally {
  fs.rmSync(outdir, { recursive: true, force: true });
}
