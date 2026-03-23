// Ultra-simple: just open a page with puppeteer-core using system Chrome
import puppeteer from 'puppeteer';

console.log('Starting investigation with puppeteer...\n');

puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(async browser => {
  const page = await browser.newPage();
  
  const messages = { logs: [], errors: [], warnings: [] };
  
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    messages[type === 'log' ? 'logs' : type === 'error' ? 'errors' : 'warnings'].push(text);
    console.log(`[${type.toUpperCase()}] ${text}`);
  });
  
  page.on('pageerror', err => {
    messages.errors.push(err.message);
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  console.log('Navigating to http://localhost:5177/...\n');
  await page.goto('http://localhost:5177/', { waitUntil: 'networkidle2', timeout: 10000 });
  
  console.log('Waiting 3 seconds...\n');
  await page.waitForTimeout(3000);
  
  console.log('Checking page state...\n');
  const info = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      rootExists: !!root,
      rootChildren: root?.children.length || 0,
      rootHTML: root?.innerHTML.substring(0, 1000) || '',
      bodyHTML: document.body.innerHTML.substring(0, 500)
    };
  });
  
  console.log('=== PAGE STATE ===');
  console.log('Root exists:', info.rootExists);
  console.log('Root children:', info.rootChildren);
  console.log('\nRoot HTML preview:');
  console.log(info.rootHTML);
  
  console.log('\n=== CONSOLE SUMMARY ===');
  console.log('Logs:', messages.logs.length);
  console.log('Errors:', messages.errors.length);
  console.log('Warnings:', messages.warnings.length);
  
  if (messages.errors.length > 0) {
    console.log('\n=== ERRORS ===');
    messages.errors.forEach(e => console.log('  -', e));
  }
  
  await page.screenshot({ path: 'puppeteer-screenshot.png' });
  console.log('\nScreenshot saved: puppeteer-screenshot.png');
  
  await browser.close();
  console.log('\nDone!');
}).catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
