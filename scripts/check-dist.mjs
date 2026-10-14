// Post-build checks on dist/ (run after `pnpm build`). Internal links and
// headings are already checked by starlight-links-validator during the
// build; this covers what it can't see:
//  1. every page carries the disclaimer;
//  2. no page points at localhost (canonical and share URLs);
//  3. every /diagrams/*.svg and the architecture PDF referenced exists.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const pages = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pages.push(p);
  }
};
walk(DIST);

const errors = [];
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  const rel = p.slice(DIST.length);
  if (/localhost|127\.0\.0\.1/.test(html)) errors.push(`${rel}: points at localhost`);
  if (rel !== "/404.html" && !html.includes("not an audit and not investment advice"))
    errors.push(`${rel}: no disclaimer`);
  for (const [, ref] of html.matchAll(
    /(?:href|src)="(\/(?:diagrams\/[^"]+|assay-architecture\.pdf))"/g,
  )) {
    if (!existsSync(join(DIST, ref))) errors.push(`${rel}: missing file ${ref}`);
  }
}

if (pages.length < 40) errors.push(`only ${pages.length} pages built`);
if (errors.length) {
  console.error(`${errors.length} problem(s):\n${[...new Set(errors)].slice(0, 50).join("\n")}`);
  process.exit(1);
}
console.log(
  `dist ok: ${pages.length} pages, disclaimer on every page, no localhost, all files present`,
);
