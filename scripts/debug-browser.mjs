#!/usr/bin/env node
import { chromium } from 'playwright';

const url = 'http://localhost:5177/';

async function debugPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    console.log(`[CONSOLE ${type.toUpperCase()}] ${text}`);
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error(`[PAGE ERROR] ${error.message}`);
  });
  
  try {
    console.log(`\nNavigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    
    // Wait a bit for any async content to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('\n✓ Screenshot saved to debug-screenshot.png');
    
    // Get page title
    const title = await page.title();
    console.log(`\n✓ Page title: ${title}`);
    
    // Check if root element has content
    const rootContent = await page.$eval('#root', el => ({
      innerHTML: el.innerHTML.substring(0, 500),
      childElementCount: el.childElementCount,
      textContent: el.textContent?.substring(0, 200)
    }));
    
    console.log(`\n✓ Root element:`);
    console.log(`  - Child elements: ${rootContent.childElementCount}`);
    console.log(`  - Text content (first 200 chars): ${rootContent.textContent}`);
    console.log(`  - HTML (first 500 chars): ${rootContent.innerHTML}`);
    
    // Summary
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Summary:`);
    console.log(`  - Console messages: ${consoleMessages.length}`);
    console.log(`  - Page errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log(`\n⚠ Errors found:`);
      errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }
    
  } catch (err) {
    console.error(`\n✗ Failed to load page: ${err.message}`);
  } finally {
    await browser.close();
  }
}

debugPage().catch(console.error);
