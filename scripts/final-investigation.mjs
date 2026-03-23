import { chromium } from 'playwright';

async function comprehensiveInvestigation() {
  let browser;
  try {
    console.log('=== COMPREHENSIVE PAGE INVESTIGATION ===\n');
    console.log('Launching Chromium...');
    browser = await chromium.launch({ 
      headless: true,
      timeout: 10000 
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect all messages
    const consoleMessages = [];
    const pageErrors = [];
    const networkErrors = [];
    const networkRequests = [];

    page.on('console', msg => {
      const entry = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      };
      consoleMessages.push(entry);
      console.log(`  [CONSOLE ${entry.type.toUpperCase()}] ${entry.text}`);
    });

    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log(`  [PAGE ERROR] ${error.message}`);
    });

    page.on('requestfailed', request => {
      networkErrors.push({
        url: request.url(),
        failure: request.failure()?.errorText
      });
      console.log(`  [NETWORK FAIL] ${request.url()} - ${request.failure()?.errorText}`);
    });

    page.on('request', request => {
      if (request.resourceType() === 'document' || request.resourceType() === 'script' || request.resourceType() === 'stylesheet') {
        networkRequests.push({
          url: request.url(),
          type: request.resourceType()
        });
      }
    });

    console.log('\n1. Navigating to http://localhost:5177/...');
    await page.goto('http://localhost:5177/', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });

    console.log('\n2. Waiting 3 seconds for page to fully load...');
    await page.waitForTimeout(3000);

    console.log('\n3. Taking screenshot...');
    await page.screenshot({ path: 'comprehensive-screenshot.png', fullPage: true });
    console.log('   Screenshot saved: comprehensive-screenshot.png');

    console.log('\n=== DOM STATE ===');
    const domInfo = await page.evaluate(() => {
      const root = document.getElementById('root');
      const body = document.body;
      
      return {
        // Root element
        rootExists: !!root,
        rootHTML: root ? root.innerHTML.substring(0, 2000) : 'ROOT NOT FOUND',
        rootTextContent: root ? root.textContent?.trim().substring(0, 500) : '',
        rootChildren: root ? root.children.length : 0,
        rootChildTags: root ? Array.from(root.children).map(c => c.tagName) : [],
        
        // Body
        bodyChildren: body.children.length,
        bodyChildTags: Array.from(body.children).map(c => c.tagName),
        
        // Document
        title: document.title,
        readyState: document.readyState,
        
        // Scripts
        scripts: Array.from(document.querySelectorAll('script')).map(s => ({
          src: s.src || 'inline',
          type: s.type,
          hasContent: !s.src && s.innerHTML.length > 0
        })),
        
        // Styles
        stylesheets: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href),
        
        // Root computed styles
        rootStyles: root ? (() => {
          const styles = window.getComputedStyle(root);
          return {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            width: styles.width,
            height: styles.height,
            minHeight: styles.minHeight,
            background: styles.background,
            color: styles.color
          };
        })() : null
      };
    });

    console.log('\nRoot Element:');
    console.log('  - Exists:', domInfo.rootExists);
    console.log('  - Children:', domInfo.rootChildren);
    console.log('  - Child tags:', domInfo.rootChildTags.join(', ') || 'none');
    console.log('  - Text content length:', domInfo.rootTextContent?.length || 0);
    console.log('  - HTML length:', domInfo.rootHTML?.length || 0);

    if (domInfo.rootHTML && domInfo.rootHTML.length > 50) {
      console.log('\n  Root HTML preview:');
      console.log('  ' + domInfo.rootHTML.substring(0, 500).split('\n').join('\n  '));
    }

    console.log('\nDocument:');
    console.log('  - Title:', domInfo.title);
    console.log('  - Ready state:', domInfo.readyState);
    console.log('  - Body children:', domInfo.bodyChildren);
    console.log('  - Body child tags:', domInfo.bodyChildTags.join(', '));

    console.log('\nScripts loaded:', domInfo.scripts.length);
    domInfo.scripts.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.src} (${s.type || 'text/javascript'})`);
    });

    console.log('\nStylesheets loaded:', domInfo.stylesheets.length);
    domInfo.stylesheets.forEach((href, i) => {
      console.log(`  ${i + 1}. ${href}`);
    });

    if (domInfo.rootStyles) {
      console.log('\nRoot element computed styles:');
      Object.entries(domInfo.rootStyles).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value}`);
      });
    }

    console.log('\n=== CONSOLE MESSAGES ===');
    console.log(`Total: ${consoleMessages.length}`);
    if (consoleMessages.length > 0) {
      consoleMessages.forEach((msg, i) => {
        console.log(`${i + 1}. [${msg.type}] ${msg.text}`);
        if (msg.location?.url) {
          console.log(`   @ ${msg.location.url}:${msg.location.lineNumber}`);
        }
      });
    } else {
      console.log('(no console messages)');
    }

    console.log('\n=== PAGE ERRORS ===');
    console.log(`Total: ${pageErrors.length}`);
    if (pageErrors.length > 0) {
      pageErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err}`);
      });
    } else {
      console.log('(no page errors)');
    }

    console.log('\n=== NETWORK ERRORS ===');
    console.log(`Total: ${networkErrors.length}`);
    if (networkErrors.length > 0) {
      networkErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err.url}`);
        console.log(`   ${err.failure}`);
      });
    } else {
      console.log('(no network errors)');
    }

    console.log('\n=== NETWORK REQUESTS ===');
    console.log(`Total resources: ${networkRequests.length}`);
    const byType = networkRequests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {});
    console.log('By type:', byType);

    console.log('\n=== SUMMARY ===');
    if (!domInfo.rootExists) {
      console.log('❌ ISSUE: #root element not found!');
    } else if (domInfo.rootChildren === 0) {
      console.log('⚠️  WARNING: #root exists but has no children (page may be blank)');
      console.log('   Possible causes:');
      console.log('   1. JavaScript error preventing React from rendering');
      console.log('   2. CSS hiding the content');
      console.log('   3. Module loading issue');
      console.log('   4. React component not mounting');
    } else {
      console.log('✅ Page appears to be rendering correctly');
      console.log(`   #root has ${domInfo.rootChildren} child element(s)`);
      console.log(`   Types: ${domInfo.rootChildTags.join(', ')}`);
    }

    if (pageErrors.length > 0) {
      console.log(`\n❌ Found ${pageErrors.length} JavaScript error(s) - check errors above`);
    }

    if (networkErrors.length > 0) {
      console.log(`\n⚠️  Found ${networkErrors.length} network error(s) - check errors above`);
    }

    console.log('\n=== INVESTIGATION COMPLETE ===');

  } catch (error) {
    console.error('\n❌ Investigation failed:');
    console.error(error.message);
    console.error(error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

comprehensiveInvestigation();
