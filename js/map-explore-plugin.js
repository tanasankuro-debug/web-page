/* ==========================================================================
   Map Explore Plugin — map-explore-plugin.js
   Attaches click-to-explore to the existing window.HSKK_MAP instance.
   Click any point → reverse geocode + weather + air quality
   Sources: Nominatim OSM · Open-Meteo Forecast · Open-Meteo Air Quality
   ========================================================================== */
'use strict';

/* ────────────────────────────────────────────────────────────────────────── */
/* LOOKUP TABLES                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const EXPLORE_WMO = {
  0:  { th: 'ท้องฟ้าแจ่มใส',        e: '☀️' },
  1:  { th: 'แจ่มใสเป็นส่วนใหญ่',   e: '🌤️' },
  2:  { th: 'มีเมฆบางส่วน',          e: '⛅'  },
  3:  { th: 'เมฆปกคลุม',             e: '☁️'  },
  45: { th: 'หมอกลง',                e: '🌫️' },
  48: { th: 'หมอกน้ำค้าง',           e: '🌫️' },
  51: { th: 'ฝนปรอยเบา',            e: '🌦️' },
  53: { th: 'ฝนปรอยปานกลาง',       e: '🌦️' },
  55: { th: 'ฝนปรอยหนัก',           e: '🌧️' },
  61: { th: 'ฝนเบา',                e: '🌧️' },
  63: { th: 'ฝนปานกลาง',            e: '🌧️' },
  65: { th: 'ฝนหนัก',               e: '🌧️' },
  80: { th: 'ฝนตกเป็นช่วงๆ',        e: '🌦️' },
  81: { th: 'ฝนตกหนักเป็นช่วงๆ',   e: '🌦️' },
  82: { th: 'ฝนตกหนักมาก',          e: '⛈️'  },
  95: { th: 'พายุฝนฟ้าคะนอง',      e: '⛈️'  },
  99: { th: 'พายุรุนแรง',           e: '⛈️'  },
};

function exWmoLookup(code) {
  if (code == null) return { th: 'ไม่ทราบ', e: '—' };
  return EXPLORE_WMO[code] || EXPLORE_WMO[Math.floor(code / 10) * 10] || { th: 'ไม่ทราบ', e: '🌡️' };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* LEVEL HELPERS                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function exAqiMeta(aqi) {
  const n = aqi ?? null;
  if (n === null) return { label: 'ไม่มีข้อมูล', color: '#475569', chipBg: '#1E293B40', pct: 0 };
  if (n <= 50)   return { label: 'ดีมาก',                 color: '#22C55E', chipBg: '#14532D40', pct: n / 300 };
  if (n <= 100)  return { label: 'ปานกลาง',               color: '#FACC15', chipBg: '#71390C40', pct: n / 300 };
  if (n <= 150)  return { label: 'เริ่มมีผลต่อสุขภาพ',   color: '#FB923C', chipBg: '#7C2D1240', pct: n / 300 };
  if (n <= 200)  return { label: 'มีผลต่อสุขภาพ',        color: '#EF4444', chipBg: '#7F1D1D40', pct: n / 300 };
  if (n <= 300)  return { label: 'อันตราย',               color: '#A855F7', chipBg: '#4A1D9640', pct: 1 };
  return                 { label: 'อันตรายมาก',            color: '#7E22CE', chipBg: '#3B076440', pct: 1 };
}

function exHeatMeta(t) {
  if (t == null) return { label: '—', color: '#64748B' };
  if (t < 27) return { label: 'สบาย',         color: '#22D3EE' };
  if (t < 32) return { label: 'ร้อน',         color: '#FACC15' };
  if (t < 38) return { label: 'ร้อนจัด',     color: '#FB923C' };
  if (t < 45) return { label: 'อันตราย',     color: '#EF4444' };
  return              { label: 'อันตรายมาก', color: '#7C3AED' };
}

function exHumidMeta(h) {
  if (h == null) return { label: '—', color: '#64748B' };
  if (h < 30) return { label: 'แห้งมาก',      color: '#FB923C' };
  if (h < 50) return { label: 'ปกติ',          color: '#22D3EE' };
  if (h < 70) return { label: 'ชื้นพอดี',     color: '#22C55E' };
  if (h < 85) return { label: 'ค่อนข้างชื้น', color: '#FACC15' };
  return              { label: 'ชื้นมาก',      color: '#94A3B8' };
}

function exUvMeta(uv) {
  if (uv == null) return { label: '—', color: '#64748B' };
  if (uv < 3)  return { label: 'ต่ำ',     color: '#22D3EE' };
  if (uv < 6)  return { label: 'ปานกลาง', color: '#FACC15' };
  if (uv < 8)  return { label: 'สูง',     color: '#FB923C' };
  if (uv < 11) return { label: 'สูงมาก',  color: '#EF4444' };
  return               { label: 'อันตราย', color: '#A855F7' };
}

const EX_WIND_TH    = ['เหนือ','ตะวันออกเฉียงเหนือ','ตะวันออก','ตะวันออกเฉียงใต้','ใต้','ตะวันตกเฉียงใต้','ตะวันตก','ตะวันตกเฉียงเหนือ'];
const EX_WIND_SHORT = ['N','NE','E','SE','S','SW','W','NW'];
function exWindDir(deg) {
  const i = Math.round((deg ?? 0) / 45) % 8;
  return { th: EX_WIND_TH[i], short: EX_WIND_SHORT[i] };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* NOMINATIM PARSER                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function exParseGeo(geo) {
  if (!geo?.address) return { main: 'ไม่ทราบสถานที่', sub: '', province: '' };
  const a = geo.address;
  const main = a.village || a.hamlet || a.neighbourhood || a.suburb
             || a.quarter || a.city_district || a.town || a.city
             || a.county || 'ไม่ทราบพื้นที่';
  const parts = [];
  const tam = a.subdistrict || a.quarter;
  const amp = a.county || a.city_district;
  if (tam && tam !== main) parts.push('ต.' + tam);
  if (amp && amp !== main) parts.push('อ.' + amp);
  return {
    main,
    sub:      parts.join('  ·  '),
    province: a.state ? 'จ.' + a.state : '',
  };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FORMAT HELPERS                                                             */
