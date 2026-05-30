const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VIDEO3_ID = process.env.TELEGRAM_VIDEO3_ID;
const PAYMENT_LINK = 'https://buy.stripe.com/14A3cx2Fj9aD7Cld5j8EM00';
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ ok: false });

  if (VIDEO3_ID) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        video: VIDEO3_ID,
        caption: `Isso e o que ela vai sentir quando voce aprender a tecnica completa 💦\n\nAgende sua aula ao vivo com a Camila agora:`,
        reply_markup: { inline_keyboard: [[{ text: 'Agendar aula ao vivo - US$ 87', url: PAYMENT_LINK }]] }
      })
    });
  } else {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Isso e o que ela vai sentir quando voce aprender a tecnica completa 💦\n\nAgende sua aula ao vivo com a Camila agora:`,
        reply_markup: { inline_keyboard: [[{ text: 'Agendar aula ao vivo - US$ 87', url: PAYMENT_LINK }]] }
      })
    });
  }

  const ts = Date.now();
  await fetch(`${REDIS_URL}/zadd/events:step3/${ts}/${chatId}:${ts}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });

  // Atualiza step do usuario
  const cur = await fetch(`${REDIS_URL}/get/userinfo:${chatId}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  const curData = await cur.json();
  if (curData.result) {
    const u = JSON.parse(curData.result);
    u.step = 3;
    await fetch(`${REDIS_URL}/set/userinfo:${chatId}/${encodeURIComponent(JSON.stringify(u))}`, { headers: { Authorization: `Bearer ${REDIS_TOKEN}` } });
  }

  res.status(200).json({ ok: true });
}
