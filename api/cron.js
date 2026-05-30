const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VIDEO3_ID = process.env.TELEGRAM_VIDEO3_ID;
const PAYMENT_LINK = 'https://buy.stripe.com/14A3cx2Fj9aD7Cld5j8EM00';

const DELAY_MSG2 = 3 * 60 * 1000;
const DELAY_MSG3 = 5 * 60 * 1000;

async function redis(cmd) {
  const res = await fetch(`${REDIS_URL}/${cmd.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });
  return res.json();
}

async function sendMessage(chatId, text, replyMarkup) {
  const body = { chat_id: chatId, text };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function sendVideo(chatId, fileId, caption, replyMarkup) {
  const body = { chat_id: chatId, video: fileId };
  if (caption) body.caption = caption;
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export default async function handler(req, res) {
  const keys = await redis(['KEYS', 'user:*']);
  if (!keys.result || keys.result.length === 0) return res.status(200).json({ ok: true });

  const now = Date.now();

  for (const key of keys.result) {
    const data = await redis(['GET', key]);
    if (!data.result) continue;

    const user = JSON.parse(data.result);
    const elapsed = now - user.joinedAt;

    if (user.step === 1 && elapsed >= DELAY_MSG2) {
      await sendMessage(
        user.chatId,
        `Voce sabia que a maioria das mulheres nunca sentiu uma resposta fisica completa? 🍆\n\nNao e culpa delas. E porque poucos homens conhecem os pontos certos.\n\nA Camila pode te ensinar isso ao vivo. So voce e ela. 💦`
      );
      user.step = 2;
      await redis(['SET', key, JSON.stringify(user), 'EX', '3600']);
    } else if (user.step === 2 && elapsed >= DELAY_MSG3) {
      if (VIDEO3_ID) {
        await sendVideo(
          user.chatId,
          VIDEO3_ID,
          'Isso e o que ela vai sentir quando voce aprender a tecnica completa. 💦\n\nAgende sua aula ao vivo com a Camila agora:',
          { inline_keyboard: [[{ text: 'Agendar aula ao vivo - US$ 87', url: PAYMENT_LINK }]] }
        );
      } else {
        await sendMessage(
          user.chatId,
          'Isso e o que ela vai sentir quando voce aprender a tecnica completa. 💦\n\nAgende sua aula ao vivo com a Camila agora:',
          { inline_keyboard: [[{ text: 'Agendar aula ao vivo - US$ 87', url: PAYMENT_LINK }]] }
        );
      }
      user.step = 3;
      await redis(['SET', key, JSON.stringify(user), 'EX', '600']);
    }
  }

  res.status(200).json({ ok: true });
}
