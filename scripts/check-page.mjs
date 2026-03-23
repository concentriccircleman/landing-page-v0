import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const consoleMessages = [];
  const errors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    console.log('Navigating to http://localhost:5177/...');
    await page.goto('http://localhost:5177/', { waitUntil: 'networkidle', timeout: 10000 });
    
    console.log('\nPage loaded successfully!');
    
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('\nScreenshot saved to screenshot.png');

    const title = await page.title();
    console.log(`\nPage title: ${title}`);

    const url = page.url();
    console.log(`Current URL: ${url}`);

    console.log(`\nTotal console messages: ${consoleMessages.length}`);
    console.log(`Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n=== PAGE ERRORS ===');
      errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
    }

    const errorMessages = consoleMessages.filter(m => m.type === 'error');
    const warningMessages = consoleMessages.filter(m => m.type === 'warning');
    
    if (errorMessages.length > 0) {
      console.log('\n=== CONSOLE ERRORS ===');
      errorMessages.forEach((msg, i) => console.log(`${i + 1}. ${msg.text}`));
    }
    
    if (warningMessages.length > 0) {
      console.log('\n=== CONSOLE WARNINGS ===');
      warningMessages.forEach((msg, i) => console.log(`${i + 1}. ${msg.text}`));
    }

    if (errors.length === 0 && errorMessages.length === 0 && warningMessages.length === 0) {
      console.log('\n✅ No errors or warnings detected!');
    }

  } catch (error) {
    console.error(`\n❌ Failed to load page: ${error.message}`);
  } finally {
    await browser.close();
  }
})();
