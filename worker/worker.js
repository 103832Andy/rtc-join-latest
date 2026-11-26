// Cloudflare Worker relay: forwards the two Everbot RTC API calls server-side and adds the CORS header
// the upstream API doesn't send, so the GitHub Pages site can call it from any browser.
const UPSTREAM = 'https://demo-rtc.everbot.com.tw/api/livekit-token/';
const ALLOWED_ORIGIN = 'https://103832andy.github.io';
const ROUTES = { '/rooms': 'GET', '/join-room': 'POST' }; // only these, so this isn't an open proxy

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'content-type',
};

export default {
  async fetch(req) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const path = new URL(req.url).pathname;
    if (ROUTES[path] !== req.method) return new Response('not found', { status: 404, headers: cors });
    const r = await fetch(UPSTREAM + path.slice(1), {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: req.method === 'POST' ? await req.text() : undefined,
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } });
  },
};
