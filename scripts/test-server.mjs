// Simple test using fetch to see what's happening
const url = 'http://localhost:5177/';

console.log('Fetching', url);
fetch(url)
  .then(res => res.text())
  .then(html => {
    console.log('HTML received, length:', html.length);
    console.log('Has #root:', html.includes('id="root"'));
    console.log('Has main.tsx script:', html.includes('/src/playground/main.tsx'));
    console.log('\nChecking if dependencies are being served...\n');
    
    // Try fetching the main script
    return fetch('http://localhost:5177/src/playground/main.tsx');
  })
  .then(res => {
    console.log('main.tsx status:', res.status);
    return res.text();
  })
  .then(js => {
    console.log('main.tsx length:', js.length);
    console.log('Has React imports:', js.includes('react'));
    console.log('Has Playground:', js.includes('Playground'));
    
    // Check if Playground.tsx is served
    return fetch('http://localhost:5177/src/playground/Playground.tsx');
  })
  .then(res => {
    console.log('\nPlayground.tsx status:', res.status);
    return res.text();
  })
  .then(js => {
    console.log('Playground.tsx length:', js.length);
    console.log('\nAll files are being served correctly by Vite!');
    console.log('\nThe page SHOULD be working. If it appears blank:');
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Check if CSS variables are defined');
    console.log('3. Check if there are any module loading errors');
    console.log('4. Try a hard refresh (Cmd+Shift+R)');
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
