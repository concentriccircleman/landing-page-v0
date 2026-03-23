/**
 * sage-to-figma.mjs
 *
 * Screenshots all Project Sage states and uploads them to Figma
 * as labeled image frames. Uses Figma REST API — zero MCP quota.
 *
 * Usage:
 *   node scripts/sage-to-figma.mjs              # all 17 states
 *   node scripts/sage-to-figma.mjs --test       # 1 state only (smoke test)
 *   node scripts/sage-to-figma.mjs --state enhanced-notes  # specific state
 *
 * Requirements:
 *   - Dev server running on port 5177
 *   - FIGMA_TOKEN in .env (figma.com → Settings → Personal access tokens)
 *   - Scope: File content (read + write)
 */

import { chromium } from "playwright";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";

// ── Config ────────────────────────────────────────────────────────────────────

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
const FILE_KEY    = process.env.FIGMA_SAGE_FILE ?? "jqbwmzpJiaOxeLYukWvLpn";
const BASE_URL    = "http://localhost:5177";
const FRAME_W     = 1440;
const FRAME_H     = 900;
const COLS        = 4;
const GAP         = 80;
const LABEL_H     = 32;

if (!FIGMA_TOKEN) {
  console.error(`
❌  FIGMA_TOKEN is not set.

    1. Go to figma.com → profile → Settings → Personal access tokens
    2. Generate a token with "File content" (read + write) scope
    3. Add it to .env:  FIGMA_TOKEN=your_token_here
  `);
  process.exit(1);
}

// ── State manifest ────────────────────────────────────────────────────────────

const STATE_GROUPS = [
  {
    label: "Pre-Meeting",
    items: [
      { id: "desktop-idle",      label: "Desktop Idle" },
      { id: "pre-meeting-notif", label: "Brief Notification" },
      { id: "pre-meeting-brief", label: "Pre-Meeting Brief" },
      { id: "notification",      label: "Meeting Notification" },
    ],
  },
  {
    label: "Meeting",
    items: [
      { id: "meeting-active", label: "Meeting Active" },
      { id: "pill-collapsed", label: "Pill Collapsed" },
      { id: "pill-expanded",  label: "Pill Expanded" },
    ],
  },
  {
    label: "Notes Panel",
    items: [
      { id: "empty-editor",    label: "Empty Editor" },
      { id: "generate-prompt", label: "Generate Prompt" },
      { id: "enhancing",       label: "Enhancing" },
      { id: "enhanced-notes",  label: "Enhanced Notes" },
      { id: "private-notes",   label: "Private Notes" },
    ],
  },
  {
    label: "Overlays",
    items: [
      { id: "templates",      label: "Templates" },
      { id: "share",          label: "Share" },
      { id: "source-popover", label: "Source Popover" },
      { id: "transcript",     label: "Transcript" },
      { id: "chat",           label: "Chat" },
    ],
  },
];

const ALL_STATES = STATE_GROUPS.flatMap(g =>
  g.items.map(s => ({ ...s, group: g.label }))
);

// ── Args ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isTest = args.includes("--test");
const stateArg = args.find(a => !a.startsWith("--")) ??
  (args.includes("--state") ? args[args.indexOf("--state") + 1] : null);

let statesToCapture = ALL_STATES;
if (stateArg) {
  statesToCapture = ALL_STATES.filter(s => s.id === stateArg);
  if (!statesToCapture.length) {
    console.error(`❌  Unknown state: "${stateArg}"`);
    console.error(`    Valid states: ${ALL_STATES.map(s => s.id).join(", ")}`);
    process.exit(1);
  }
} else if (isTest) {
  statesToCapture = [ALL_STATES.find(s => s.id === "enhanced-notes")];
}

