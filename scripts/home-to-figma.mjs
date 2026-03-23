/**
 * home-to-figma.mjs
 *
 * Screenshots the Home page and uploads it to Figma as an image frame.
 *
 * Usage:
 *   node scripts/home-to-figma.mjs
 */

import { chromium } from "playwright";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env
const envPath = resolve(ROOT, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && !k.startsWith("#") && rest.length) {
      process.env[k.trim()] = rest.join("=").trim();
    }
  }
}

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY    = process.env.FIGMA_PRODUCT_FILE ?? process.env.FIGMA_SAGE_FILE ?? "jqbwmzpJiaOxeLYukWvLpn";
const BASE_URL    = "http://localhost:5177";
const FRAME_W     = 1440;
const FRAME_H     = 900;

if (!FIGMA_TOKEN) {
  console.error("❌  FIGMA_TOKEN is not set in .env");
  process.exit(1);
}

function figmaRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: "api.figma.com",
      path,
      method,
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        ...(data ? {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        } : {}),
      },
    }, (res) => {
      let raw = "";
      res.on("data", d => raw += d);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function uploadImage(imageBuffer) {
  return new Promise((resolve, reject) => {
    const boundary = "figmaboundary" + Date.now();
    const CRLF = "\r\n";
    const header = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="image"; filename="capture.png"${CRLF}` +
      `Content-Type: image/png${CRLF}${CRLF}`
    );
    const footer = Buffer.from(`${CRLF}--${boundary}--${CRLF}`);
    const body = Buffer.concat([header, imageBuffer, footer]);

    const req = https.request({
      hostname: "api.figma.com",
      path: `/v1/images/${FILE_KEY}`,
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
      },
    }, (res) => {
      let raw = "";
      res.on("data", d => raw += d);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log("\n🚀 Home → Figma\n");

  // 1. Validate token
  console.log("🔑 Validating Figma token...");
  const me = await figmaRequest("GET", "/v1/me");
  if (me.status !== 200 || !me.body?.email) {
    console.error("❌  Invalid token or wrong scope.");
    console.error("    Response:", JSON.stringify(me.body).slice(0, 200));
    process.exit(1);
  }
  console.log(`   ✓ Authenticated as ${me.body.email}`);

  // 2. Check Figma file
  console.log("📄 Checking Figma file...");
  const file = await figmaRequest("GET", `/v1/files/${FILE_KEY}?depth=1`);
  if (file.status !== 200) {
    console.error("❌  Cannot access Figma file.");
    console.error("    Response:", JSON.stringify(file.body).slice(0, 200));
    process.exit(1);
  }
  console.log(`   ✓ File: ${file.body.name}`);

  const pageId = file.body.document?.children?.[0]?.id;
  if (!pageId) {
    console.error("❌  Could not find first page in file.");
    process.exit(1);
  }

  // 3. Screenshot home page
  console.log("\n📸 Capturing Home page...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: FRAME_W, height: FRAME_H } });
  const page = await context.newPage();

  const url = `${BASE_URL}/?tab=product`;
  await page.goto(url, { waitUntil: "networkidle" });
  await new Promise(r => setTimeout(r, 600));

  const buf = await page.screenshot({ fullPage: false });
  await browser.close();
  console.log("   ✓ Screenshot taken");

  // 4. Upload image to Figma
  console.log("\n⬆️  Uploading to Figma...");
  const upload = await uploadImage(buf);

  if (upload.status !== 200 || !upload.body?.imageRef) {
    // Save locally as fallback
    console.log(`   ⚠️  Upload failed (${upload.status}): ${JSON.stringify(upload.body).slice(0, 200)}`);
    console.log("   Saving screenshot locally...");
    const { default: fs } = await import("fs");
    fs.writeFileSync("/tmp/home-capture.png", buf);
    console.log("   Saved: /tmp/home-capture.png  (drag into Figma manually)");
    return;
  }

  const imageRef = upload.body.imageRef;
  console.log(`   ✓ imageRef: ${imageRef}`);

  // 5. Create frame in Figma
  console.log("\n🖼️  Creating frame in Figma...");
  const createResult = await figmaRequest(
    "POST",
    `/v1/files/${FILE_KEY}/nodes`,
    {
      nodes: [{
        parentId: pageId,
        type: "FRAME",
        name: "Product / Home",
        x: 0,
        y: 0,
        width: FRAME_W,
        height: FRAME_H,
        fills: [{
          type: "IMAGE",
          scaleMode: "FILL",
          imageRef,
        }],
      }],
    }
  );

  if (createResult.status === 200 || createResult.status === 201) {
    console.log(`
✅  Done!
    Frame "Product / Home" added to Figma
    File: https://figma.com/design/${FILE_KEY}
    `);
  } else {
    console.log(`   ⚠️  Frame creation response (${createResult.status}):`, JSON.stringify(createResult.body).slice(0, 400));
    console.log("\n   Saving screenshot locally as fallback...");
    const { default: fs } = await import("fs");
    fs.writeFileSync("/tmp/home-capture.png", buf);
    console.log("   Saved: /tmp/home-capture.png  (drag into Figma manually)");
  }
}

main().catch(e => {
  console.error("\n❌  Fatal error:", e.message);
  process.exit(1);
});
