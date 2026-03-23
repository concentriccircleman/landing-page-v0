import { chromium } from 'playwright';

async function investigatePage() {
  console.log('🔍 Starting thorough page investigation...\n');
  
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

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack
    });
  });

  // Collect network errors
  const networkErrors = [];
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error'
    });
  });

  try {
    console.log('📍 Navigating to http://localhost:5177/...');
    await page.goto('http://localhost:5177/', { waitUntil: 'networkidle', timeout: 10000 });
    
    console.log('⏱️  Waiting 3 seconds for page to fully load...');
    await page.waitForTimeout(3000);

    // Take screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'investigation-screenshot.png', fullPage: true });
    console.log('✅ Screenshot saved to investigation-screenshot.png\n');

    // Check #root element
    console.log('🔍 Checking #root element...');
    const rootExists = await page.locator('#root').count();
    console.log(`   #root exists: ${rootExists > 0}`);
    
    if (rootExists > 0) {
      const rootHTML = await page.evaluate(() => {
        const root = document.getElementById('root');
        return {
          innerHTML: root?.innerHTML || '',
          childCount: root?.children.length || 0,
          textContent: root?.textContent || '',
          computedStyles: root ? window.getComputedStyle(root) : null
        };
      });
      console.log(`   #root children count: ${rootHTML.childCount}`);
      console.log(`   #root innerHTML length: ${rootHTML.innerHTML.length} characters`);
      console.log(`   #root textContent: "${rootHTML.textContent.substring(0, 100)}${rootHTML.textContent.length > 100 ? '...' : ''}"`);
      if (rootHTML.innerHTML.length < 500) {
        console.log(`   #root full innerHTML:\n${rootHTML.innerHTML}`);
      }
    }

    // Check document body
    console.log('\n🔍 Checking document.body...');
    const bodyInfo = await page.evaluate(() => {
      return {
        innerHTML: document.body.innerHTML,
        childCount: document.body.children.length,
        textContent: document.body.textContent
      };
    });
    console.log(`   body children count: ${bodyInfo.childCount}`);
    console.log(`   body innerHTML length: ${bodyInfo.innerHTML.length} characters`);

    // Check all scripts loaded
    console.log('\n🔍 Checking loaded scripts...');
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src,
        type: s.type,
        hasContent: s.innerHTML.length > 0
      }));
    });
    console.log(`   Found ${scripts.length} script tags:`);
    scripts.forEach((script, i) => {
      console.log(`   ${i + 1}. ${script.src || '(inline)'} ${script.type ? `[${script.type}]` : ''}`);
    });

    // Check if React is loaded
    console.log('\n🔍 Checking React/framework state...');
    const frameworkState = await page.evaluate(() => {
      return {
        hasReact: typeof window.React !== 'undefined',
        hasReactDOM: typeof window.ReactDOM !== 'undefined',
        rootHasReactInstance: !!document.getElementById('root')?._reactRootContainer
      };
    });
    console.log(`   React loaded: ${frameworkState.hasReact}`);
    console.log(`   ReactDOM loaded: ${frameworkState.hasReactDOM}`);
    console.log(`   Root has React instance: ${frameworkState.rootHasReactInstance}`);

    // Print all console messages
    console.log('\n📋 CONSOLE MESSAGES:');
    console.log('='.repeat(80));
    if (consoleMessages.length === 0) {
      console.log('   No console messages captured');
    } else {
      consoleMessages.forEach((msg, i) => {
        console.log(`\n${i + 1}. [${msg.type.toUpperCase()}]`);
        console.log(`   ${msg.text}`);
        if (msg.location?.url) {
          console.log(`   at ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
        }
      });
    }

    // Print page errors
    console.log('\n\n🚨 PAGE ERRORS:');
    console.log('='.repeat(80));
    if (pageErrors.length === 0) {
      console.log('   No page errors captured');
    } else {
      pageErrors.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.message}`);
        if (err.stack) {
          console.log(`   ${err.stack}`);
        }
      });
    }

    // Print network errors
    console.log('\n\n🌐 NETWORK ERRORS:');
    console.log('='.repeat(80));
    if (networkErrors.length === 0) {
      console.log('   No network errors captured');
    } else {
      networkErrors.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.url}`);
        console.log(`   Error: ${err.failure}`);
      });
    }

    // Get page title and visible text
    console.log('\n\n📄 PAGE INFO:');
    console.log('='.repeat(80));
    const title = await page.title();
    const visibleText = await page.evaluate(() => document.body.innerText);
    console.log(`   Title: "${title}"`);
    console.log(`   Visible text length: ${visibleText.length} characters`);
    if (visibleText.length < 200) {
      console.log(`   Visible text: "${visibleText}"`);
    } else {
      console.log(`   Visible text (first 200 chars): "${visibleText.substring(0, 200)}..."`);
    }

    console.log('\n✅ Investigation complete!');

  } catch (error) {
    console.error('❌ Error during investigation:', error);
  } finally {
    await browser.close();
  }
}

investigatePage();