/* ────────────────────────────────────────────────────────────────────────── */
const exF1  = v => v != null ? (+v).toFixed(1) : '—';
const exF0  = v => v != null ? String(Math.round(+v)) : '—';
const exEsc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ────────────────────────────────────────────────────────────────────────── */
/* ICON SET                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
const EX_ICON = {
  temp:  `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0z"/></svg>`,
  humid: `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-4-7-12-7-12S5 11 5 15a7 7 0 0 0 7 7z"/></svg>`,
  rain:  `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14.5A3.5 3.5 0 0 1 4.7 8a4.5 4.5 0 0 1 8.8 1A3 3 0 0 1 14 14.5H4z"/><line x1="5" y1="18" x2="5" y2="20"/><line x1="9" y1="18" x2="9" y2="20"/><line x1="13" y1="18" x2="13" y2="20"/></svg>`,
  wind:  `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h11a3 3 0 1 0-3-4"/><path d="M3 12h16a3.5 3.5 0 1 1-3.5 3.5"/><path d="M3 16h7"/></svg>`,
  uv:    `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>`,
  press: `<svg class="dc-icon" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.1 17.5A8 8 0 1 1 18.9 17.5"/><path d="M12 12l-3-3"/><circle cx="12" cy="12" r="1.5" fill="#94A3B8" stroke="none"/></svg>`,
};

/* ────────────────────────────────────────────────────────────────────────── */
/* STATE                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */
let exClickMarker = null;
let exAbortCtrl   = null;

