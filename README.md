# Everbot RTC（加「加入最新房間」）

`docs/` 是網頁（GitHub Pages 從 `main` 分支的 `/docs` 發布）。

- 本地：`node server.js` → http://localhost:3000 ，`server.js` 會在伺服器端轉發 API，不受 CORS 限制。
- GitHub Pages：透過 Cloudflare Worker（`worker/worker.js`，https://rtc-join-latest-relay.103832.workers.dev ）轉發 API 並加上 CORS 標頭，一般瀏覽器、手機都能用。Worker 只放行 `https://103832andy.github.io`。
