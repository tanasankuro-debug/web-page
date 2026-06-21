/* ==========================================================================
   Sidebar Tabs — js/sidebar-tabs.js
   Rain + Flood summary panels for map.html sidebar.
   Depends on: window.HSKK_CONFIG.rainWeatherUrl (config.js)
   ========================================================================== */
'use strict';

/* ── WMO code → Thai description ─────────────────────────────────────────── */
const STB_WMO = {
  0: 'ท้องฟ้าแจ่มใส', 1: 'แจ่มใสเป็นส่วนใหญ่', 2: 'มีเมฆบางส่วน', 3: 'เมฆปกคลุม',
  45: 'หมอก', 48: 'หมอกน้ำค้าง',
  51: 'ฝนปรอยเบา', 53: 'ฝนปรอย', 55: 'ฝนปรอยหนัก',
  61: 'ฝนเบา', 63: 'ฝนปานกลาง', 65: 'ฝนหนัก',
  80: 'ฝนตกเป็นช่วง', 81: 'ฝนตกหนัก', 82: 'ฝนตกหนักมาก',
  95: 'พายุฝนฟ้าคะนอง', 99: 'พายุรุนแรง',
};
function stbWmo(code) {
  if (code == null) return '';
  return STB_WMO[code] || STB_WMO[Math.floor(code / 10) * 10] || '';
}

/* ── Flood risk from 3-day precip sum ────────────────────────────────────── */
function stbFloodRisk(sum3) {
  if (sum3 > 100) return { label: 'อันตราย',   color: '#EF4444', dot: '🔴' };
  if (sum3 > 50)  return { label: 'เสี่ยงสูง', color: '#FB923C', dot: '🟠' };
  if (sum3 > 25)  return { label: 'ระวัง',     color: '#FACC15', dot: '🟡' };
  return                  { label: 'ปกติ',      color: '#22C55E', dot: '🟢' };
}

/* ── Data fetch & cache (15-min TTL) ─────────────────────────────────────── */
let _stbData = null;
let _stbTs   = 0;
const STB_TTL = 15 * 60 * 1000;

async function stbGetData() {
  if (_stbData && Date.now() - _stbTs < STB_TTL) return _stbData;
  const url = window.HSKK_CONFIG?.rainWeatherUrl;
  if (!url) throw new Error('no rainWeatherUrl');
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  _stbData = await res.json();
  _stbTs   = Date.now();
  return _stbData;
}

/* ── Rain panel HTML ─────────────────────────────────────────────────────── */
function stbRainHTML(data) {
  const daily   = data.daily   || {};
  const current = data.current || {};
  const precip  = daily.precipitation_sum?.slice(0, 3)              || [0, 0, 0];
  const chance  = daily.precipitation_probability_max?.[0]          ?? null;
  const wcode   = current.weathercode ?? current.weather_code       ?? null;
  const maxP    = Math.max(...precip.filter(v => v != null), 0.1);

  const DAYS = ['วันนี้', 'พรุ่งนี้', 'มะรืน'];
  const bars = DAYS.map((lbl, i) => {
    const mm = precip[i] ?? 0;
    const w  = Math.round((mm / maxP) * 100);
    return `
      <div class="stb-day-row">
        <span class="stb-day-lbl">${lbl}</span>
        <div class="stb-bar-wrap"><div class="stb-bar stb-bar--rain" style="width:${w}%"></div></div>
        <span class="stb-day-num">${mm.toFixed(1)}<span class="stb-u">mm</span></span>
      </div>`;
  }).join('');

  const cond  = stbWmo(wcode);
  const today = precip[0] ?? 0;

  return `
    <div class="stb-card">
      <div class="stb-card-hd">
        <span class="stb-card-title">ฝนวันนี้</span>
        ${cond ? `<span class="stb-cond">${cond}</span>` : ''}
      </div>
      <div class="stb-main-row">
        <span class="stb-big">${today.toFixed(1)}</span>
        <span class="stb-u stb-u--big">mm</span>
        ${chance != null ? `<span class="stb-badge">${chance}%</span>` : ''}
      </div>
      <div class="stb-divider"></div>
      <div class="stb-sub-lbl">ฝน 3 วัน</div>
      ${bars}
      <a href="rainforecast.html" class="stb-cta stb-cta--rain">
        ดูพยากรณ์เต็ม
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" width="11" height="11" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </a>
    </div>`;
}

