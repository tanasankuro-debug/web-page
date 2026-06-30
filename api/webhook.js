'use strict';

const crypto = require('crypto');
const https  = require('https');
const { createClient } = require('@supabase/supabase-js');

// ── Supabase (service key — server-side only, never expose to browser)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const LINE_TOKEN  = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_SECRET = process.env.LINE_CHANNEL_SECRET;

// ── Read raw request body (needed for signature verification)
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end',  () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// ── Verify X-Line-Signature header
function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const hash = crypto.createHmac('SHA256', secret).update(rawBody).digest('base64');
  return hash === signature;
}

// ── Fetch Line display name for a userId
function getDisplayName(userId) {
  return new Promise(resolve => {
    if (!LINE_TOKEN || !userId) return resolve(null);
    const options = {
      hostname: 'api.line.me',
      path: `/v2/bot/profile/${userId}`,
      headers: { Authorization: `Bearer ${LINE_TOKEN}` }
    };
    https.get(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data).displayName || null); }
        catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

// ── Main handler
async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, service: 'Line Webhook — Heat Safe KK' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody  = await getRawBody(req);
  const signature = req.headers['x-line-signature'];

  if (!verifySignature(rawBody, signature, LINE_SECRET)) {
    console.error('[webhook] invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let body;
  try { body = JSON.parse(rawBody.toString()); }
  catch { return res.status(400).json({ error: 'Bad JSON' }); }

  const events = body.events || [];

  for (const event of events) {
    if (event.type !== 'message') continue;

    const userId = event.source?.userId || null;
    const displayName = await getDisplayName(userId);
    const senderName  = displayName || userId || 'ไม่ระบุชื่อ';

    const base = {
      sender_id:   userId,
      sender_name: senderName,
      created_at:  new Date(event.timestamp).toISOString()
    };

    const { type } = event.message;

    if (type === 'text') {
      await supabase.from('line_messages').insert({
        ...base,
        message_type: 'text',
        message:      event.message.text,
        lat:          null,
        lng:          null,
        address:      null,
        image_url:    null
      });

    } else if (type === 'location') {
      const { title, address, latitude, longitude } = event.message;
      await supabase.from('line_messages').insert({
        ...base,
        message_type: 'location',
        message:      title || address || 'แชร์ตำแหน่ง',
        lat:          latitude  ?? null,
        lng:          longitude ?? null,
        address:      address   || null,
        image_url:    null
      });

    } else if (type === 'image') {
      await supabase.from('line_messages').insert({
        ...base,
        message_type: 'image',
        message:      '[ส่งรูปภาพ]',
        lat:          null,
        lng:          null,
        address:      null,
        image_url:    null
      });

    } else if (type === 'sticker') {
      // ignore stickers silently
    }
  }

  return res.status(200).json({ status: 'ok', received: events.length });
}

// Disable Vercel's default body parser — we need raw body for HMAC
handler.config = { api: { bodyParser: false } };

module.exports = handler;
