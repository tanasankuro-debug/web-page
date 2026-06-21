/* ==========================================================================
   Heat Safe Khon Kaen — live.js
   Live weather data: fetch, render cards, sparkline, auto-refresh
   Open-Meteo APIs — no key needed, CORS-enabled
   Coordinates: 16.44°N 102.82°E  Timezone: Asia/Bangkok
   ========================================================================== */
'use strict';

/* ── API URLs (from config.js if available, otherwise inline fallbacks) ─── */
const _cfg = (typeof window !== 'undefined' && window.HSKK_CONFIG) || {};

const LIVE_WEATHER_URL = _cfg.weatherUrl ||
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=16.44&longitude=102.82' +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,weather_code,is_day' +
  '&hourly=temperature_2m&forecast_hours=24' +
  '&timezone=Asia%2FBangkok';

const LIVE_AQ_URL = _cfg.airQualityUrl ||
  'https://air-quality-api.open-meteo.com/v1/air-quality' +
  '?latitude=16.44&longitude=102.82' +
  '&current=pm2_5,us_aqi' +
  '&timezone=Asia%2FBangkok';

const LIVE_REFRESH_MS = 10 * 60 * 1000;

/* ── Color/threshold helpers ─────────────────────────────────────────────── */
function tempColor(t) {
  if (t == null) return '#64748B';
  if (t < 25)   return '#1E3A8A';
  if (t < 30)   return '#22D3EE';
  if (t < 34)   return '#FACC15';
  if (t < 37)   return '#FB923C';
  return              '#EF4444';
}

function thresholdInfo(value, ranges) {
  for (const r of ranges) {
    if (r.max == null || value <= r.max) return r;
  }
  return ranges[ranges.length - 1];
}

const UV_RANGES = [
  { max: 2,    label: 'ต่ำ',                color: '#22C55E' },
  { max: 5,    label: 'ปานกลาง',            color: '#FACC15' },
  { max: 7,    label: 'สูง',                color: '#FB923C' },
  { max: 10,   label: 'สูงมาก',             color: '#EF4444' },
  { max: null, label: 'อันตราย',            color: '#B91C1C' }
];

const PM25_RANGES = [
  { max: 25,   label: 'ดีมาก',              color: '#22C55E' },
  { max: 37,   label: 'ดี',                 color: '#86EFAC' },
  { max: 50,   label: 'ปานกลาง',            color: '#FACC15' },
  { max: 90,   label: 'เริ่มมีผลต่อสุขภาพ', color: '#FB923C' },
  { max: null, label: 'มีผลต่อสุขภาพ',      color: '#EF4444' }
];

const HUMIDITY_COLOR = '#38BDF8';
const WIND_COLOR     = '#94A3B8';

/* ── Count-up animation ──────────────────────────────────────────────────── */
function animateCountUp(el, toValue, decimals, duration) {
  if (prefersReducedMotion || toValue == null || isNaN(toValue)) return;
  const start = performance.now();
  function step(now) {
    const t     = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val   = toValue * eased;
    el.textContent = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = decimals > 0 ? toValue.toFixed(decimals) : String(Math.round(toValue));
  }
  requestAnimationFrame(step);
}

/* ── Card updater ────────────────────────────────────────────────────────── */
function setCard(idSuffix, value, unit, subText, color) {
  const valEl  = document.getElementById(`lc-${idSuffix}-val`);
  const subEl  = document.getElementById(`lc-${idSuffix}-sub`);
  const barEl  = document.getElementById(`lc-${idSuffix}-bar`);
  const cardEl = document.getElementById(`lc-${idSuffix}`);

  if (valEl) {
    if (value != null) {
      const num      = parseFloat(value);
      const decimals = String(value).includes('.') ? String(value).split('.')[1].length : 0;
      if (!prefersReducedMotion && !isNaN(num)) {
        animateCountUp(valEl, num, decimals, 600);
      } else {
        valEl.textContent = value;
      }
    } else {
      valEl.textContent = '—';
    }
  }
  if (subEl)  { subEl.textContent = subText || ''; }
  if (barEl)  { barEl.style.background = color; }
  if (cardEl) {
    const ddEl = cardEl.querySelector('.live-card-val');
    if (ddEl) ddEl.style.color = color;
  }
}

