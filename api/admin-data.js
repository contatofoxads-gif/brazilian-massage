const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

async function redis(path) {
  const res = await fetch(`${REDIS_URL}/${path}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { password, from, to } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Senha incorreta' });

  const fromMs = parseInt(from) || (Date.now() - 7 * 24 * 60 * 60 * 1000);
  const toMs = parseInt(to) || Date.now();
  const DAY = 86400000;

  // Busca eventos Redis por step
  const steps = ['step1', 'step2', 'step3'];
  const stepData = {};
  for (const s of steps) {
    const r = await redis(`zrangebyscore/events:${s}/${fromMs}/${toMs}`);
    stepData[s] = (r.result || []).map(e => parseInt(e.split(':')[1]));
  }

  // Busca pagamentos Stripe
  let paymentTs = [];
  if (STRIPE_SECRET) {
    const r = await fetch(
      `https://api.stripe.com/v1/charges?created[gte]=${Math.floor(fromMs/1000)}&created[lte]=${Math.floor(toMs/1000)}&limit=100`,
      { headers: { Authorization: `Basic ${btoa(STRIPE_SECRET + ':')}` } }
    );
    const d = await r.json();
    if (d.data) paymentTs = d.data.filter(c => c.paid).map(c => c.created * 1000);
  }

  // Monta dias
  const days = {};
  for (let t = new Date(fromMs); t.getTime() <= toMs; t = new Date(t.getTime() + DAY)) {
    const k = t.toISOString().split('T')[0];
    days[k] = { step1: 0, step2: 0, step3: 0, payments: 0 };
  }

  for (const s of steps) {
    for (const ts of stepData[s]) {
      const k = new Date(ts).toISOString().split('T')[0];
      if (days[k]) days[k][s]++;
    }
  }
  for (const ts of paymentTs) {
    const k = new Date(ts).toISOString().split('T')[0];
    if (days[k]) days[k].payments++;
  }

  // Totais
  const totals = { step1: 0, step2: 0, step3: 0, payments: 0 };
  for (const d of Object.values(days)) {
    totals.step1 += d.step1;
    totals.step2 += d.step2;
    totals.step3 += d.step3;
    totals.payments += d.payments;
  }

  res.status(200).json({ days, totals });
}
