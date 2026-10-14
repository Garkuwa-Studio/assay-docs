// Prints the architecture page to public/assay-architecture.pdf. Run after
// `pnpm build` (it serves dist/ itself) and commit the PDF.
// Needs Google Chrome, or set CHROME_PATH.
//
//   pnpm build && pnpm pdf
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// A minimal static server for dist/ (no dependencies).
const DIST = join(ROOT, "dist");
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".json": "application/json",
  ".pdf": "application/pdf",
};
const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname));
  if (path.endsWith("/")) path += "index.html";
  const file = join(DIST, path);
  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
// Port 0: a free port, so a server already running elsewhere can't answer instead.
await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
const address = server.address();
const PORT = typeof address === "object" && address ? address.port : 0;

try {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage();
  await page.emulateMedia({ colorScheme: "light", media: "print" });
  await page.goto(`http://127.0.0.1:${PORT}/project/architecture/`, { waitUntil: "networkidle" });
  await page.pdf({
    path: join(ROOT, "public/assay-architecture.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      '<div style="font:8px sans-serif;width:100%;text-align:center;color:#4e535a">Assay, by Garkuwa Labs · Technical architecture · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  await browser.close();
  console.log("wrote public/assay-architecture.pdf");
} finally {
  server.close();
}
