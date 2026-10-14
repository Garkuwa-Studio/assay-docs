// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";

// SITE_URL overrides the production origin (canonical and share URLs), e.g.
// for a preview deploy. Defaults to the live domain so a build without the
// variable never ships localhost URLs.
const site = process.env.SITE_URL || "https://docs.assay.wtf";

export default defineConfig({
  site,
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Assay docs",
      description:
        "Open proof of reserves and circuit breakers for real-world assets and stablecoins on Stellar. By Garkuwa Labs.",
      logo: { src: "./src/assets/mark.svg", alt: "" },
      favicon: "/favicon.svg",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/Garkuwa-Studio/assay" },
      ],
      editLink: { baseUrl: "https://github.com/Garkuwa-Studio/assay-docs/edit/main/" },
      customCss: [
        "@fontsource-variable/besley/wght.css",
        "@fontsource-variable/public-sans/wght.css",
        "@fontsource/ibm-plex-mono/latin-400.css",
        "@fontsource/ibm-plex-mono/latin-500.css",
        "./src/styles/assay.css",
      ],
      head: [
        { tag: "meta", attrs: { property: "og:image", content: `${site}/og.png` } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
      ],
      components: {
        Footer: "./src/components/Footer.astro",
      },
      credits: false,
      lastUpdated: false,
      // Files in public/ aren't pages; scripts/check-dist.mjs checks they exist.
      plugins: [starlightLinksValidator({ exclude: ["/assay-architecture.pdf", "/diagrams/**"] })],
      sidebar: [
        {
          label: "Understand",
          items: [
            "understand/what-is-assay",
            "understand/why-it-matters",
            "understand/how-it-works",
            "understand/reading-the-board",
            "understand/reserve-reports",
            "understand/circuit-breaker",
            "understand/limits",
            "understand/faq",
            "understand/glossary",
          ],
        },
        {
          label: "Build",
          items: [
            "build/quickstart",
            "build/testnet-setup",
            "build/registry-demo",
            "build/circuit-breaker-demo",
            "build/issuers",
            "build/protocols",
            "build/verify-a-report",
            "build/status-rules",
            "build/evidence-checks",
          ],
        },
        {
          label: "Reference",
          items: [
            "reference/contracts",
            "reference/registry",
            "reference/guard",
            "reference/demo-pool",
            "reference/sdk",
            "reference/scripts",
            "reference/report-format",
            "reference/board-data",
          ],
        },
        {
          label: "Project",
          items: [
            "project/architecture",
            "project/flow-map",
            "project/roadmap",
            "project/testnet",
            "project/video",
            "project/corrections",
            "project/security",
            "project/contributing",
            "project/changelog",
          ],
        },
        {
          label: "Evidence",
          collapsed: true,
          items: [
            "evidence/census",
            "evidence/stack-status",
            "evidence/d0-recommendation",
            "evidence/prior-art",
            "evidence/testnet-log",
            "evidence/demo-run",
            "evidence/audit",
            "evidence/remediation-log",
          ],
        },
      ],
    }),
  ],
});
