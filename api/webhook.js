const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_LINK = 'https://t.me/+6Fr_8omTUXVhZGNh';
const PHOTO_URL = process.env.CAMILA_PHOTO_URL;
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VIDEO1_ID = process.env.TELEGRAM_VIDEO1_ID;
const VIDEO3_ID = process.env.TELEGRAM_VIDEO3_ID;
const PAYMENT_LINK = 'https://buy.stripe.com/14A3cx2Fj9aD7Cld5j8EM00';

async function redis(cmd) {
  const res = await fetch(`${REDIS_URL}/${cmd.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });
  return res.json();
}

async function sendVideo(chatId, fileIdOrUrl, caption, replyMarkup) {
  const body = { chat_id: chatId, caption };
  if (fileIdOrUrl.startsWith('http')) {
    body.video = fileIdOrUrl;
  } else {
    body.video = fileIdOrUrl;
  }
  if (replyMarkup) body.reply_markup = replyMarkup;
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const update = req.body;

  if (update.message && update.message.text && update.message.text.startsWith('/start')) {
    const chatId = update.message.chat.id;
    const firstName = update.message.from.first_name || '';
    const now = Date.now();

    // Envia boas vindas com foto
    const texto = `Oi${firstName ? ', ' + firstName : ''}! Eu sou a Camila 🇧🇷\n\nFico feliz que voce chegou ate aqui.\n\nO que eu ensino nao e encontrado em lugar nenhum. E uma tecnica simples, que qualquer homem pode aprender, mas que pouquissimos conhecem.\n\nQuando voce aplicar 🍆 sua parceira vai sentir algo que provavelmente ela nunca sentiu antes 💦\n\nClica no botao abaixo para entrar no meu grupo privado.`;

    if (PHOTO_URL) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: PHOTO_URL,
          caption: texto,
          reply_markup: { inline_keyboard: [[{ text: 'Entrar no Grupo Privado da Camila', url: CHANNEL_LINK }]] }
        })
      });
    } else {
      await sendMessage(chatId, texto, { inline_keyboard: [[{ text: 'Entrar no Grupo Privado da Camila', url: CHANNEL_LINK }]] });
    }

    // Envia video 1
    if (VIDEO1_ID) {
      await sendVideo(chatId, VIDEO1_ID);
    }

    // Guarda no Redis para sequencia
    await redis(['SET', `user:${chatId}`, JSON.stringify({ chatId, firstName, joinedAt: now, step: 1 }), 'EX', '3600']);
  }

  res.status(200).json({ ok: true });
}