// ── Figma REST API helpers ────────────────────────────────────────────────────

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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Sage → Figma  (${isTest ? "TEST MODE — 1 state" : statesToCapture.length + " states"})\n`);

  // 1. Validate token + dev server
  console.log("🔑 Validating Figma token...");
  const me = await figmaRequest("GET", "/v1/me");
  if (me.status !== 200 || !me.body?.email) {
    console.error("❌  Invalid token or wrong scope. Make sure it has 'File content' write access.");
    console.error("    Response:", JSON.stringify(me.body).slice(0, 200));
    process.exit(1);
  }
  console.log(`   ✓ Authenticated as ${me.body.email}`);

  console.log("🌐 Checking dev server...");
  try {
    await new Promise((res, rej) => {
      const r = https.get ? null : null;
      // use http for localhost
      import("http").then(({ default: http }) => {
        http.get(`${BASE_URL}/`, (resp) => {
          resp.resume();
          resp.statusCode < 400 ? res() : rej(new Error("status " + resp.statusCode));
        }).on("error", rej);
      });
    });
    console.log(`   ✓ Dev server up at ${BASE_URL}`);
  } catch {
    console.error(`❌  Dev server not running at ${BASE_URL}. Start it with: bash scripts/dev.sh`);
    process.exit(1);
  }

  // 2. Get or create "Project Sage" section in the file
  console.log("\n📄 Checking Figma file...");
  const file = await figmaRequest("GET", `/v1/files/${FILE_KEY}?depth=1`);
  if (file.status !== 200) {
    console.error("❌  Cannot access Figma file. Check FIGMA_SAGE_FILE and token scope.");
    console.error("    Response:", JSON.stringify(file.body).slice(0, 200));
    process.exit(1);
  }
  console.log(`   ✓ File: ${file.body.name}`);

  const pageId = file.body.document?.children?.[0]?.id;
  if (!pageId) {
    console.error("❌  Could not find first page in file.");
    process.exit(1);
  }

  // 3. Screenshot each state with Playwright
  console.log(`\n📸 Capturing ${statesToCapture.length} state(s) with Playwright...\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: FRAME_W, height: FRAME_H } });
  const page = await context.newPage();

  const screenshots = [];
  for (const state of statesToCapture) {
    const url = `${BASE_URL}/?tab=project-sage&sage-state=${state.id}`;
    process.stdout.write(`  📷 ${state.group} / ${state.label.padEnd(22)}`);

    await page.goto(url, { waitUntil: "networkidle" });
    await sleep(400);

    const buf = await page.screenshot({ fullPage: false });
    screenshots.push({ ...state, buf });
    console.log(" ✓");
  }
  await browser.close();

  // 4. Upload screenshots to Figma and create frames
  console.log(`\n⬆️  Uploading to Figma...\n`);

  const nodeUpdates = [];

  for (let i = 0; i < screenshots.length; i++) {
    const { label, group, buf } = screenshots[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * (FRAME_W + GAP);
    const y = row * (FRAME_H + GAP + LABEL_H);

    process.stdout.write(`  ⬆️  ${label.padEnd(22)}`);

    // Upload image to get imageRef
    const upload = await uploadImage(buf);

    if (upload.status !== 200 || !upload.body?.imageRef) {
      // Figma REST API image upload has limited support — fall back to placeholder
      console.log(` ⚠️  Upload failed (${upload.status}), creating empty frame`);
      nodeUpdates.push({
        type: "FRAME",
        name: `${group} / ${label}`,
        x, y,
        width: FRAME_W,
        height: FRAME_H,
        fills: [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95, a: 1 } }],
      });
    } else {
      const imageRef = upload.body.imageRef;
      nodeUpdates.push({
        type: "FRAME",
        name: `${group} / ${label}`,
        x, y,
        width: FRAME_W,
        height: FRAME_H,
        fills: [{
          type: "IMAGE",
          scaleMode: "FILL",
          imageRef,
        }],
      });
      console.log(" ✓");
    }
  }

  // 5. Create all frames in Figma in one request
  console.log(`\n🖼️  Creating ${nodeUpdates.length} frame(s) in Figma...`);

  const createResult = await figmaRequest(
    "POST",
    `/v1/files/${FILE_KEY}/nodes`,
    { nodes: nodeUpdates.map(n => ({ ...n, parentId: pageId })) }
  );

  if (createResult.status === 200 || createResult.status === 201) {
    console.log("   ✓ Frames created");
  } else {
    console.error("   ⚠️  Frame creation response:", createResult.status, JSON.stringify(createResult.body).slice(0, 300));
    console.log("\n   Saving screenshots locally as fallback...");
    import("fs").then(({ default: fs }) => {
      const dir = "/tmp/sage-frames";
      fs.mkdirSync(dir, { recursive: true });
      for (const { id, buf } of screenshots) {
        fs.writeFileSync(`${dir}/${id}.png`, buf);
        console.log(`   Saved: ${dir}/${id}.png`);
      }
      console.log(`\n   You can drag these into Figma manually.`);
    });
    return;
  }

  console.log(`
✅  Done!
    ${statesToCapture.length} state(s) added to Figma
    File: https://figma.com/design/${FILE_KEY}
  `);
}

main().catch(e => {
  console.error("\n❌  Fatal error:", e.message);
  process.exit(1);
});
