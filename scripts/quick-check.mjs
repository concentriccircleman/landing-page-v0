import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const logs = { console: [], errors: [], network: [] };
  
  page.on('console', msg => logs.console.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.errors.push(err.message));
  page.on('requestfailed', req => logs.network.push(`${req.url()} - ${req.failure()?.errorText}`));

  try {
    await page.goto('http://localhost:5177/', { timeout: 5000 });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'quick-check.png', fullPage: true });
    
    const state = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        rootExists: !!root,
        rootHTML: root?.innerHTML?.substring(0, 500) || '',
        rootChildren: root?.children.length || 0,
        bodyText: document.body.innerText.substring(0, 200),
        title: document.title
      };
    });

    console.log(JSON.stringify({ state, logs }, null, 2));
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
