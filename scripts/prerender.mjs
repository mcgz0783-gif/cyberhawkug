import puppeteer from "puppeteer-core";
import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

const DIST = join(process.cwd(), "dist");
const PORT = 4936;

const ROUTES = [
  "/",
  "/about",
  "/store",
  "/blog",
  "/contact",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refund",
];

// Simple static file server for the dist folder
function startServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
  };

  const server = createServer((req, res) => {
    let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

    // SPA fallback
    if (!existsSync(filePath) || !filePath.includes(".")) {
      filePath = join(DIST, "index.html");
    }

    try {
      const content = readFileSync(filePath);
      const ext = "." + filePath.split(".").pop();
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

async function prerender() {
  console.log("🚀 Starting prerender...");

  const server = await startServer();
  console.log(`📡 Static server on port ${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/bin/chromium",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  for (const route of ROUTES) {
    const page = await browser.newPage();

    // Block external requests to speed up rendering
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (url.startsWith(`http://localhost:${PORT}`)) {
        req.continue();
      } else if (["document", "script", "stylesheet"].includes(req.resourceType())) {
        req.continue();
      } else {
        req.abort();
      }
    });

    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: "networkidle0",
      timeout: 15000,
    });

    // Wait a bit for React to finish rendering
    await page.waitForFunction(() => document.getElementById("root")?.innerHTML?.length > 100, {
      timeout: 10000,
    });

    const html = await page.content();
    await page.close();

    // Write to correct path
    const outPath =
      route === "/"
        ? join(DIST, "index.html")
        : join(DIST, route, "index.html");

    const outDir = dirname(outPath);
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    writeFileSync(outPath, html);
    console.log(`✅ ${route} → ${outPath.replace(DIST, "dist")}`);
  }

  await browser.close();
  server.close();
  console.log(`\n🎉 Prerendered ${ROUTES.length} routes!`);
}

prerender().catch((err) => {
  console.error("❌ Prerender failed:", err);
  process.exit(1);
});
