import fs from "node:fs";
import path from "node:path";

// cv.tex is the single source of truth: /oi/cv parses it here and
// `node scripts/build-cv.cjs` compiles it into /cv/JeanyoonChoi_CV.pdf.
// The parser covers the commands this template uses (\section*, \noindent,
// \hfill, \\, \textbf, \textit, \href, escapes, inline math symbols).

export type CvInline = { text: string; bold?: boolean; italic?: boolean; href?: string };
export type CvLine = { left: CvInline[]; right: CvInline[] };
export type CvSection = { title: string; entries: CvLine[][] };
export type Cv = { name: string; header: CvLine[]; updated?: string; sections: CvSection[] };

const symbols: Record<string, string> = { "&": "&", "%": "%", "#": "#", "_": "_", "$": "$", "{": "{", "}": "}", Omega: "Ω", alpha: "α", beta: "β", neq: "≠", times: "×", cdot: "·" };

function group(source: string, start: number) {
  // Returns the contents of the brace group opening at `start` and the index after it.
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "\\") { i++; continue; }
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) return { body: source.slice(start + 1, i), end: i + 1 };
  }
  throw new Error(`Unclosed brace in CV source near: ${source.slice(start, start + 40)}`);
}

function inline(source: string, urls: string[], style: Omit<CvInline, "text"> = {}): CvInline[] {
  const out: CvInline[] = [];
  let text = "";
  const flush = () => { if (text) out.push({ ...style, text }); text = ""; };
  for (let i = 0; i < source.length;) {
    const char = source[i];
    if (char === "\\") {
      const name = /^[A-Za-z]+/.exec(source.slice(i + 1))?.[0];
      if (!name) { text += symbols[source[i + 1]] ?? source[i + 1]; i += 2; continue; }
      i += name.length + 1;
      if (symbols[name]) { text += symbols[name]; continue; }
      if (name === "textbf" || name === "textit" || name === "href") {
        while (source[i] === " ") i++;
        const first = group(source, i);
        flush();
        if (name === "href") {
          while (source[first.end] === " ") first.end++;
          const label = group(source, first.end);
          out.push(...inline(label.body, urls, { ...style, href: urls[Number(first.body)] }));
          i = label.end;
        } else {
          out.push(...inline(first.body, urls, { ...style, [name === "textbf" ? "bold" : "italic"]: true }));
          i = first.end;
        }
      }
      // Other commands (\LARGE, \noindent, …) carry no text; a following group is read as plain text.
      continue;
    }
    if (char === "{") {
      const { body, end } = group(source, i);
      flush();
      out.push(...inline(body, urls, style));
      i = end;
      continue;
    }
    if (char === "$") {
      const end = source.indexOf("$", i + 1);
      text += source.slice(i + 1, end).replace(/\\([A-Za-z]+)/g, (_, name) => symbols[name] ?? name);
      i = end + 1;
      continue;
    }
    text += char === "~" ? " " : char;
    i++;
  }
  flush();
  // Collapse LaTeX whitespace, then trim the outer edges of the line.
  const parts = out.map((part) => ({ ...part, text: part.text.replace(/\s+/g, " ") })).filter((part) => part.text);
  if (parts.length) {
    parts[0].text = parts[0].text.trimStart();
    parts[parts.length - 1].text = parts[parts.length - 1].text.trimEnd();
  }
  return parts.filter((part) => part.text);
}

function lines(source: string, urls: string[]): CvLine[] {
  return source.split(/\\\\(?:\[[^\]]*\])?/)
    .map((line) => {
      const [left, ...right] = line.split(/\\hfill\b/);
      return { left: inline(left, urls), right: inline(right.join(" "), urls) };
    })
    .filter((line) => line.left.length || line.right.length);
}

export function parseCv(tex: string): Cv {
  const urls: string[] = [];
  // Keep URLs verbatim: they may contain % (e.g. percent-encoded paths).
  const protectedTex = tex.replace(/\\href\{([^}]*)\}/g, (_, url: string) => `\\href{${urls.push(url) - 1}}`);
  const source = protectedTex.split("\n").map((line) => line.replace(/(^|[^\\])%.*$/, "$1")).join("\n");
  const body = /\\begin\{document\}([\s\S]*)\\end\{document\}/.exec(source)?.[1];
  const head = body && /\\begin\{flushleft\}([\s\S]*?)\\end\{flushleft\}/.exec(body)?.[1];
  if (!body || !head) throw new Error("CV source needs a document body with a flushleft header.");
  const [nameLine, ...header] = lines(head, urls);
  const updated = /\\fancyhead\[R\]\{([\s\S]*?)\}\s*$/m.exec(body)?.[1];
  const chunks = body.split(/\\section\*\{([^}]*)\}/);
  const sections: CvSection[] = [];
  for (let i = 1; i < chunks.length; i += 2) {
    const content = chunks[i + 1].replace(/\\label\{[^}]*\}/g, "");
    const entries = content.split(/\\noindent\b|\n\s*\n/).map((entry) => lines(entry, urls)).filter((entry) => entry.length);
    sections.push({ title: chunks[i].trim(), entries });
  }
  return {
    name: nameLine.left.map((part) => part.text).join(""),
    header,
    updated: updated ? inline(updated, urls).map((part) => part.text).join("") : undefined,
    sections,
  };
}

export const cvSourcePath = path.join(process.cwd(), "content/cv/cv.tex");
export function loadCv() { return parseCv(fs.readFileSync(cvSourcePath, "utf8")); }
