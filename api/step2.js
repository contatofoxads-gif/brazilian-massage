const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ ok: false });

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Voce sabia que a maioria das mulheres nunca sentiu uma resposta fisica completa? 🍆\n\nNao e culpa delas. E porque poucos homens conhecem os pontos certos.\n\nA Nadime pode te ensinar isso ao vivo. So voce e ela. 💦`
    })
  });

  const ts = Date.now();
  await fetch(`${REDIS_URL}/zadd/events:step2/${ts}/${chatId}:${ts}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });

  // Atualiza step do usuario
  const cur = await fetch(`${REDIS_URL}/get/userinfo:${chatId}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  const curData = await cur.json();
  if (curData.result) {
    const u = JSON.parse(curData.result);
    u.step = 2;
    await fetch(`${REDIS_URL}/set/userinfo:${chatId}/${encodeURIComponent(JSON.stringify(u))}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  }

  res.status(200).json({ ok: true });
}
