# Everbot RTC（加「加入最新房間」）

`docs/` 是網頁（GitHub Pages 從 `main` 分支的 `/docs` 發布）。

- 本地：`node server.js` → http://localhost:3000 ，`server.js` 會在伺服器端轉發 API，不受 CORS 限制。
- GitHub Pages：網頁直接呼叫 demo-rtc 的 API，原站沒有放行 CORS，要用關閉 CORS 檢查的桌機 Chrome 開才能用。
