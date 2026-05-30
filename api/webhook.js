const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_LINK = 'https://t.me/+6Fr_8omTUXVhZGNh';
const PHOTO_URL = process.env.CAMILA_PHOTO_URL;
const VIDEO1_ID = process.env.TELEGRAM_VIDEO1_ID;
const QSTASH_URL = process.env.QSTASH_URL;
const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const BASE_URL = 'https://brazilian-massage.vercel.app';

async function qstash(path, chatId, delaySeconds) {
  await fetch(`${QSTASH_URL}/v2/publish/${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${QSTASH_TOKEN}`,
      'Content-Type': 'application/json',
      'Upstash-Delay': `${delaySeconds}s`
    },
    body: JSON.stringify({ chatId })
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const update = req.body;

  if (update.message && update.message.text && update.message.text.startsWith('/start')) {
    const chatId = update.message.chat.id;
    const firstName = update.message.from.first_name || '';

    // Boas vindas com foto
    const texto = `Oi${firstName ? ', ' + firstName : ''}! Eu sou a Nadime 🇧🇷\n\nFico feliz que voce chegou ate aqui.\n\nO que eu ensino nao e encontrado em lugar nenhum. E uma tecnica simples, que qualquer homem pode aprender, mas que pouquissimos conhecem.\n\nQuando voce aplicar 🍆 sua parceira vai sentir algo que provavelmente ela nunca sentiu antes 💦\n\nClica no botao abaixo para entrar no meu grupo privado.`;

    if (PHOTO_URL) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: PHOTO_URL,
          caption: texto,
          reply_markup: { inline_keyboard: [[{ text: 'Entrar no Grupo Privado da Nadime', url: CHANNEL_LINK }]] }
        })
      });
    } else {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: texto, reply_markup: { inline_keyboard: [[{ text: 'Entrar no Grupo Privado da Nadime', url: CHANNEL_LINK }]] } })
      });
    }

    // Video 1
    if (VIDEO1_ID) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, video: VIDEO1_ID })
      });
    }

    // Registra evento step1 no Redis
    const tsNow = Date.now();
    await fetch(`${REDIS_URL}/zadd/events:step1/${tsNow}/${chatId}:${tsNow}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
    });

    // Salva dados do usuario
    const userInfo = JSON.stringify({
      chatId,
      firstName: firstName || '',
      username: update.message.from.username || '',
      joinedAt: tsNow,
      step: 1
    });
    await fetch(`${REDIS_URL}/set/userinfo:${chatId}/${encodeURIComponent(userInfo)}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
    });

    // Notifica admin
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: 6591946684,
        text: `Novo usuario no funil:\nNome: ${firstName || 'sem nome'}\nUsername: @${update.message.from.username || 'sem username'}\nID: ${chatId}`
      })
    });

    // Agenda step2 (3 min) e step3 (5 min) via QStash
    await qstash('/api/step2', chatId, 180);
    await qstash('/api/step3', chatId, 300);
  }

  res.status(200).json({ ok: true });
}
