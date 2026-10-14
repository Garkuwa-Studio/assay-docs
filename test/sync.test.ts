import { describe, expect, it } from "vitest";
import {
  extractMermaid,
  rewriteLink,
  rewriteLinks,
  splitTitle,
  toPage,
} from "../scripts/lib/sync.mjs";

const source = { repo: "Garkuwa-Studio/assay", ref: "a9ab9858f6f6056f6bfb450161c6892ab93405f8" };

describe("rewriteLink", () => {
  it("maps synced files to site routes, keeping the anchor", () => {
    expect(rewriteLink("DEMO-RUN.md", "docs/TESTNET.md", source)).toBe("/evidence/demo-run/");
    expect(rewriteLink("STACK-STATUS.md#7-lending", "docs/CENSUS-v0.md", source)).toBe(
      "/evidence/stack-status/#7-lending",
    );
    expect(rewriteLink("../SECURITY.md", "docs/ARCHITECTURE.md", source)).toBe(
      "/project/security/",
    );
    expect(rewriteLink("PILOT.md", "docs/SEP-DRAFT-reserve-report.md", source)).toBe(
      "/build/issuers/",
    );
  });
  it("points other relative links at GitHub at the pinned commit", () => {
    expect(rewriteLink("audit/e2e-receipts/x.json", "docs/TESTNET.md", source)).toBe(
      `https://github.com/Garkuwa-Studio/assay/blob/${source.ref}/docs/audit/e2e-receipts/x.json`,
    );
    expect(rewriteLink("../contracts/demo-pool", "docs/PILOT.md", source)).toBe(
      `https://github.com/Garkuwa-Studio/assay/tree/${source.ref}/contracts/demo-pool`,
    );
  });
  it("leaves absolute URLs, mailto and in-page anchors alone", () => {
    for (const t of ["https://assay.wtf/", "mailto:a@b.c", "#heading"]) {
      expect(rewriteLink(t, "docs/X.md", source)).toBe(t);
    }
  });
});

describe("rewriteLinks", () => {
  it("rewrites markdown links but not code", () => {
    const md = "See [run](DEMO-RUN.md) and `[x](DEMO-RUN.md)`.\n```\n[y](DEMO-RUN.md)\n```";
    expect(rewriteLinks(md, "docs/TESTNET.md", source)).toBe(
      "See [run](/evidence/demo-run/) and `[x](DEMO-RUN.md)`.\n```\n[y](DEMO-RUN.md)\n```",
    );
  });
});

describe("splitTitle", () => {
  it("takes the first H1 outside code fences", () => {
    expect(splitTitle("# Census v0\n\nBody")).toEqual({ title: "Census v0", body: "Body" });
    const sep = "## Preamble\n```toml\n# issuer's stellar.toml\n```\n";
    expect(splitTitle(sep)).toEqual({ title: null, body: sep });
  });
});

describe("extractMermaid", () => {
  it("replaces each diagram with a figure and keeps the source", () => {
    const { body, diagrams } = extractMermaid(
      "## 5.1 Board check [Built]\n```mermaid\nflowchart LR\nA-->B\n```\ntext",
      "architecture",
    );
    expect(diagrams).toEqual([
      { file: "architecture-1.svg", source: "flowchart LR\nA-->B", heading: "5.1 Board check" },
    ]);
    expect(body).toContain(
      '<img src="/diagrams/architecture-1.svg" alt="Diagram: 5.1 Board check"',
    );
    expect(body).toContain("<summary>Diagram source (Mermaid)</summary>");
    expect(body).not.toContain("```mermaid");
  });
});

describe("toPage", () => {
  it("adds frontmatter, an edit link to the core repo and the provenance note", () => {
    const page = toPage({ title: 'A "title"', body: "Body", path: "docs/X.md", source });
    expect(page).toMatch(
      /^---\ntitle: "A \\"title\\""\neditUrl: "https:\/\/github.com\/Garkuwa-Studio\/assay\/edit\/main\/docs\/X.md"\n---/,
    );
    expect(page).toContain("at commit `a9ab985`");
  });
});