/* ── Flood panel HTML ────────────────────────────────────────────────────── */
function stbFloodHTML(data) {
  const daily  = data.daily || {};
  const precip7 = daily.precipitation_sum?.slice(0, 7) || [];
  const sum3   = (precip7[0] ?? 0) + (precip7[1] ?? 0) + (precip7[2] ?? 0);
  const risk   = stbFloodRisk(sum3);
  const maxP   = Math.max(...precip7.filter(v => v != null), 0.1);
  const lbls   = ['วันนี้', 'พรุ่ง', 'มะรืน', '+3', '+4', '+5', '+6'];

  const miniBars = precip7.map((mm, i) => {
    const mmV = mm ?? 0;
    const h   = Math.max(4, Math.round((mmV / maxP) * 36));
    const c   = mmV > 50 ? '#EF4444' : mmV > 25 ? '#FB923C' : mmV > 5 ? '#38BDF8' : '#1E3A5F';
    return `<div class="stb-fbar" style="height:${h}px;background:${c}" title="${lbls[i]} ${mmV.toFixed(1)}mm"></div>`;
  }).join('');

  const lblEls = lbls.map(l => `<span>${l}</span>`).join('');

  return `
    <div class="stb-card">
      <div class="stb-card-hd">
        <span class="stb-card-title">สถานการณ์น้ำ</span>
        <span style="color:${risk.color};font-size:0.72rem;font-weight:700;">${risk.dot} ${risk.label}</span>
      </div>
      <div class="stb-kv-row">
        <span class="stb-kv-lbl">ฝนสะสม 3 วัน</span>
        <span class="stb-kv-val" style="color:${risk.color};">${sum3.toFixed(1)}<span class="stb-u"> mm</span></span>
      </div>
      <div class="stb-kv-row">
        <span class="stb-kv-lbl">ระดับเสี่ยง</span>
        <span class="stb-kv-val" style="color:${risk.color};">${risk.label}</span>
      </div>
      <div class="stb-divider"></div>
      <div class="stb-sub-lbl">ฝนรายวัน 7 วัน</div>
      <div class="stb-fbars">${miniBars}</div>
      <div class="stb-fbar-lbls">${lblEls}</div>
      <a href="flood-live.html" class="stb-cta stb-cta--flood">
        ดูข้อมูลน้ำสด
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" width="11" height="11" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </a>
    </div>`;
}

/* ── Render panel (fetches once, caches) ─────────────────────────────────── */
async function stbRender(tabId) {
  const loadEl  = document.getElementById('stb-' + tabId + '-loading');
  const panelEl = document.getElementById('stb-' + tabId + '-panel');
  const errorEl = document.getElementById('stb-' + tabId + '-error');
  if (!panelEl) return;
  if (!panelEl.hidden) return; // already rendered

  try {
    if (loadEl)  loadEl.hidden  = false;
    if (errorEl) errorEl.hidden = true;
    const data = await stbGetData();
    if (loadEl) loadEl.hidden = true;
    panelEl.innerHTML = tabId === 'rain' ? stbRainHTML(data) : stbFloodHTML(data);
    panelEl.hidden = false;
  } catch (err) {
    console.error('[sidebar-tabs] fetch failed:', err);
    if (loadEl)  loadEl.hidden  = true;
    if (errorEl) errorEl.hidden = false;
  }
}

window.stbRender = stbRender;

/* ── Tab switching ───────────────────────────────────────────────────────── */
function stbActivate(id) {
  document.querySelectorAll('.stab-btn').forEach(btn => {
    const on = btn.dataset.stab === id;
    btn.classList.toggle('stab-active', on);
    btn.setAttribute('aria-selected', String(on));
  });
  document.querySelectorAll('[id^="stab-panel-"]').forEach(panel => {
    panel.hidden = panel.id !== 'stab-panel-' + id;
  });
  if (id === 'rain' || id === 'flood') stbRender(id);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.stab-btn').forEach(btn => {
    btn.addEventListener('click', () => stbActivate(btn.dataset.stab));
  });
});
