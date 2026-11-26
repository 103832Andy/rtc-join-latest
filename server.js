// Local preview: serves docs/ and relays /api/livekit-token/* to the real API (server-side, so no CORS).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const UPSTREAM = 'https://demo-rtc.everbot.com.tw';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  if (path.startsWith('/api/livekit-token/')) {
    let body = '';
    for await (const c of req) body += c;
    const r = await fetch(UPSTREAM + path, {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: req.method === 'POST' ? body : undefined,
    }).catch(() => null);
    if (!r) return res.writeHead(502).end('{"error":"上游 API 連不到"}');
    res.writeHead(r.status, { 'content-type': 'application/json' });
    return res.end(await r.text());
  }
  const file = join('docs', normalize(path === '/' ? '/index.html' : path).replace(/^(\.\.[/\\])+/, ''));
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(3000, '0.0.0.0', () => console.log('http://0.0.0.0:3000'));
