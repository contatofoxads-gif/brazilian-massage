const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ ok: false });

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Voce sabia que a maioria das mulheres nunca sentiu uma resposta fisica completa? 🍆\n\nNao e culpa delas. E porque poucos homens conhecem os pontos certos.\n\nA Camila pode te ensinar isso ao vivo. So voce e ela. 💦`
    })
  });

  res.status(200).json({ ok: true });
}
