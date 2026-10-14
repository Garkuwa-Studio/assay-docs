// Pure helpers for sync-assay.mjs (tested in test/sync.test.ts).
import { posix } from "node:path";

/** Core-repo files copied into the site, and the route each one becomes. */
export const SYNCED = [
  ["docs/ARCHITECTURE.md", "project/architecture", "Architecture"],
  [
    "docs/SEP-DRAFT-reserve-report.md",
    "reference/report-format",
    "Reserve report format (draft SEP)",
  ],
  ["docs/CENSUS-v0.md", "evidence/census"],
  ["docs/STACK-STATUS.md", "evidence/stack-status"],
  ["docs/D0-RECOMMENDATION.md", "evidence/d0-recommendation"],
  ["docs/PRIOR-ART.md", "evidence/prior-art"],
  ["docs/TESTNET.md", "evidence/testnet-log", "Testnet log"],
  ["docs/DEMO-RUN.md", "evidence/demo-run"],
  ["docs/audit/README.md", "evidence/audit"],
  ["docs/audit/remediation-log.md", "evidence/remediation-log"],
  ["SECURITY.md", "project/security"],
  ["CONTRIBUTING.md", "project/contributing"],
  ["CHANGELOG.md", "project/changelog"],
];

/** Core-repo files that have a hand-written page here instead of a copy. */
export const ROUTED = {
  "docs/PILOT.md": "build/issuers",
};

const ROUTES = Object.fromEntries([...SYNCED.map(([p, r]) => [p, r]), ...Object.entries(ROUTED)]);

/**
 * Where a link in a synced file should point. Relative links become a route
 * on this site when the target is synced, otherwise the file on GitHub at the
 * pinned commit. Absolute URLs and in-page anchors are left alone.
 */
export function rewriteLink(target, fromPath, { repo, ref }) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#")) return target;
  const [path, hash] = target.split("#");
  const resolved = posix.normalize(posix.join(posix.dirname(fromPath), decodeURI(path)));
  const anchor = hash ? `#${hash}` : "";
  const route = ROUTES[resolved.replace(/\/$/, "")];
  if (route) return `/${route}/${anchor}`;
  const kind = /\.[a-z0-9]+$/i.test(resolved) ? "blob" : "tree";
  return `https://github.com/${repo}/${kind}/${ref}/${resolved.replace(/\/$/, "")}${anchor}`;
}

/** Rewrites every markdown link target outside code fences and inline code. */
export function rewriteLinks(markdown, fromPath, source) {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      // Split around inline code so links inside backticks stay as written.
      return line
        .split(/(`[^`]*`)/)
        .map((part, i) =>
          i % 2
            ? part
            : part.replace(
                /(\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g,
                (_, a, t, b) => `${a}${rewriteLink(t, fromPath, source)}${b}`,
              ),
        )
        .join("");
    })
    .join("\n");
}

/** Takes the first `# H1` as the page title and removes it from the body. */
export function splitTitle(markdown) {
  const lines = markdown.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    const m = !inFence && /^# (.+)$/.exec(lines[i]);
    if (m) {
      let end = i + 1;
      while (end < lines.length && lines[end].trim() === "") end++;
      return { title: m[1].trim(), body: [...lines.slice(0, i), ...lines.slice(end)].join("\n") };
    }
  }
  return { title: null, body: markdown };
}

/**
 * Replaces each ```mermaid block with a rendered SVG figure and keeps the
 * source in a <details> below it. Returns the new body and the diagrams.
 */
export function extractMermaid(markdown, name) {
  const diagrams = [];
  let heading = "";
  const out = [];
  const lines = markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h = /^#{2,4}\s+(.+)$/.exec(line);
    if (h) heading = h[1].replace(/\s*\[[^\]]*\]\s*$/, "").trim();
    if (/^```mermaid\s*$/.test(line)) {
      const src = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) src.push(lines[i++]);
      const file = `${name}-${diagrams.length + 1}.svg`;
      diagrams.push({ file, source: src.join("\n"), heading });
      const alt = heading ? `Diagram: ${heading}` : "Diagram";
      out.push(
        `<figure class="diagram"><img src="/diagrams/${file}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" /></figure>`,
        "",
        "<details>",
        "<summary>Diagram source (Mermaid)</summary>",
        "",
        "```text",
        ...src,
        "```",
        "",
        "</details>",
      );
      continue;
    }
    out.push(line);
  }
  return { body: out.join("\n"), diagrams };
}

const yamlString = (s) => JSON.stringify(s);

/** The full page: frontmatter, a note saying where the text lives, the body. */
export function toPage({ title, body, path, source }) {
  const fileUrl = `https://github.com/${source.repo}/blob/${source.ref}/${path}`;
  const editUrl = `https://github.com/${source.repo}/edit/main/${path}`;
  return [
    "---",
    `title: ${yamlString(title)}`,
    `editUrl: ${yamlString(editUrl)}`,
    "---",
    "",
    ":::note[Copied from the core repository]",
    source.local
      ? `This page is [\`${path}\`](${fileUrl}) in \`${source.repo}\`, copied from a local copy with changes not yet pushed. To change it, edit it there.`
      : `This page is [\`${path}\`](${fileUrl}) in \`${source.repo}\` at commit \`${source.ref.slice(0, 7)}\`. To change it, edit it there.`,
    ":::",
    "",
    body.trim(),
    "",
  ].join("\n");
}
