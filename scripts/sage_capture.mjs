/**
 * Captures all 17 Project Sage states into the Sentra-Recorder--Sage Figma file.
 * Uses Playwright to directly inject and trigger the Figma capture script.
 */

import { chromium } from "playwright";
import fs from "fs";
import https from "https";

const TOKEN    = JSON.parse(fs.readFileSync("/tmp/figma_mcp_token.json")).access_token;
const FILE_KEY = "jqbwmzpJiaOxeLYukWvLpn"; // Sentra-Recorder--Sage
const BASE_URL = "http://localhost:5177";
const ENDPOINT_BASE = "https://mcp.figma.com/mcp/capture";

const STATES = [
  { id: "desktop-idle",      label: "Desktop Idle",         group: "Pre-Meeting" },
  { id: "pre-meeting-notif", label: "Brief Notification",   group: "Pre-Meeting" },
  { id: "pre-meeting-brief", label: "Pre-Meeting Brief",    group: "Pre-Meeting" },
  { id: "notification",      label: "Meeting Notification", group: "Pre-Meeting" },
  { id: "meeting-active",    label: "Meeting Active",       group: "Meeting" },
  { id: "pill-collapsed",    label: "Pill Collapsed",       group: "Meeting" },
  { id: "pill-expanded",     label: "Pill Expanded",        group: "Meeting" },
  { id: "empty-editor",      label: "Empty Editor",         group: "Notes Panel" },
  { id: "generate-prompt",   label: "Generate Prompt",      group: "Notes Panel" },
  { id: "enhancing",         label: "Enhancing",            group: "Notes Panel" },
  { id: "enhanced-notes",    label: "Enhanced Notes",       group: "Notes Panel" },
  { id: "private-notes",     label: "Private Notes",        group: "Notes Panel" },
  { id: "templates",         label: "Templates",            group: "Overlays" },
  { id: "share",             label: "Share",                group: "Overlays" },
  { id: "source-popover",    label: "Source Popover",       group: "Overlays" },
  { id: "transcript",        label: "Transcript",           group: "Overlays" },
  { id: "chat",              label: "Chat",                 group: "Overlays" },
];

function mcpCall(params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      jsonrpc: "2.0", method: "tools/call", id: Date.now(), params,
    });
    const req = https.request({
      hostname: "mcp.figma.com", path: "/mcp", method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": "Bearer " + TOKEN,
        "MCP-Protocol-Version": "2024-11-05",
        "Content-Length": Buffer.byteLength(body),
        "Connection": "close",
      },
    }, (res) => {
      let raw = "";
      res.on("data", d => raw += d);
      res.on("end", () => {
        for (const line of raw.split("\n")) {
          if (line.startsWith("data:")) {
            try { return resolve(JSON.parse(line.slice(5).trim())); } catch {}
          }
        }
        resolve(null);
      });
    });
    req.on("error", reject);
    req.write(body); req.end();
  });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", d => data += d);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function extractCaptureId(r) {
  const text = r?.result?.content?.map(c => c.text).join("") ?? "";
  for (const line of text.split("\n")) {
    if (line.includes("Capture ID generated:")) {
      const parts = line.split("`");
      if (parts.length >= 2) return parts[1].trim();
    }
  }
  return null;
}

function getStatus(r) {
  const text = (r?.result?.content?.map(c => c.text).join("") ?? "").toLowerCase();
  if (text.includes("completed") || text.includes("success") || text.includes("added to figma")) return "completed";
  if (text.includes("failed") || text.includes("error")) return "failed";
  return "pending";
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("🚀 Project Sage → Sentra-Recorder--Sage\n");

  // Fetch the Figma capture script once
  console.log("📥 Fetching Figma capture script...");
  const captureScript = await fetchUrl("https://mcp.figma.com/mcp/html-to-design/capture.js");
  console.log(`   Got ${captureScript.length} bytes\n`);

  // Generate all capture IDs
  console.log("🎯 Generating capture IDs...\n");
  const captures = [];
  for (const state of STATES) {
    const r = await mcpCall({
      name: "generate_figma_design",
      arguments: { outputMode: "existingFile", fileKey: FILE_KEY },
    });
    const captureId = extractCaptureId(r);
    if (captureId) {
      captures.push({ ...state, captureId });
      console.log(`  ✓ ${state.label.padEnd(24)} ${captureId.slice(0, 12)}...`);
    } else {
      const text = r?.result?.content?.map(c => c.text).join("") ?? JSON.stringify(r ?? "null");
      console.log(`  ✗ ${state.label} — ${text.slice(0, 120)}`);
    }
    await sleep(800);
  }
  console.log(`\n✅ ${captures.length} capture IDs ready\n`);

  // Launch Playwright and capture each state
  console.log("📸 Capturing states via Playwright...\n");
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-web-security", "--allow-running-insecure-content"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  // Remove CSP headers so the injected capture script can POST to mcp.figma.com
  await context.route("**/*", async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    delete headers["content-security-policy"];
    delete headers["content-security-policy-report-only"];
    delete headers["x-frame-options"];
    await route.fulfill({ response, headers });
  });

  const page = await context.newPage();

  for (const cap of captures) {
    const url = `${BASE_URL}/?tab=project-sage&sage-state=${cap.id}`;
    const endpoint = `${ENDPOINT_BASE}/${cap.captureId}/submit`;

    console.log(`  📷 [${cap.group}] ${cap.label}`);
    await page.goto(url, { waitUntil: "networkidle" });
    await sleep(800);

    // Inject capture script
    await page.evaluate((script) => {
      const el = document.createElement("script");
      el.textContent = script;
      document.head.appendChild(el);
    }, captureScript);
    await sleep(400);

    // Trigger capture directly
    const result = await page.evaluate(
      ({ captureId, endpoint }) => {
        if (window.figma && window.figma.captureForDesign) {
          return window.figma.captureForDesign({ captureId, endpoint, selector: "body" });
        }
        return { error: "window.figma not available" };
      },
      { captureId: cap.captureId, endpoint }
    );

    if (result?.error) {
      console.log(`    ⚠️  ${result.error}`);
    } else {
      console.log(`    ↑ Submitted`);
    }
    await sleep(300);
  }

  await browser.close();
  console.log(`\n✅ All captures submitted — polling for completion...\n`);

  // Poll until all complete
  let pending = [...captures];
  const completed = [];
  const failed = [];

  for (let poll = 0; poll < 24 && pending.length > 0; poll++) {
    await sleep(5000);
    const stillPending = [];
    for (const cap of pending) {
      const r = await mcpCall({
        name: "generate_figma_design",
        arguments: { captureId: cap.captureId },
      });
      const status = getStatus(r);
      if (status === "completed") {
        console.log(`  ✅ ${cap.label}`);
        completed.push(cap);
      } else if (status === "failed") {
        console.log(`  ❌ ${cap.label}`);
        failed.push(cap);
      } else {
        stillPending.push(cap);
      }
      await sleep(100);
    }
    pending = stillPending;
    if (pending.length > 0) {
      console.log(`  ⏳ ${pending.length} still processing (poll ${poll + 1}/24)...`);
    }
  }

  console.log("\n══════════════════════════════");
  console.log(`✅ Completed: ${completed.length}/${captures.length}`);
  if (failed.length) console.log(`❌ Failed:    ${failed.length}`);
  if (pending.length) console.log(`⏳ Timed out: ${pending.length}`);
  console.log(`\n🔗 figma.com/design/${FILE_KEY}`);
}

main().catch(e => { console.error(e); process.exit(1); });
