/* ==========================================================================
   Heat Safe Khon Kaen — floodlive.js
   Live flood/rain data for flood.html only
   Source: Open-Meteo (free, no API key, CORS-enabled)
   Coords: 16.44°N 102.82°E (Khon Kaen) · Timezone: Asia/Bangkok
   Refresh: every 15 minutes
   ========================================================================== */
'use strict';

const FLOOD_API_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=16.44&longitude=102.82' +
  '&current=precipitation,rain,weather_code,is_day' +
  '&daily=precipitation_sum,rain_sum,precipitation_hours' +
  '&hourly=soil_moisture_0_to_7cm' +
  '&forecast_days=7' +
  '&timezone=Asia%2FBangkok';

const FLOOD_REFRESH_MS = 15 * 60 * 1000;

/* Guard: fall back to plain fetch if helper not loaded */
const _fetchFlood = typeof fetchWithTimeout === 'function' ? fetchWithTimeout : fetch;

const RAIN_RANGES = [
  { max: 0,    label: 'ไม่มีฝน',       color: '#94A3B8' },
  { max: 10,   label: 'ฝนเล็กน้อย',    color: '#38BDF8' },
  { max: 35,   label: 'ฝนปานกลาง',     color: '#22D3EE' },
  { max: 90,   label: 'ฝนตกหนัก',      color: '#F59E0B' },
  { max: null, label: 'ฝนตกหนักมาก',   color: '#EF4444' }
];

const SOIL_RANGES = [
  { max: 0.15,  label: 'ดินแห้ง',       color: '#94A3B8' },
  { max: 0.25,  label: 'ดินชื้นปกติ',   color: '#22D3EE' },
  { max: 0.35,  label: 'ดินชื้นมาก',    color: '#FACC15' },
  { max: 0.45,  label: 'ดินอิ่มน้ำ',    color: '#FB923C' },
  { max: null,  label: 'เสี่ยงน้ำท่วม', color: '#EF4444' }
];

function floodRange(value, ranges) {
  for (const r of ranges) {
    if (r.max == null || value <= r.max) return r;
  }
  return ranges[ranges.length - 1];
}

function getCurrentHourIndex(times) {
  if (!times || !times.length) return 0;
  const nowHour = new Date().toISOString().slice(0, 13);
  const idx = times.findIndex(t => t.startsWith(nowHour));
  return idx >= 0 ? idx : 0;
}

function updateStatusStrip(rain, rainInfo, soil, soilInfo, forecast, forecastInfo) {
  const rainEl     = document.getElementById('fss-rain');
  const soilEl     = document.getElementById('fss-soil');
  const forecastEl = document.getElementById('fss-forecast');
  const riskEl     = document.getElementById('fss-risk');
  const sepEl      = document.querySelector('.flood-strip-sep--hide');

  if (rainEl)     { rainEl.textContent = rain != null ? rain.toFixed(1) : '—'; rainEl.style.color = rainInfo.color; }
  if (soilEl)     { soilEl.textContent = soil != null ? soil : '—'; soilEl.style.color = soilInfo.color; }
  if (forecastEl) { forecastEl.textContent = forecast != null ? forecast.toFixed(0) : '—'; forecastEl.style.color = forecastInfo.color; }

  /* แสดง risk badge เฉพาะเมื่อระดับสูงกว่า "ดินชื้นปกติ" */
  if (riskEl && soilInfo.label && soilInfo.label !== 'ดินแห้ง' && soilInfo.label !== 'ดินชื้นปกติ') {
    riskEl.textContent    = soilInfo.label;
    riskEl.style.color    = soilInfo.color;
    riskEl.classList.add('visible');
    if (sepEl) sepEl.classList.remove('flood-strip-sep--hide');
  } else if (riskEl) {
    riskEl.classList.remove('visible');
    if (sepEl) sepEl.classList.add('flood-strip-sep--hide');
  }
}

function renderFloodBars(dates, precip) {
  const container = document.getElementById('flood-bars');
  if (!container || !dates || !precip) return;

  const DAY_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  const BAR_H  = 72;
  const vals   = precip.map(v => Math.max(Number(v) || 0, 0));
  const maxVal = Math.max(...vals, 1);

  container.innerHTML = dates.map((dateStr, i) => {
    const val  = vals[i];
    const px   = val > 0 ? Math.max((val / maxVal) * BAR_H, 3) : 0;
    const day  = new Date(dateStr).getDay();
    const info = floodRange(val, RAIN_RANGES);
    const lbl  = i === 0 ? 'วันนี้' : DAY_TH[day];
    return `
      <div class="flood-bar-col">
        <span class="flood-bar-amt">${val > 0 ? val.toFixed(0) : '—'}</span>
        <div class="flood-bar" style="height:${px}px;background:${info.color}" title="${val.toFixed(1)} มม."></div>
        <span class="flood-bar-day">${lbl}</span>
      </div>`;
  }).join('');
}

