import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  try {
    await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ 
      path: 'localhost-state-check.png',
      fullPage: false
    });

    // Check if tab navigation exists
    const tabNavExists = await page.locator('[role="tablist"], .tabs, [data-testid*="tab"]').count();
    
    // Get page title
    const title = await page.title();
    
    // Get visible text content (first 500 chars)
    const bodyText = await page.locator('body').textContent();
    const visibleText = bodyText?.trim().substring(0, 500) || '';

    console.log('=== PAGE STATE REPORT ===');
    console.log('Title:', title);
    console.log('Tab navigation found:', tabNavExists > 0 ? 'YES' : 'NO');
    console.log('Tab navigation count:', tabNavExists);
    console.log('\n=== VISIBLE TEXT (first 500 chars) ===');
    console.log(visibleText);
    console.log('\n=== CONSOLE ERRORS ===');
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
    } else {
      console.log('No console errors');
    }
    console.log('\n=== PAGE ERRORS ===');
    if (pageErrors.length > 0) {
      pageErrors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
    } else {
      console.log('No page errors');
    }
    console.log('\n=== SCREENSHOT ===');
    console.log('Saved to: localhost-state-check.png');

  } catch (error) {
    console.error('Error navigating to page:', error.message);
  } finally {
    await browser.close();
  }
})();
