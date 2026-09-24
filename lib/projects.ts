export type Project = {
  id: string;
  title: string;
  year: string;
  kind: string;
  summary: string;
  url: string;
  status: string;
  order: number;
};

// These are interface samples, not claims about existing works.
const samples: Project[] = [
  { id: "sample-1", title: "Project title", year: "2026", kind: "Web artwork", summary: "A short description will appear here.", url: "", status: "sample", order: 1 },
  { id: "sample-2", title: "Another project", year: "2025", kind: "Installation", summary: "Project information can come from a Google Sheet.", url: "", status: "sample", order: 2 },
  { id: "sample-3", title: "A third entry", year: "2024", kind: "Research", summary: "This structure can change with the portfolio ontology.", url: "", status: "sample", order: 3 },
];

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field); field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error("Unclosed quoted CSV field");
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function safeLink(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch { return ""; }
}

export function projectsFromCsv(csv: string): Project[] {
  const [headers, ...rows] = parseCsv(csv.replace(/^\uFEFF/, ""));
  if (!headers) throw new Error("The CSV has no header row");
  const keys = headers.map((header) => header.trim().toLowerCase());
  if (!keys.includes("id") || !keys.includes("title")) {
    throw new Error("The sheet needs id and title columns");
  }
  const get = (row: string[], key: string) => (row[keys.indexOf(key)] ?? "").trim();
  const projects = rows.map((row, index) => ({
    id: get(row, "id"), title: get(row, "title"), year: get(row, "year"),
    kind: get(row, "kind"), summary: get(row, "summary"),
    url: safeLink(get(row, "url")), status: get(row, "status"),
    order: Number(get(row, "order")) || index + 1,
  })).filter((project) => project.id && project.title && project.status.toLowerCase() !== "hidden");
  return projects.sort((a, b) => a.order - b.order);
}

export async function getProjects(): Promise<Project[]> {
  const source = process.env.GOOGLE_SHEET_CSV_URL;
  if (!source) return samples;
  try {
    const url = new URL(source);
    if (url.protocol !== "https:") throw new Error("The sheet URL must use HTTPS");
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`Sheet returned ${response.status}`);
    return projectsFromCsv(await response.text());
  } catch (error) {
    console.error("Could not load the project sheet:", error);
    return samples;
  }
}
