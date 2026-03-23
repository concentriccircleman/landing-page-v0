#!/usr/bin/env node
import { chromium } from 'playwright';

const url = 'http://localhost:5177/';

async function checkPage() {
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
    await page.screenshot({ path: 'current-state-screenshot.png', fullPage: true });
    console.log('\n✓ Screenshot saved to current-state-screenshot.png');
    
    // Get page title
    const title = await page.title();
    console.log(`\n✓ Page title: ${title}`);
    
    // Check if root element has content
    const rootContent = await page.$eval('#root', el => ({
      innerHTML: el.innerHTML.substring(0, 1000),
      childElementCount: el.childElementCount,
      textContent: el.textContent?.substring(0, 500)
    }));
    
    console.log(`\n✓ Root element:`);
    console.log(`  - Child elements: ${rootContent.childElementCount}`);
    console.log(`  - Text content (first 500 chars): ${rootContent.textContent}`);
    console.log(`  - HTML (first 1000 chars): ${rootContent.innerHTML}`);
    
    // Check for tab navigation
    const tabNav = await page.evaluate(() => {
      // Look for common tab navigation patterns
      const tabs = document.querySelectorAll('[role="tab"], [data-tab], .tab, button[aria-selected]');
      return {
        found: tabs.length > 0,
        count: tabs.length,
        labels: Array.from(tabs).slice(0, 10).map(tab => tab.textContent?.trim() || tab.getAttribute('aria-label'))
      };
    });
    
    console.log(`\n✓ Tab Navigation:`);
    console.log(`  - Found: ${tabNav.found}`);
    console.log(`  - Count: ${tabNav.count}`);
    if (tabNav.labels.length > 0) {
      console.log(`  - Labels: ${tabNav.labels.join(', ')}`);
    }
    
    // Summary
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Summary:`);
    console.log(`  - Console messages: ${consoleMessages.length}`);
    console.log(`  - Page errors: ${errors.length}`);
    console.log(`  - Tab navigation visible: ${tabNav.found ? 'YES' : 'NO'}`);
    
    if (errors.length > 0) {
      console.log(`\n⚠ Errors found:`);
      errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }
    
    if (consoleMessages.length > 0) {
      console.log(`\n📝 Console messages (first 20):`);
      consoleMessages.slice(0, 20).forEach((msg, i) => {
        console.log(`  ${i + 1}. [${msg.type}] ${msg.text}`);
      });
    }
    
  } catch (err) {
    console.error(`\n✗ Failed to load page: ${err.message}`);
  } finally {
    await browser.close();
  }
}

checkPage().catch(console.error);