/* ────────────────────────────────────────────────────────────────────────── */
/* CLICK HANDLER                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
async function onExploreClick(e) {
  const map = window.HSKK_MAP;
  if (!map) return;

  if (exAbortCtrl) { exAbortCtrl.abort(); }
  exAbortCtrl = new AbortController();
  const { signal } = exAbortCtrl;

  try {
    const { lng, lat } = e.lngLat;

    if (exClickMarker) { exClickMarker.remove(); exClickMarker = null; }
    exClickMarker = new maplibregl.Marker({ element: exMakeMarkerEl(), anchor: 'center' })
      .setLngLat([lng, lat]).addTo(map);

    exShowLoading();
    exHideHint();

    const [geoR, wxR, aqR] = await Promise.allSettled([
      exFetchGeocode(lat, lng, signal),
      exFetchWeather(lat, lng, signal),
      exFetchAir(lat, lng, signal)
    ]);

    if (signal.aborted) return;

    exRenderPanel(
      geoR.status === 'fulfilled' ? geoR.value : null,
      wxR.status  === 'fulfilled' ? wxR.value  : null,
      aqR.status  === 'fulfilled' ? aqR.value  : null,
      lat, lng
    );
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.error('[explore-plugin] onExploreClick error:', err);
    exSetPanel('<div style="padding:2rem;color:#EF4444;font-family:sans-serif">เกิดข้อผิดพลาด: ' + err.message + '</div>');
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* API CALLS                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
async function exFetchGeocode(lat, lng, signal) {
  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}` +
    `&format=json&accept-language=th&zoom=16`;
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error('geocode ' + r.status);
  return r.json();
}

async function exFetchWeather(lat, lng, signal) {
  const p = new URLSearchParams({
    latitude:  lat.toFixed(4),
    longitude: lng.toFixed(4),
    current: [
      'temperature_2m', 'apparent_temperature', 'relative_humidity_2m',
      'precipitation', 'rain', 'wind_speed_10m', 'wind_direction_10m',
      'weather_code', 'uv_index', 'cloud_cover', 'surface_pressure'
    ].join(','),
    timezone: 'Asia/Bangkok'
  });
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${p}`, { signal });
  if (!r.ok) throw new Error('weather ' + r.status);
  return r.json();
}

async function exFetchAir(lat, lng, signal) {
  const p = new URLSearchParams({
    latitude:  lat.toFixed(4),
    longitude: lng.toFixed(4),
    current: 'pm2_5,pm10,us_aqi,carbon_monoxide',
    timezone: 'Asia/Bangkok'
  });
  const r = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${p}`, { signal });
  if (!r.ok) throw new Error('air ' + r.status);
  return r.json();
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PANEL RENDER                                                               */
/* ────────────────────────────────────────────────────────────────────────── */
function exRenderPanel(geo, wx, aq, lat, lng) {
  const loc  = exParseGeo(geo);
  const c    = wx?.current ?? {};
  const ac   = aq?.current ?? {};

  const temp   = c.temperature_2m       ?? null;
  const feels  = c.apparent_temperature ?? null;
  const humid  = c.relative_humidity_2m ?? null;
  const precip = c.precipitation        ?? null;
  const wSpeed = c.wind_speed_10m       ?? null;
  const wDirV  = c.wind_direction_10m   ?? null;
  const wCode  = c.weather_code         ?? null;
  const uv     = c.uv_index             ?? null;
  const press  = c.surface_pressure     ?? null;
  const pm25   = ac.pm2_5              ?? null;
  const pm10   = ac.pm10               ?? null;
  const aqi    = ac.us_aqi             ?? null;

  const wmo  = exWmoLookup(wCode);
  const aqM  = exAqiMeta(aqi);
  const htM  = exHeatMeta(feels);
  const humM = exHumidMeta(humid);
  const uvM  = exUvMeta(uv);
  const wd   = wDirV != null ? exWindDir(wDirV) : null;

  const now  = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  const rainHtml = precip != null && precip > 0
    ? `<span style="color:#38BDF8">${exF1(precip)} มม</span>`
    : `<span style="color:#475569">ไม่มีฝน</span>`;

  exSetPanel(`
    <div id="panel-drag-handle"></div>

    <!-- ── Location ─────────────────────────────────────────── -->
    <div id="panel-topbar">
      <div id="loc-body">
        <div id="loc-pin-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 1 1 16 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span style="font-size:0.62rem;color:#EF4444;font-weight:700;letter-spacing:.06em;text-transform:uppercase">สถานที่</span>
        </div>
        <div id="loc-main">${exEsc(loc.main)}</div>
        <div id="loc-sub">${exEsc(loc.sub)}</div>
        <div id="loc-province">${exEsc(loc.province)}</div>
        <div id="loc-coords">${lat.toFixed(5)}°N &nbsp;${lng.toFixed(5)}°E</div>
      </div>
      <button id="panel-close" aria-label="ปิด">✕</button>
    </div>

    <div id="panel-scroll">

      <!-- ── Weather ──────────────────────────────────────────── -->
      <div class="p-section">
        <div class="p-section-lbl">สภาพอากาศ ณ จุดนี้</div>

        <div id="wx-row">
          <span id="wx-emoji" role="img" aria-label="${exEsc(wmo.th)}">${wmo.e}</span>
          <span id="wx-label">${exEsc(wmo.th)}</span>
        </div>

        <div class="data-grid">

          <div class="data-card">
            <div class="dc-label">${EX_ICON.temp} อุณหภูมิ</div>
            <div class="dc-value">${exF1(temp)}<span class="dc-unit">°C</span></div>
            <div class="dc-sub" style="color:${htM.color}">
              รู้สึก ${exF1(feels)}°C &nbsp;·&nbsp; ${htM.label}
            </div>
          </div>

          <div class="data-card">
            <div class="dc-label">${EX_ICON.humid} ความชื้น</div>
            <div class="dc-value">${exF0(humid)}<span class="dc-unit">%</span></div>
            <div class="dc-sub" style="color:${humM.color}">${humM.label}</div>
          </div>

          <div class="data-card">
            <div class="dc-label">${EX_ICON.rain} ฝน</div>
            <div class="dc-value">${exF1(precip)}<span class="dc-unit">มม</span></div>
            <div class="dc-sub">${rainHtml}</div>
          </div>

          <div class="data-card">
            <div class="dc-label">${EX_ICON.wind} ลม</div>
            <div class="dc-value">${exF0(wSpeed)}<span class="dc-unit">กม/ชม</span></div>
            <div class="dc-sub">${wd ? `ทิศ${wd.th} (${wd.short})` : '—'}</div>
          </div>

          <div class="data-card">
            <div class="dc-label">${EX_ICON.uv} UV Index</div>
            <div class="dc-value">${exF1(uv)}</div>
            <div class="dc-sub" style="color:${uvM.color}">${uvM.label}</div>
          </div>

          <div class="data-card">
            <div class="dc-label">${EX_ICON.press} ความดันอากาศ</div>
            <div class="dc-value">${exF0(press)}<span class="dc-unit">hPa</span></div>
            <div class="dc-sub" style="color:#64748B">
              ${press != null ? (press > 1013 ? 'สูงกว่าปกติ' : press < 1005 ? 'ต่ำกว่าปกติ' : 'ปกติ') : '—'}
            </div>
          </div>

        </div>
      </div>

      <!-- ── Air Quality ──────────────────────────────────────── -->
      <div class="p-section">
        <div class="p-section-lbl">คุณภาพอากาศ</div>
        <div class="data-card" style="border-color:${aqM.color}20">

          <div class="aqi-row">
            <div>
              <div class="dc-label" style="margin-bottom:1px">PM2.5</div>
              <span class="aqi-pm-val">${pm25 != null ? exF1(pm25) : '—'}</span>
              <span class="aqi-pm-unit">µg/m³</span>
            </div>
            <div style="text-align:right">
              <div class="dc-label" style="margin-bottom:1px">PM10</div>
              <span class="aqi-pm-val">${pm10 != null ? exF1(pm10) : '—'}</span>
              <span class="aqi-pm-unit">µg/m³</span>
            </div>
          </div>

          <div class="aqi-bar-track">
            <div class="aqi-bar-fill"
                 style="width:${Math.min((aqM.pct)*100, 100).toFixed(1)}%;background:${aqM.color}">
            </div>
          </div>

          <div class="aqi-meta">
            <span class="aqi-chip"
                  style="background:${aqM.chipBg};color:${aqM.color};border-color:${aqM.color}40">
              ${exEsc(aqM.label)}
            </span>
            <span class="aqi-aqi-val">AQI US&nbsp;${aqi != null ? exF0(aqi) : '—'}</span>
          </div>

        </div>
      </div>

      <!-- ── Footer ───────────────────────────────────────────── -->
      <div id="panel-footer">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        อัปเดต ${now} &nbsp;·&nbsp; Open-Meteo · Nominatim OSM
      </div>

    </div><!-- /panel-scroll -->
  `);

  document.getElementById('panel-close')?.addEventListener('click', exClosePanel);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PANEL HELPERS                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
function exSetPanel(html) {
  const p = document.getElementById('info-panel');
  if (!p) return;
  p.innerHTML = html;
  p.classList.add('open');
}

function exShowLoading() {
  exSetPanel(`
    <div id="panel-drag-handle"></div>
    <div id="panel-loading">
      <div class="spinner"></div>
      <span>กำลังดึงข้อมูล...</span>
    </div>
  `);
}

function exClosePanel() {
  document.getElementById('info-panel')?.classList.remove('open');
  if (exClickMarker) { exClickMarker.remove(); exClickMarker = null; }
  exShowHint();
}

let _hintTimer = null;

function exHideHint() {
  const el = document.getElementById('click-hint');
  if (!el) return;
  clearTimeout(_hintTimer);
  el.classList.remove('hint-visible');
  el.classList.add('hidden');
  try { sessionStorage.setItem('mapHintSeen', '1'); } catch {}
}

function exShowHint() { /* no-op — hint is one-time per session */ }

function _initOneTimeHint() {
  try { if (sessionStorage.getItem('mapHintSeen')) return; } catch {}
  const el = document.getElementById('click-hint');
  if (!el) return;
  /* Slide in after 0.9s (map has finished loading), auto-dismiss after 4.2s more */
  _hintTimer = setTimeout(() => {
    el.classList.remove('hidden');
    el.classList.add('hint-visible');
    _hintTimer = setTimeout(exHideHint, 4200);
  }, 900);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PULSE MARKER                                                               */
/* ────────────────────────────────────────────────────────────────────────── */
function exMakeMarkerEl() {
  const el = document.createElement('div');
  el.className = 'explore-marker';
  el.innerHTML = `
    <div class="explore-marker-inner">
      <div class="explore-ring"></div>
      <div class="explore-ring"></div>
      <div class="explore-dot"></div>
    </div>`;
  return el;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* BOOT                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */
function initExplorePlugin() {
  const map = window.HSKK_MAP;
  if (!map) {
    console.warn('[explore-plugin] window.HSKK_MAP not available — explore feature disabled');
    return;
  }

  map.on('click', onExploreClick);

  if (map.loaded()) {
    map.getCanvas().style.cursor = 'crosshair';
  } else {
    map.on('load', () => { map.getCanvas().style.cursor = 'crosshair'; });
  }

  _initOneTimeHint();
}

/* Runs after main.js DOMContentLoaded (registered first → fires first → sets window.HSKK_MAP) */
document.addEventListener('DOMContentLoaded', initExplorePlugin);