function renderFloodPanel(data) {
  const panel  = document.getElementById('flood-live-panel');
  const daily  = data.daily  || {};
  const hourly = data.hourly || {};

  /* ── Compute shared values ── */
  const rainToday = daily.precipitation_sum?.[0] != null ? Number(daily.precipitation_sum[0]) : null;
  const rainInfo  = rainToday != null ? floodRange(rainToday, RAIN_RANGES) : { label: '—', color: '#64748B' };

  const hIdx     = getCurrentHourIndex(hourly.time || []);
  const soilRaw  = hourly.soil_moisture_0_to_7cm?.[hIdx] != null ? Number(hourly.soil_moisture_0_to_7cm[hIdx]) : null;
  const soilPct  = soilRaw != null ? Math.round(soilRaw * 100) : null;
  const soilInfo = soilRaw != null ? floodRange(soilRaw, SOIL_RANGES) : { label: '—', color: '#64748B' };

  const sum3 = daily.precipitation_sum
    ? daily.precipitation_sum.slice(1, 4).reduce((a, v) => a + (Number(v) || 0), 0)
    : null;
  const sum3Info = sum3 != null ? floodRange(sum3, RAIN_RANGES) : { label: '—', color: '#64748B' };

  /* ── Status strip — runs on both flood.html and flood-live.html ── */
  updateStatusStrip(rainToday, rainInfo, soilPct, soilInfo, sum3, sum3Info);

  /* ── flood-live.html panel only ── */
  if (!panel) return;

  const rValEl = document.getElementById('flc-rain-val');
  const rSubEl = document.getElementById('flc-rain-sub');
  if (rValEl) { rValEl.textContent = rainToday != null ? rainToday.toFixed(1) : '—'; rValEl.style.color = rainInfo.color; }
  if (rSubEl) { rSubEl.textContent = rainInfo.label; rSubEl.style.color = rainInfo.color; }

  const sValEl = document.getElementById('flc-soil-val');
  const sSubEl = document.getElementById('flc-soil-sub');
  if (sValEl) { sValEl.textContent = soilPct != null ? soilPct : '—'; sValEl.style.color = soilInfo.color; }
  if (sSubEl) { sSubEl.textContent = soilInfo.label; sSubEl.style.color = soilInfo.color; }

  const fValEl = document.getElementById('flc-forecast-val');
  const fSubEl = document.getElementById('flc-forecast-sub');
  if (fValEl) { fValEl.textContent = sum3 != null ? sum3.toFixed(0) : '—'; fValEl.style.color = sum3Info.color; }
  if (fSubEl) { fSubEl.textContent = sum3Info.label; fSubEl.style.color = '#94A3B8'; }

  /* ── แผนภูมิ 7 วัน */
  renderFloodBars(daily.date, daily.precipitation_sum);

  /* ── Weather icon banner */
  const cur    = data.current || {};
  const wcode  = cur.weather_code != null ? +cur.weather_code : null;
  const isDay  = cur.is_day != null ? cur.is_day === 1
                 : (new Date().getHours() >= 6 && new Date().getHours() < 18);
  const banner = document.getElementById('flood-wx-banner');
  if (banner && wcode != null && typeof getWeatherIcon === 'function') {
    const label = typeof wmoLabel    === 'function' ? wmoLabel(wcode)            : '';
    const theme = typeof weatherTheme === 'function' ? weatherTheme(wcode, isDay) : '';
    banner.className = 'live-wx-banner' + (theme ? ' ' + theme : '');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', `สภาพอากาศปัจจุบัน: ${label}`);
    banner.innerHTML =
      `<div class="live-wx-icon">${getWeatherIcon(wcode, isDay)}</div>` +
      `<span class="live-wx-label">${label}</span>`;
    banner.hidden = false;
  }

  /* ── Timestamp */
  const tsEl = document.getElementById('flood-live-ts');
  if (tsEl) {
    tsEl.textContent = 'อัปเดตล่าสุด: ' + new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: false
    }) + ' น.';
  }

  panel.hidden = false;
}

async function fetchFloodLive() {
  const loadEl  = document.getElementById('flood-live-loading');
  const errorEl = document.getElementById('flood-live-error');
  const panelEl = document.getElementById('flood-live-panel');

  if (loadEl)  loadEl.hidden  = false;
  if (errorEl) errorEl.hidden = true;
  if (panelEl) panelEl.hidden = true;

  try {
    const res  = await _fetchFlood(FLOOD_API_URL, {}, 10000);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.reason || 'API error');
    if (loadEl) loadEl.hidden = true;
    renderFloodPanel(data);
  } catch (err) {
    console.error('[floodlive]', err);
    if (loadEl)  loadEl.hidden  = true;
    if (errorEl) errorEl.hidden = false;
  }
}

function initFloodLive() {
  /* Run on flood-live.html (full panel) OR flood.html (status strip only) */
  const hasPanel = !!document.getElementById('flood-live-panel');
  const hasStrip = !!document.getElementById('fss-rain');
  if (!hasPanel && !hasStrip) return;
  fetchFloodLive();
  const btn = document.getElementById('flood-live-retry');
  if (btn) btn.addEventListener('click', fetchFloodLive);
  setInterval(fetchFloodLive, FLOOD_REFRESH_MS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloodLive);
} else {
  initFloodLive();
}