/* ── Sparkline ───────────────────────────────────────────────────────────── */
function renderSparkline(times, temps) {
  const svg     = document.getElementById('sparkline');
  const xLabels = document.getElementById('sparkline-x');
  if (!svg || !times || !temps || temps.length < 2) return;

  const W = 600, H = 90, PAD = { t: 10, r: 8, b: 14, l: 8 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const validTemps = temps.map(Number).filter(isFinite);
  const minT = Math.min(...validTemps);
  const maxT = Math.max(...validTemps);
  const rangeT = maxT - minT || 1;

  const pts = temps.map((t, i) => ({
    x: PAD.l + (i / (temps.length - 1)) * innerW,
    y: PAD.t + innerH - ((Number(t) - minT) / rangeT) * innerH,
    t: Number(t)
  }));

  const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPoints =
    `${PAD.l},${PAD.t + innerH} ` +
    polyPoints +
    ` ${PAD.l + innerW},${PAD.t + innerH}`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="spkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#22D3EE"/>
        <stop offset="35%"  stop-color="#FACC15"/>
        <stop offset="65%"  stop-color="#FB923C"/>
        <stop offset="100%" stop-color="#EF4444"/>
      </linearGradient>
      <linearGradient id="spkAreaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#22D3EE" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#EF4444" stop-opacity="0.08"/>
      </linearGradient>
    </defs>
    <polygon points="${areaPoints}" fill="url(#spkAreaGrad)"/>
    <polyline points="${polyPoints}" fill="none" stroke="url(#spkGrad)"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.filter((_,i) => i === 0 || i === pts.length-1 || i % 6 === 0).map(p =>
      `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3"
               fill="${tempColor(p.t)}" stroke="#0B0F1A" stroke-width="1.5"/>`
    ).join('')}
  `;

  if (xLabels && times.length) {
    const step      = Math.floor((times.length - 1) / 4);
    const labelIdxs = [0, step, step*2, step*3, times.length - 1];
    xLabels.innerHTML = labelIdxs.map(i => {
      const d  = new Date(times[i]);
      const hh = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' });
      return `<span>${hh}</span>`;
    }).join('');
  }
}

/* ── Render panel ────────────────────────────────────────────────────────── */
function renderLivePanel(weather, airQuality) {
  const panel = document.getElementById('live-panel');
  const tsEl  = document.getElementById('live-timestamp');
  if (!panel) return;

  const cur    = weather?.current  || {};
  const aq     = airQuality?.current || {};
  const hourly = weather?.hourly   || {};

  const temp  = cur.temperature_2m      != null ? Number(cur.temperature_2m)      : null;
  const feels = cur.apparent_temperature != null ? Number(cur.apparent_temperature) : null;
  const humid = cur.relative_humidity_2m != null ? Number(cur.relative_humidity_2m) : null;
  const wind  = cur.wind_speed_10m       != null ? Math.round(Number(cur.wind_speed_10m)) : null;
  const uv    = cur.uv_index             != null ? Number(cur.uv_index)             : null;
  const pm25  = aq.pm2_5                != null ? Number(aq.pm2_5)                : null;

  const uvInfo   = uv   != null ? thresholdInfo(uv,   UV_RANGES)   : { label: 'ไม่มีข้อมูล', color: '#64748B' };
  const pm25Info = pm25 != null ? thresholdInfo(pm25, PM25_RANGES) : { label: 'ไม่มีข้อมูล', color: '#64748B' };

  setCard('temp',     temp  != null ? temp.toFixed(1)          : null, '°C',    'ขอนแก่น',       tempColor(temp));
  setCard('feels',    feels != null ? feels.toFixed(1)         : null, '°C',    'ดัชนีความร้อน',  tempColor(feels));
  setCard('humidity', humid != null ? Math.round(humid)        : null, '%',     'ความชื้นสัมพัทธ์', HUMIDITY_COLOR);
  setCard('wind',     wind  != null ? wind                     : null, 'km/h',  'ความเร็วลม',     WIND_COLOR);
  setCard('uv',       uv    != null ? uv.toFixed(1)            : null, '',      uvInfo.label,    uvInfo.color);
  setCard('pm25',     pm25  != null ? String(Math.round(pm25)) : null, 'µg/m³', pm25Info.label,  pm25Info.color);

  if (hourly.time?.length && hourly.temperature_2m?.length) {
    if (!prefersReducedMotion) {
      renderSparkline(hourly.time, hourly.temperature_2m);
    } else {
      const first = hourly.temperature_2m[0];
      const last  = hourly.temperature_2m[hourly.temperature_2m.length - 1];
      const spk   = document.getElementById('sparkline');
      if (spk) {
        spk.innerHTML = `<text x="300" y="50" text-anchor="middle"
          font-family="Noto Sans Thai,sans-serif" font-size="14" fill="#94A3B8">
          ช่วง 24 ชม.: ${Number(first).toFixed(1)}°C → ${Number(last).toFixed(1)}°C
        </text>`;
      }
    }
  }

  if (tsEl) {
    tsEl.textContent = 'อัปเดตล่าสุด: ' + new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: false
    }) + ' น.';
  }

  /* ── Weather icon banner ──────────────────────────────────────────────── */
  const wcode  = cur.weather_code != null ? +cur.weather_code : null;
  const isDay  = cur.is_day != null ? cur.is_day === 1 : (new Date().getHours() >= 6 && new Date().getHours() < 18);
  const banner = document.getElementById('live-wx-banner');
  if (banner && wcode != null && typeof getWeatherIcon === 'function') {
    const label = typeof wmoLabel    === 'function' ? wmoLabel(wcode)           : '';
    const theme = typeof weatherTheme === 'function' ? weatherTheme(wcode, isDay) : '';
    banner.className = 'live-wx-banner' + (theme ? ' ' + theme : '');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', `สภาพอากาศปัจจุบัน: ${label}`);
    banner.innerHTML =
      `<div class="live-wx-icon">${getWeatherIcon(wcode, isDay)}</div>` +
      `<span class="live-wx-label">${label}</span>`;
    banner.hidden = false;
  }

  panel.hidden = false;
}

/* ── Fetch ───────────────────────────────────────────────────────────────── */
async function fetchLiveData() {
  const loadingEl = document.getElementById('live-loading');
  const errorEl   = document.getElementById('live-error');
  const panelEl   = document.getElementById('live-panel');

  if (loadingEl) loadingEl.hidden = false;
  if (errorEl)   errorEl.hidden   = true;
  if (panelEl)   panelEl.hidden   = true;

  console.log('[live] Fetching:', LIVE_WEATHER_URL, LIVE_AQ_URL);

  const [wResult, aqResult] = await Promise.allSettled([
    fetch(LIVE_WEATHER_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (d.error) throw new Error(d.reason || 'forecast error'); return d; }),

    fetch(LIVE_AQ_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (d.error) throw new Error(d.reason || 'air quality error'); return d; })
  ]);

  if (wResult.status  === 'rejected') console.error('[live] forecast failed:',     wResult.reason);
  if (aqResult.status === 'rejected') console.error('[live] air quality failed:', aqResult.reason);

  const weather    = wResult.status  === 'fulfilled' ? wResult.value  : null;
  const airQuality = aqResult.status === 'fulfilled' ? aqResult.value : null;

  console.log('[live] weather:', weather, 'airQuality:', airQuality);

  if (loadingEl) loadingEl.hidden = true;

  if (!weather && !airQuality) {
    if (errorEl) errorEl.hidden = false;
    return;
  }

  renderLivePanel(weather, airQuality);
}

function initLiveData() {
  fetchLiveData();

  const retryBtn = document.getElementById('live-retry');
  if (retryBtn) retryBtn.addEventListener('click', fetchLiveData);

  setInterval(fetchLiveData, LIVE_REFRESH_MS);
}
