import { chromium } from "playwright";

async function debug() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 10000 
  });
  
  console.log("Creating page...");
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  // Collect console messages
  const logs = [];
  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
  });

  // Collect errors
  const errors = [];
  page.on('pageerror', err => {
    errors.push({ msg: err.message, stack: err.stack });
  });

  try {
    console.log("\nNavigating to http://localhost:5177/...");
    await page.goto("http://localhost:5177/", { 
      waitUntil: "networkidle",
      timeout: 10000 
    });

    console.log("Waiting 3 seconds...");
    await page.waitForTimeout(3000);

    console.log("Taking screenshot...");
    await page.screenshot({ path: "debug-simple.png", fullPage: true });

    // Get DOM info
    const info = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        rootExists: !!root,
        rootHTML: root?.innerHTML || '',
        rootChildren: root?.childElementCount || 0,
        bodyChildren: document.body.childElementCount,
        bodyHTML: document.body.innerHTML.substring(0, 1000),
        scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline'),
        hasReact: root && Object.keys(root).some(k => k.startsWith('__react'))
      };
    });

    console.log("\n=== PAGE STATE ===");
    console.log(`Root exists: ${info.rootExists}`);
    console.log(`Root children: ${info.rootChildren}`);
    console.log(`Root HTML length: ${info.rootHTML.length}`);
    console.log(`Body children: ${info.bodyChildren}`);
    console.log(`Has React: ${info.hasReact}`);
    console.log(`\nScripts loaded: ${info.scripts.length}`);
    info.scripts.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

    console.log("\n=== CONSOLE MESSAGES ===");
    if (logs.length === 0) {
      console.log("(none)");
    } else {
      logs.forEach((l, i) => console.log(`${i + 1}. [${l.type}] ${l.text}`));
    }

    console.log("\n=== ERRORS ===");
    if (errors.length === 0) {
      console.log("(none)");
    } else {
      errors.forEach((e, i) => {
        console.log(`${i + 1}. ${e.msg}`);
        if (e.stack) console.log(e.stack);
      });
    }

    console.log("\n=== BODY HTML (first 1000 chars) ===");
    console.log(info.bodyHTML);

    if (info.rootHTML.length > 0) {
      console.log("\n=== ROOT HTML (first 1000 chars) ===");
      console.log(info.rootHTML.substring(0, 1000));
    }

  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await browser.close();
    console.log("\n✓ Complete. Screenshot saved to debug-simple.png");
  }
}

debug().catch(console.error);
