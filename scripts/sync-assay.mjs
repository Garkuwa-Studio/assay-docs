// Copies the core repo's docs into this site from the commit pinned in
// assay-ref.json (downstream repos follow a pinned ref, a release tag once
// one exists). Run it by hand after bumping the ref; the output is
// committed, so building the site never needs the network.
//
//   pnpm sync
//   pnpm sync --local ../assay   # from a local checkout, before it is pushed
//
// --local copies the files as they are on disk and says so on every page;
// it leaves src/data/testnet.json alone. Run a normal sync once the core
// repo is pushed, to return to a pinned commit.
// Writes src/content/docs/<route>.md for each file in SYNCED, renders the
// Mermaid diagrams to public/diagrams/*.svg (needs Google Chrome, or set
// CHROME_PATH), and writes src/data/testnet.json from the e2e receipts.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { extractMermaid, rewriteLinks, splitTitle, SYNCED, toPage } from "./lib/sync.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const pinned = JSON.parse(readFileSync(join(ROOT, "assay-ref.json"), "utf8"));
const localArg = process.argv.indexOf("--local");
const LOCAL = localArg > 0 ? resolve(process.argv[localArg + 1] ?? "../assay") : null;
// Local copies link to GitHub's main branch, since the files may not exist
// at the pinned commit yet.
const source = LOCAL ? { repo: pinned.repo, ref: "main", local: true } : pinned;
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Reads a file from the core repo at the pinned ref through the GitHub CLI
 * (works while the repo is private; needs `gh auth login`). */
function file(path) {
  if (LOCAL) return readFileSync(join(LOCAL, path), "utf8");
  return execFileSync(
    "gh",
    [
      "api",
      "-H",
      "Accept: application/vnd.github.raw",
      `repos/${source.repo}/contents/${path}?ref=${source.ref}`,
    ],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
}

function list(path) {
  return JSON.parse(
    execFileSync("gh", ["api", `repos/${source.repo}/contents/${path}?ref=${source.ref}`], {
      encoding: "utf8",
    }),
  );
}

async function renderDiagrams(diagrams) {
  if (!diagrams.length) return new Map();
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage();
  await page.setContent("<!doctype html><body></body>");
  await page.addScriptTag({ path: join(ROOT, "node_modules/mermaid/dist/mermaid.min.js") });
  mkdirSync(join(ROOT, "public/diagrams"), { recursive: true });
  const failed = new Map();
  for (const d of diagrams) {
    const svg = await page
      .evaluate(
        async ({ id, code }) => {
          // @ts-ignore mermaid is a global in the page
          window.mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            // Plain SVG text: HTML labels (<br>, foreignObject) don't load in <img>.
            htmlLabels: false,
            flowchart: { htmlLabels: false },
            fontFamily: "Public Sans, system-ui, sans-serif",
            themeVariables: {
              background: "#f4f1ea",
              primaryColor: "#fbf9f4",
              primaryTextColor: "#1c1f24",
              primaryBorderColor: "#1c1f24",
              secondaryColor: "#ebe6db",
              tertiaryColor: "#f4f1ea",
              lineColor: "#4e535a",
              textColor: "#1c1f24",
              noteBkgColor: "#ebe6db",
              noteTextColor: "#1c1f24",
              noteBorderColor: "#a8792b",
              actorBkg: "#fbf9f4",
              actorBorder: "#1c1f24",
              signalColor: "#1c1f24",
              clusterBkg: "#ebe6db",
              clusterBorder: "#c9c3b6",
            },
          });
          // @ts-ignore
          const { svg } = await window.mermaid.render(id, code);
          return svg;
        },
        { id: d.file.replace(/\W/g, "_"), code: d.source },
      )
      .catch((e) => {
        // A broken diagram in the source must not block the docs: the page
        // says so and shows the source instead.
        failed.set(
          d.file,
          String(e.message ?? e)
            .split("\n")
            .slice(0, 2)
            .join(" "),
        );
        return null;
      });
    if (svg) {
      writeFileSync(join(ROOT, "public/diagrams", d.file), svg);
      console.log(`  diagram ${d.file}`);
    } else {
      console.warn(`  WARNING diagram ${d.file} did not render: ${failed.get(d.file)}`);
    }
  }
  await browser.close();
  return failed;
}

async function main() {
  console.log(
    LOCAL
      ? `syncing ${source.repo} from local checkout ${LOCAL}`
      : `syncing ${source.repo}@${source.ref.slice(0, 7)}`,
  );
  const diagrams = [];
  const pages = [];
  for (const [path, route, override] of SYNCED) {
    const md = file(path);
    const { title, body } = splitTitle(md);
    const name = route.split("/").pop();
    const withDiagrams = extractMermaid(body, name);
    diagrams.push(...withDiagrams.diagrams);
    const page = toPage({
      title: override ?? title ?? name,
      body: rewriteLinks(withDiagrams.body, path, source),
      path,
      source,
    });
    pages.push({ path, route, page });
  }
  const failed = await renderDiagrams(diagrams);
  for (const { path, route } of pages) {
    let { page } = pages.find((p) => p.route === route);
    for (const [file, why] of failed) {
      page = page.replace(
        new RegExp(`<figure class="diagram"><img src="/diagrams/${file}"[^\n]*</figure>`),
        `:::caution[Diagram did not render]\nThe Mermaid source in the core repo has an error (${why.replace(/[\[\]]/g, "")}). The source is below.\n:::`,
      );
    }
    const out = join(ROOT, "src/content/docs", `${route}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page);
    console.log(`  ${path} → /${route}/`);
  }

  if (LOCAL) return;

  // Testnet runs: the e2e receipts, verbatim.
  const listing = list("docs/audit/e2e-receipts");
  const runs = [];
  for (const f of listing
    .filter((f) => f.name.endsWith(".json"))
    .sort((a, b) => a.name.localeCompare(b.name))) {
    runs.push({ file: f.name, ...JSON.parse(file(`docs/audit/e2e-receipts/${f.name}`)) });
  }
  writeFileSync(
    join(ROOT, "src/data/testnet.json"),
    `${JSON.stringify({ source: { repo: source.repo, ref: source.ref }, runs }, null, 2)}\n`,
  );
  console.log(`  ${runs.length} testnet receipts → src/data/testnet.json`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
