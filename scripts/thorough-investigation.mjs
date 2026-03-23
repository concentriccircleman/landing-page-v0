import { chromium } from 'playwright';

console.log('🔍 Starting comprehensive page investigation...\n');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Collect console messages
const consoleMessages = [];
page.on('console', msg => {
  const entry = {
    type: msg.type(),
    text: msg.text(),
    location: msg.location()
  };
  consoleMessages.push(entry);
  console.log(`[CONSOLE ${entry.type.toUpperCase()}] ${entry.text}`);
});

// Collect page errors
const pageErrors = [];
page.on('pageerror', error => {
  pageErrors.push(error.message);
  console.log(`[PAGE ERROR] ${error.message}`);
});

// Collect network failures
const networkErrors = [];
page.on('requestfailed', request => {
  const error = `${request.url()} - ${request.failure()?.errorText || 'unknown'}`;
  networkErrors.push(error);
  console.log(`[NETWORK ERROR] ${error}`);
});

try {
  console.log('📍 Navigating to http://localhost:5177/...');
  await page.goto('http://localhost:5177/', { waitUntil: 'networkidle', timeout: 10000 });
  
  console.log('⏱️  Waiting 3 seconds for full load...');
  await page.waitForTimeout(3000);

  console.log('\n📸 Taking screenshot...');
  await page.screenshot({ path: 'investigation-screenshot.png', fullPage: true });
  console.log('✅ Screenshot saved\n');

  // Check #root element
  console.log('='.repeat(80));
  console.log('DOM STATE INVESTIGATION');
  console.log('='.repeat(80));
  
  const domState = await page.evaluate(() => {
    const root = document.getElementById('root');
    const body = document.body;
    
    return {
      root: {
        exists: !!root,
        children: root?.children.length || 0,
        innerHTML: root?.innerHTML || '',
        textContent: root?.textContent || '',
        style: root?.getAttribute('style') || ''
      },
      body: {
        children: body.children.length,
        innerText: body.innerText,
        innerHTML: body.innerHTML
      },
      title: document.title,
      scripts: Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src,
        type: s.type,
        inline: !s.src && s.innerHTML.length > 0
      })),
      hasReact: typeof window.React !== 'undefined',
      hasReactDOM: typeof window.ReactDOM !== 'undefined'
    };
  });

  console.log(`\n📄 Page Title: "${domState.title}"`);
  console.log(`\n🔍 #root Element:`);
  console.log(`   Exists: ${domState.root.exists}`);
  console.log(`   Children: ${domState.root.children}`);
  console.log(`   Style: ${domState.root.style}`);
  console.log(`   innerHTML length: ${domState.root.innerHTML.length} characters`);
  console.log(`   textContent length: ${domState.root.textContent.length} characters`);
  
  if (domState.root.innerHTML.length < 1000) {
    console.log(`\n   Full innerHTML:`);
    console.log(`   ${domState.root.innerHTML || '(empty)'}`);
  } else {
    console.log(`\n   innerHTML preview (first 500 chars):`);
    console.log(`   ${domState.root.innerHTML.substring(0, 500)}...`);
  }

  console.log(`\n🔍 Body Element:`);
  console.log(`   Children: ${domState.body.children}`);
  console.log(`   Visible text length: ${domState.body.innerText.length} characters`);
  
  if (domState.body.innerText.length < 500) {
    console.log(`\n   Full visible text:`);
    console.log(`   "${domState.body.innerText}"`);
  } else {
    console.log(`\n   Visible text preview (first 300 chars):`);
    console.log(`   "${domState.body.innerText.substring(0, 300)}..."`);
  }

  console.log(`\n📜 Scripts loaded: ${domState.scripts.length}`);
  domState.scripts.forEach((script, i) => {
    console.log(`   ${i + 1}. ${script.src || '(inline)'} ${script.type ? `[${script.type}]` : ''}`);
  });

  console.log(`\n⚛️  React:`);
  console.log(`   React loaded: ${domState.hasReact}`);
  console.log(`   ReactDOM loaded: ${domState.hasReactDOM}`);

  console.log('\n' + '='.repeat(80));
  console.log('CONSOLE MESSAGES SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total console messages: ${consoleMessages.length}`);
  console.log(`   Logs: ${consoleMessages.filter(m => m.type === 'log').length}`);
  console.log(`   Warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`);
  console.log(`   Errors: ${consoleMessages.filter(m => m.type === 'error').length}`);

  if (consoleMessages.length > 0) {
    console.log('\nAll console messages:');
    consoleMessages.forEach((msg, i) => {
      console.log(`\n${i + 1}. [${msg.type.toUpperCase()}]`);
      console.log(`   ${msg.text}`);
      if (msg.location?.url) {
        console.log(`   at ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
      }
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('ERROR SUMMARY');
  console.log('='.repeat(80));
  console.log(`Page errors: ${pageErrors.length}`);
  console.log(`Network errors: ${networkErrors.length}`);

  if (pageErrors.length > 0) {
    console.log('\nPage errors:');
    pageErrors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
  }

  if (networkErrors.length > 0) {
    console.log('\nNetwork errors:');
    networkErrors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
  }

  if (pageErrors.length === 0 && networkErrors.length === 0) {
    console.log('✅ No errors detected!');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Investigation complete!');
  console.log('='.repeat(80));

} catch (error) {
  console.error('\n❌ FATAL ERROR:', error.message);
  console.error(error.stack);
} finally {
  await browser.close();
}
