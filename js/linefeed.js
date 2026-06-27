'use strict';

(function () {
  const cfg = window.HSKK_CONFIG && window.HSKK_CONFIG.supabase;
  if (!cfg || !cfg.url || !cfg.anonKey || cfg.anonKey === 'PASTE_YOUR_ANON_KEY_HERE') {
    console.warn('[linefeed] Supabase not configured');
    return;
  }

  const { createClient } = window.supabase;
  const client = createClient(cfg.url, cfg.anonKey);

  const listEl  = document.getElementById('line-feed-list');
  const countEl = document.getElementById('line-feed-count');
  if (!listEl) return;

  /* ── helpers ────────────────────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function relativeTime(ts) {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60)  return 'เมื่อกี้';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return new Date(ts).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  }

  function makeCard(msg, isNew) {
    const card = document.createElement('div');
    card.className = 'lf-card' + (isNew ? ' lf-card--new' : '');
    card.dataset.id = msg.id;
    card.innerHTML = `
      <div class="lf-card-top">
        <span class="lf-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </span>
        <span class="lf-sender">${esc(msg.sender_name || 'Line OA')}</span>
        <span class="lf-time">${relativeTime(msg.created_at)}</span>
      </div>
      <p class="lf-msg">${esc(msg.message || '')}</p>
    `;
    if (isNew) setTimeout(() => card.classList.remove('lf-card--new'), 50);
    return card;
  }

  function removeEmpty() {
    const e = listEl.querySelector('.lf-empty');
    if (e) e.remove();
  }

  function updateCount(n) {
    if (countEl) countEl.textContent = n > 0 ? `${n} ข้อความ` : '';
  }

  /* ── load initial ───────────────────────────────────────────────────────── */
  async function loadInitial() {
    const { data, error } = await client
      .from('line_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) { console.error('[linefeed]', error); return; }
    if (!data || data.length === 0) return;

    removeEmpty();
    data.forEach(msg => listEl.appendChild(makeCard(msg, false)));
    updateCount(data.length);
  }

  /* ── realtime subscription ──────────────────────────────────────────────── */
  function subscribe() {
    client
      .channel('public:line_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'line_messages'
      }, ({ new: msg }) => {
        removeEmpty();
        const card = makeCard(msg, true);
        listEl.insertBefore(card, listEl.firstChild);
        const cur = listEl.querySelectorAll('.lf-card').length;
        updateCount(cur);
      })
      .subscribe();
  }

  loadInitial().then(subscribe);
})();
