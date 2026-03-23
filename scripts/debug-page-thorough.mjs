import { chromium } from 'playwright';

async function debugPage() {
  const browser = await chromium.launch({ headless: true });
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
  });

  // Collect all page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  // Collect all request failures
  const requestFailures = [];
  page.on('requestfailed', request => {
    requestFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error'
    });
  });

  try {
    console.log('=== NAVIGATING TO http://localhost:5177/ ===\n');
    
    // Navigate to the page
    const response = await page.goto('http://localhost:5177/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log(`Response status: ${response.status()}`);
    console.log(`Response OK: ${response.ok()}\n`);

    // Wait an additional 3 seconds as requested
    console.log('Waiting 3 additional seconds for full load...\n');
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'debug-thorough-screenshot.png', fullPage: true });
    console.log('✓ Screenshot saved to debug-thorough-screenshot.png\n');

    // Check #root element
    console.log('=== CHECKING #root ELEMENT ===\n');
    const rootExists = await page.locator('#root').count() > 0;
    console.log(`#root exists: ${rootExists}`);

    if (rootExists) {
      const rootHTML = await page.evaluate(() => {
        const root = document.getElementById('root');
        return {
          innerHTML: root.innerHTML,
          innerHTMLLength: root.innerHTML.length,
          childElementCount: root.childElementCount,
          textContent: root.textContent?.substring(0, 500) || '',
          classList: Array.from(root.classList),
          computedDisplay: window.getComputedStyle(root).display,
          computedVisibility: window.getComputedStyle(root).visibility,
          computedOpacity: window.getComputedStyle(root).opacity
        };
      });

      console.log(`\n#root innerHTML length: ${rootHTML.innerHTMLLength} characters`);
      console.log(`#root child elements: ${rootHTML.childElementCount}`);
      console.log(`#root classes: ${rootHTML.classList.join(', ') || '(none)'}`);
      console.log(`#root computed display: ${rootHTML.computedDisplay}`);
      console.log(`#root computed visibility: ${rootHTML.computedVisibility}`);
      console.log(`#root computed opacity: ${rootHTML.computedOpacity}`);
      
      if (rootHTML.innerHTMLLength > 0) {
        console.log(`\nFirst 1000 chars of #root innerHTML:`);
        console.log(rootHTML.innerHTML.substring(0, 1000));
        console.log('...');
      } else {
        console.log('\n⚠️ WARNING: #root innerHTML is EMPTY!');
      }

      if (rootHTML.textContent) {
        console.log(`\nFirst 500 chars of visible text:`);
        console.log(rootHTML.textContent);
      }
    } else {
      console.log('⚠️ WARNING: #root element NOT FOUND in DOM!');
    }

    // Check entire document body
    console.log('\n=== CHECKING DOCUMENT BODY ===\n');
    const bodyInfo = await page.evaluate(() => {
      return {
        childElementCount: document.body.childElementCount,
        innerHTML: document.body.innerHTML.substring(0, 2000),
        textContent: document.body.textContent?.substring(0, 500) || ''
      };
    });
    console.log(`Body child elements: ${bodyInfo.childElementCount}`);
    console.log(`\nFirst 2000 chars of body innerHTML:`);
    console.log(bodyInfo.innerHTML);
    console.log('...');

    // Check for React root mounting
    console.log('\n=== CHECKING REACT ROOT ===\n');
    const reactInfo = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        hasReactRoot: root && '_reactRootContainer' in root,
        hasReactFiber: root && Object.keys(root).some(key => key.startsWith('__react')),
        allRootKeys: root ? Object.keys(root).filter(k => k.startsWith('_') || k.startsWith('__')) : []
      };
    });
    console.log(`Has _reactRootContainer: ${reactInfo.hasReactRoot}`);
    console.log(`Has React Fiber keys: ${reactInfo.hasReactFiber}`);
    console.log(`React-related keys on root: ${reactInfo.allRootKeys.join(', ') || '(none)'}`);

    // Check all loaded scripts
    console.log('\n=== LOADED SCRIPTS ===\n');
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src || '(inline)',
        type: s.type || 'text/javascript',
        async: s.async,
        defer: s.defer,
        length: s.textContent?.length || 0
      }));
    });
    scripts.forEach((script, i) => {
      console.log(`Script ${i + 1}: ${script.src}`);
      console.log(`  Type: ${script.type}, Async: ${script.async}, Defer: ${script.defer}, Length: ${script.length}`);
    });

    // Check all loaded stylesheets
    console.log('\n=== LOADED STYLESHEETS ===\n');
    const stylesheets = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => ({
        href: l.href,
        loaded: l.sheet !== null
      }));
    });
    stylesheets.forEach((css, i) => {
      console.log(`Stylesheet ${i + 1}: ${css.href} (loaded: ${css.loaded})`);
    });

    // Print all console messages
    console.log('\n=== ALL CONSOLE MESSAGES ===\n');
    if (consoleMessages.length === 0) {
      console.log('(no console messages)');
    } else {
      consoleMessages.forEach((msg, i) => {
        console.log(`\n[${i + 1}] ${msg.type.toUpperCase()}: ${msg.text}`);
        if (msg.location && msg.location.url) {
          console.log(`    at ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
        }
      });
    }

    // Print all page errors
    console.log('\n=== PAGE ERRORS ===\n');
    if (pageErrors.length === 0) {
      console.log('(no page errors)');
    } else {
      pageErrors.forEach((err, i) => {
        console.log(`\n[${i + 1}] ERROR: ${err.message}`);
        if (err.stack) {
          console.log(err.stack);
        }
      });
    }

    // Print all request failures
    console.log('\n=== FAILED REQUESTS ===\n');
    if (requestFailures.length === 0) {
      console.log('(no failed requests)');
    } else {
      requestFailures.forEach((req, i) => {
        console.log(`\n[${i + 1}] ${req.url}`);
        console.log(`    Failure: ${req.failure}`);
      });
    }

    // Check viewport and visible elements
    console.log('\n=== VIEWPORT & VISIBLE ELEMENTS ===\n');
    const viewportInfo = await page.evaluate(() => {
      const visibleElements = document.querySelectorAll('body *');
      const actuallyVisible = Array.from(visibleElements).filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 0 && 
               rect.height > 0 && 
               style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
      });

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        totalElements: visibleElements.length,
        visibleElements: actuallyVisible.length,
        topLevelVisible: actuallyVisible.slice(0, 10).map(el => ({
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          classes: Array.from(el.classList).join(' '),
          text: el.textContent?.substring(0, 50) || ''
        }))
      };
    });

    console.log(`Viewport: ${viewportInfo.viewportWidth}x${viewportInfo.viewportHeight}`);
    console.log(`Total DOM elements: ${viewportInfo.totalElements}`);
    console.log(`Actually visible elements: ${viewportInfo.visibleElements}`);
    console.log('\nFirst 10 visible elements:');
    viewportInfo.topLevelVisible.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tag}> ${el.id ? `#${el.id}` : ''} ${el.classes ? `.${el.classes.split(' ').join('.')}` : ''}`);
      if (el.text) {
        console.log(`     Text: "${el.text}${el.text.length >= 50 ? '...' : ''}"`);
      }
    });

  } catch (error) {
    console.error('ERROR during debugging:', error);
  } finally {
    await browser.close();
  }
}

debugPage().catch(console.error);
