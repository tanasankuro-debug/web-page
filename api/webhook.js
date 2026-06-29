const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function verifySignature(rawBody, signature, secret) {
  const hash = crypto
    .createHmac('SHA256', secret)
    .update(rawBody)
    .digest('base64');
  return hash === signature;
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-line-signature'];

  if (!verifySignature(rawBody, signature, process.env.LINE_CHANNEL_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const body = JSON.parse(rawBody);
  const events = body.events || [];

  for (const event of events) {
    if (event.type !== 'message') continue;

    if (event.message.type === 'text') {
      await supabase.from('line_messages').insert({
        sender_name: event.source?.userId || 'unknown',
        message: event.message.text,
        image_url: null,
      });
    } else if (event.message.type === 'image') {
      await supabase.from('line_messages').insert({
        sender_name: event.source?.userId || 'unknown',
        message: '[ส่งรูปภาพ]',
        image_url: null,
      });
    }
  }

  return res.status(200).json({ status: 'ok' });
}

handler.config = { api: { bodyParser: false } };

module.exports = handler;
