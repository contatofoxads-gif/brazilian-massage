export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_LINK = 'https://t.me/+6Fr_8omTUXVhZGNh';
  const PHOTO_URL = process.env.CAMILA_PHOTO_URL;

  const update = req.body;

  if (update.message && update.message.text && update.message.text.startsWith('/start')) {
    const chatId = update.message.chat.id;
    const firstName = update.message.from.first_name || '';

    const texto = `Oi${firstName ? ', ' + firstName : ''}! Eu sou a Camila 🇧🇷\n\nFico feliz que voce chegou ate aqui.\n\nO que eu ensino nao e encontrado em lugar nenhum. E uma tecnica simples, que qualquer homem pode aprender, mas que pouquissimos conhecem.\n\nQuando voce aplicar 🍆 sua parceira vai sentir algo que provavelmente ela nunca sentiu antes 💦\n\nClica no botao abaixo para entrar no meu grupo privado.`;

    const botao = {
      reply_markup: {
        inline_keyboard: [[
          { text: 'Entrar no Grupo Privado da Camila', url: CHANNEL_LINK }
        ]]
      }
    };

    if (PHOTO_URL) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: PHOTO_URL,
          caption: texto,
          ...botao
        })
      });
    } else {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: texto,
          ...botao
        })
      });
    }
  }

  res.status(200).json({ ok: true });
}
