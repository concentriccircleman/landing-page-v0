import { chromium } from 'playwright';

async function quickCheck() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const messages = { console: [], errors: [], network: [] };
  
  page.on('console', msg => messages.console.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => messages.errors.push(err.message));
  page.on('requestfailed', req => messages.network.push(`${req.url()} - ${req.failure()?.errorText}`));

  console.log('Navigating to http://localhost:5177/...');
  await page.goto('http://localhost:5177/', { waitUntil: 'networkidle', timeout: 10000 });
  
  console.log('Waiting 3 seconds...');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'quick-screenshot.png' });

  const info = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      rootExists: !!root,
      rootHTML: root?.innerHTML.substring(0, 1000) || 'NO ROOT',
      rootChildren: root?.children.length || 0,
      bodyChildren: document.body.children.length,
      scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline'),
      title: document.title
    };
  });

  console.log('\n=== PAGE INFO ===');
  console.log(JSON.stringify(info, null, 2));
  
  console.log('\n=== CONSOLE MESSAGES ===');
  messages.console.forEach(m => console.log(m));
  
  console.log('\n=== ERRORS ===');
  messages.errors.forEach(e => console.log(e));
  
  console.log('\n=== NETWORK ERRORS ===');
  messages.network.forEach(n => console.log(n));

  await browser.close();
  console.log('\nDone! Screenshot: quick-screenshot.png');
}

quickCheck().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
