import { chromium } from 'playwright';

async function investigatePage() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect all console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  // Collect network errors
  const networkErrors = [];
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText
    });
    console.log(`[NETWORK ERROR] ${request.url()} - ${request.failure()?.errorText}`);
  });

  console.log('\nNavigating to http://localhost:5177/...');
  await page.goto('http://localhost:5177/', { waitUntil: 'networkidle' });

  console.log('\nWaiting 3 seconds for page to fully load...');
  await page.waitForTimeout(3000);

  console.log('\nTaking screenshot...');
  await page.screenshot({ path: 'investigation-screenshot.png', fullPage: true });

  console.log('\n=== DOM STATE ===');
  const rootHTML = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? root.innerHTML : 'ROOT NOT FOUND';
  });
  console.log('Root innerHTML length:', rootHTML.length);
  console.log('Root innerHTML preview:', rootHTML.substring(0, 500));

  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('\nBody innerHTML length:', bodyHTML.length);

  const hasContent = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      rootExists: !!root,
      rootHasChildren: root?.children.length || 0,
      rootTextContent: root?.textContent?.trim().substring(0, 100) || '',
      bodyHasChildren: document.body.children.length
    };
  });
  console.log('\nContent check:', JSON.stringify(hasContent, null, 2));

  console.log('\n=== CONSOLE MESSAGES ===');
  console.log(`Total messages: ${consoleMessages.length}`);
  consoleMessages.forEach((msg, i) => {
    console.log(`${i + 1}. [${msg.type}] ${msg.text}`);
    if (msg.location) {
      console.log(`   Location: ${msg.location.url}:${msg.location.lineNumber}`);
    }
  });

  console.log('\n=== PAGE ERRORS ===');
  console.log(`Total errors: ${pageErrors.length}`);
  pageErrors.forEach((err, i) => {
    console.log(`${i + 1}. ${err}`);
  });

  console.log('\n=== NETWORK ERRORS ===');
  console.log(`Total network errors: ${networkErrors.length}`);
  networkErrors.forEach((err, i) => {
    console.log(`${i + 1}. ${err.url} - ${err.failure}`);
  });

  console.log('\n=== LOADED SCRIPTS ===');
  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src,
      type: s.type,
      hasContent: s.innerHTML.length > 0
    }));
  });
  console.log(JSON.stringify(scripts, null, 2));

  console.log('\n=== HEAD CONTENT ===');
  const headContent = await page.evaluate(() => document.head.innerHTML);
  console.log(headContent);

  console.log('\n=== COMPUTED STYLES ON ROOT ===');
  const rootStyles = await page.evaluate(() => {
    const root = document.getElementById('root');
    if (!root) return 'ROOT NOT FOUND';
    const styles = window.getComputedStyle(root);
    return {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      width: styles.width,
      height: styles.height,
      overflow: styles.overflow
    };
  });
  console.log(JSON.stringify(rootStyles, null, 2));

  console.log('\n=== INVESTIGATION COMPLETE ===');
  console.log('Screenshot saved to: investigation-screenshot.png');

  // Keep browser open for 30 seconds so user can inspect
  console.log('\nBrowser will stay open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);

  await browser.close();
}

investigatePage().catch(console.error);
