import fs from 'fs';
import https from 'https';

const TOKEN = JSON.parse(fs.readFileSync('/tmp/figma_mcp_token.json')).access_token;
console.log('Token:', TOKEN.slice(0,20) + '...');

const body = JSON.stringify({
  jsonrpc: '2.0', method: 'tools/call', id: 1,
  params: {
    name: 'generate_figma_design',
    arguments: { outputMode: 'existingFile', fileKey: 'jqbwmzpJiaOxeLYukWvLpn' }
  }
});

const req = https.request({
  hostname: 'mcp.figma.com', path: '/mcp', method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
    'Authorization': 'Bearer ' + TOKEN,
    'MCP-Protocol-Version': '2024-11-05',
    'Content-Length': Buffer.byteLength(body),
  }
}, (res) => {
  let raw = '';
  res.on('data', d => raw += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const lines = raw.split('\n');
    console.log('Line count:', lines.length);
    console.log('Raw (first 500):', JSON.stringify(raw.slice(0, 500)));
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const parsed = JSON.parse(line.slice(5).trim());
        const text = parsed?.result?.content?.map(c => c.text).join('') ?? '';
        const textLines = text.split('\n');
        console.log('First 3 text lines:');
        for (const tl of textLines.slice(0,3)) console.log('  |', JSON.stringify(tl));
        const matchLine = textLines.find(l => l.includes('Capture ID generated:'));
        console.log('Match line:', matchLine);
        if (matchLine) {
          const parts = matchLine.split('`');
          console.log('Parts:', parts.slice(0,3));
          console.log('CaptureId:', parts[1]);
        }
      }
    }
  });
});
req.write(body);
req.end();
