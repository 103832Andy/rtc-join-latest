// Local server.js relays /api same-origin; on GitHub Pages the Cloudflare Worker (worker/) does the relaying.
const API = location.port ? 'api/livekit-token/' : 'https://rtc-join-latest-relay.103832.workers.dev/';
const NAME = 'test';

document.getElementById('join-latest').addEventListener('click', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('latest-msg');
  msg.textContent = '取得最新房間中…';
  try {
    const { rooms } = await (await fetch(API + 'rooms')).json();
    const room = rooms?.at(-1);
    if (!['等待中', '進行中'].includes(room?.status)) throw Error('目前沒有可加入的房間');
    const r = await fetch(API + 'join-room', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ participantName: NAME, roomId: room.roomId, verificationCode: room.verificationCode }),
    });
    const data = await r.json();
    if (!r.ok || !data.token) throw Error(data.error || '加入房間失敗');
    location.href = `room.html?name=${encodeURIComponent(NAME)}&token=${encodeURIComponent(data.token)}`;
  } catch (err) {
    msg.textContent = err.message;
  }
});
