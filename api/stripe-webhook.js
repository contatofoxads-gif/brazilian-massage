const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_CHAT_ID = 6591946684;

async function redis(path) {
  const res = await fetch(`${REDIS_URL}/${path}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });
  return res.json();
}

async function notifyAdmin(text) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text })
  });
}

async function addToChannel(chatId) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/unbanChatMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHANNEL_ID, user_id: chatId, only_if_banned: true })
  });
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/approveChatJoinRequest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHANNEL_ID, user_id: chatId })
  });
  return res.json();
}

async function removeFromChannel(chatId) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/banChatMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHANNEL_ID, user_id: chatId, revoke_messages: false })
  });
  return res.json();
}

async function getChatIdByEmail(email) {
  const r = await redis(`get/email:${encodeURIComponent(email)}`);
  return r.result ? parseInt(r.result) : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const payload = await req.text();
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    const crypto = await import('crypto');
    const parts = sig.split(',');
    const ts = parts.find(p => p.startsWith('t=')).split('=')[1];
    const v1 = parts.find(p => p.startsWith('v1=')).split('=')[1];
    const signed = `${ts}.${payload}`;
    const expected = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET).update(signed).digest('hex');
    if (expected !== v1) return res.status(400).json({ error: 'Invalid signature' });
    event = JSON.parse(payload);
  } catch (e) {
    event = JSON.parse(payload);
  }

  const type = event.type;
  const obj = event.data.object;

  if (type === 'checkout.session.completed' || type === 'invoice.payment_succeeded') {
    const email = obj.customer_email || obj.customer_details?.email;
    const customerId = obj.customer;

    if (email) {
      const chatId = await getChatIdByEmail(email);
      if (chatId) {
        await addToChannel(chatId);
        await redis(`set/subscriber:${chatId}/active`);
        await notifyAdmin(`Novo assinante pagou! Adicionado ao canal.\nEmail: ${email}\nChatId: ${chatId}`);

        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Pagamento confirmado! Seja bem-vindo ao canal privado da Nadime 🇧🇷\n\nVoce ja tem acesso. Clica no botao abaixo para entrar.`,
            reply_markup: { inline_keyboard: [[{ text: 'Entrar no Canal Privado', url: 'https://t.me/+6Fr_8omTUXVhZGNh' }]] }
          })
        });
      }
    }
  }

  if (type === 'customer.subscription.deleted' || type === 'invoice.payment_failed') {
    const customerId = obj.customer;
    const r = await redis(`get/customer:${encodeURIComponent(customerId)}`);
    if (r.result) {
      const chatId = parseInt(r.result);
      await removeFromChannel(chatId);
      await redis(`del/subscriber:${chatId}`);
      await notifyAdmin(`Assinatura cancelada/falhou. Removido do canal.\nCustomerId: ${customerId}\nChatId: ${chatId}`);

      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Sua assinatura foi cancelada e seu acesso ao canal foi removido.\n\nPara renovar o acesso: https://buy.stripe.com/4gMaEZ0xbcmP9Kt9T78EM01`
        })
      });
    }
  }

  res.status(200).json({ ok: true });
}
