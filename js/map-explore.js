/* ==========================================================================
   Map Explorer — map-explore.js
   Click any point → reverse geocode + weather + air quality
   Sources: Nominatim OSM · Open-Meteo Forecast · Open-Meteo Air Quality
   ========================================================================== */
'use strict';

const CFG    = window.HSKK_CONFIG || {};
const CENTER = [CFG.loc?.lng ?? 102.82, CFG.loc?.lat ?? 16.44];
const ZOOM   = CFG.loc?.zoom ?? 11;

/* ────────────────────────────────────────────────────────────────────────── */
/* LOOKUP TABLES                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const WMO = {
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

function wmoLookup(code) {
  if (code == null) return { th: 'ไม่ทราบ', e: '—' };
  // WMO codes group: use floor to nearest known key
  return WMO[code] || WMO[Math.floor(code / 10) * 10] || { th: 'ไม่ทราบ', e: '🌡️' };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* LEVEL HELPERS                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function aqiMeta(aqi) {
  const n = aqi ?? null;
  if (n === null) return { label: 'ไม่มีข้อมูล', color: '#475569', chipBg: '#1E293B40', pct: 0 };
  if (n <= 50)   return { label: 'ดีมาก',                 color: '#22C55E', chipBg: '#14532D40', pct: n / 300 };
  if (n <= 100)  return { label: 'ปานกลาง',               color: '#FACC15', chipBg: '#71390C40', pct: n / 300 };
  if (n <= 150)  return { label: 'เริ่มมีผลต่อสุขภาพ',   color: '#FB923C', chipBg: '#7C2D1240', pct: n / 300 };
  if (n <= 200)  return { label: 'มีผลต่อสุขภาพ',        color: '#EF4444', chipBg: '#7F1D1D40', pct: n / 300 };
  if (n <= 300)  return { label: 'อันตราย',               color: '#A855F7', chipBg: '#4A1D9640', pct: 1 };
  return                 { label: 'อันตรายมาก',            color: '#7E22CE', chipBg: '#3B076440', pct: 1 };
}

function heatMeta(t) {
  if (t == null) return { label: '—', color: '#64748B' };
  if (t < 27) return { label: 'สบาย',         color: '#22D3EE' };
  if (t < 32) return { label: 'ร้อน',         color: '#FACC15' };
  if (t < 38) return { label: 'ร้อนจัด',     color: '#FB923C' };
  if (t < 45) return { label: 'อันตราย',     color: '#EF4444' };
  return              { label: 'อันตรายมาก', color: '#7C3AED' };
}

function humidMeta(h) {
  if (h == null) return { label: '—', color: '#64748B' };
  if (h < 30) return { label: 'แห้งมาก',     color: '#FB923C' };
  if (h < 50) return { label: 'ปกติ',         color: '#22D3EE' };
  if (h < 70) return { label: 'ชื้นพอดี',    color: '#22C55E' };
  if (h < 85) return { label: 'ค่อนข้างชื้น', color: '#FACC15' };
  return              { label: 'ชื้นมาก',     color: '#94A3B8' };
}

function uvMeta(uv) {
  if (uv == null) return { label: '—', color: '#64748B' };
  if (uv < 3)  return { label: 'ต่ำ',     color: '#22D3EE' };
  if (uv < 6)  return { label: 'ปานกลาง', color: '#FACC15' };
  if (uv < 8)  return { label: 'สูง',     color: '#FB923C' };
  if (uv < 11) return { label: 'สูงมาก',  color: '#EF4444' };
  return               { label: 'อันตราย', color: '#A855F7' };
}

const WIND_TH    = ['เหนือ','ตะวันออกเฉียงเหนือ','ตะวันออก','ตะวันออกเฉียงใต้','ใต้','ตะวันตกเฉียงใต้','ตะวันตก','ตะวันตกเฉียงเหนือ'];
const WIND_SHORT = ['N','NE','E','SE','S','SW','W','NW'];
function windDir(deg) {
  const i = Math.round((deg ?? 0) / 45) % 8;
  return { th: WIND_TH[i], short: WIND_SHORT[i] };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* NOMINATIM PARSER                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function parseGeo(geo) {
  if (!geo?.address) return { main: 'ไม่ทราบสถานที่', sub: '', province: '' };
  const a = geo.address;

  /* Main name: most local first */
  const main = a.village || a.hamlet || a.neighbourhood || a.suburb
             || a.quarter || a.city_district || a.town || a.city
             || a.county || 'ไม่ทราบพื้นที่';

  /* Subdistrict + District (avoid repeating what's in main) */
  const parts = [];
  const tam = a.subdistrict || a.quarter;
  const amp = a.county || a.city_district;
  if (tam && tam !== main) parts.push('ต.' + tam);
  if (amp && amp !== main) parts.push('อ.' + amp);

  return {
    main,
    sub:      parts.join('  ·  '),
    province: a.state  ? 'จ.' + a.state : '',
  };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FORMAT HELPERS                                                             */
/* ────────────────────────────────────────────────────────────────────────── */
const f1  = v => v != null ? (+v).toFixed(1) : '—';
const f0  = v => v != null ? String(Math.round(+v)) : '—';
const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ────────────────────────────────────────────────────────────────────────── */
/* MAP INIT                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
let map, clickMarker = null, activeLayer = 'osm';

function buildStyle(layer) {
  const layers = [];
  if (layer === 'osm') {
    layers.push({ id: 'osm-layer', type: 'raster', source: 'osm', layout: { visibility: 'visible' } });
  } else {
    layers.push({ id: 'sat-layer', type: 'raster', source: 'esriSat', layout: { visibility: 'visible' } });
    layers.push({ id: 'ref-layer', type: 'raster', source: 'esriRef', layout: { visibility: 'visible' } });
  }
  return {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      osm: {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256, maxzoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      },
      esriSat: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256, maxzoom: 19,
        attribution: 'Tiles © Esri, Maxar, Earthstar Geographics'
      },
      esriRef: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256, maxzoom: 19,
        attribution: 'Labels © Esri'
      }
    },
    layers
  };
}

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: buildStyle('osm'),
    center: CENTER,
    zoom:   ZOOM,
    minZoom: 7,
    maxZoom: 19,
    attributionControl: false
  });

  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    fitBoundsOptions: { maxZoom: 14 }
  }), 'bottom-right');

  map.on('click', onMapClick);

  map.on('load', () => {
    map.getCanvas().style.cursor = 'crosshair';
  });

  map.on('error', (e) => {
    console.error('[map-explore] MapLibre error:', e.error || e);
  });

  /* Layer toggle buttons */
  document.querySelectorAll('.layer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.layer === activeLayer) return;
      activeLayer = btn.dataset.layer;
      document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      map.setStyle(buildStyle(activeLayer));
      map.once('styledata', () => { map.getCanvas().style.cursor = 'crosshair'; });
    });
  });

  document.getElementById('panel-close')?.addEventListener('click', closePanel);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* CLICK HANDLER                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
async function onMapClick(e) {
  try {
    const { lng, lat } = e.lngLat;

    if (clickMarker) { clickMarker.remove(); clickMarker = null; }
    clickMarker = new maplibregl.Marker({ element: makeMarkerEl(), anchor: 'center' })
      .setLngLat([lng, lat]).addTo(map);

    showLoading();
    hideHint();

    const [geoR, wxR, aqR] = await Promise.allSettled([
      fetchGeocode(lat, lng),
      fetchWeather(lat, lng),
      fetchAir(lat, lng)
    ]);

    renderPanel(
      geoR.status === 'fulfilled' ? geoR.value : null,
      wxR.status  === 'fulfilled' ? wxR.value  : null,
      aqR.status  === 'fulfilled' ? aqR.value  : null,
      lat, lng
    );
  } catch (err) {
    console.error('[map-explore] onMapClick error:', err);
    setPanel('<div style="padding:2rem;color:#EF4444;font-family:sans-serif">เกิดข้อผิดพลาด: ' + err.message + '</div>');
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* API CALLS                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
async function fetchGeocode(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}` +
    `&format=json&accept-language=th&zoom=16`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('geocode ' + r.status);
  return r.json();
}

async function fetchWeather(lat, lng) {
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
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?${p}`);
  if (!r.ok) throw new Error('weather ' + r.status);
  return r.json();
}

async function fetchAir(lat, lng) {
  const p = new URLSearchParams({
    latitude:  lat.toFixed(4),
    longitude: lng.toFixed(4),
    current: 'pm2_5,pm10,us_aqi,carbon_monoxide',
    timezone: 'Asia/Bangkok'
  });
  const r = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${p}`);
  if (!r.ok) throw new Error('air ' + r.status);
  return r.json();
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PANEL RENDER                                                               */
/* ────────────────────────────────────────────────────────────────────────── */
function renderPanel(geo, wx, aq, lat, lng) {
  const loc  = parseGeo(geo);
  const c    = wx?.current  ?? {};
  const ac   = aq?.current  ?? {};

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

  const wmo  = wmoLookup(wCode);
  const aqM  = aqiMeta(aqi);
  const htM  = heatMeta(feels);
  const humM = humidMeta(humid);
  const uvM  = uvMeta(uv);
  const wd   = wDirV != null ? windDir(wDirV) : null;

  const now  = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  const rainHtml = precip != null && precip > 0
    ? `<span style="color:#38BDF8">${f1(precip)} มม</span>`
    : `<span style="color:#475569">ไม่มีฝน</span>`;

  setPanel(`
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
        <div id="loc-main">${esc(loc.main)}</div>
        <div id="loc-sub">${esc(loc.sub)}</div>
        <div id="loc-province">${esc(loc.province)}</div>
        <div id="loc-coords">${lat.toFixed(5)}°N &nbsp;${lng.toFixed(5)}°E</div>
      </div>
      <button id="panel-close" aria-label="ปิด">✕</button>
    </div>

    <div id="panel-scroll">

      <!-- ── Weather ──────────────────────────────────────────── -->
      <div class="p-section">
        <div class="p-section-lbl">สภาพอากาศ ณ จุดนี้</div>

        <div id="wx-row">
          <span id="wx-emoji" role="img" aria-label="${esc(wmo.th)}">${wmo.e}</span>
          <span id="wx-label">${esc(wmo.th)}</span>
        </div>

        <div class="data-grid">

          <!-- Temperature -->
          <div class="data-card">
            <div class="dc-label">🌡️ อุณหภูมิ</div>
            <div class="dc-value">${f1(temp)}<span class="dc-unit">°C</span></div>
            <div class="dc-sub" style="color:${htM.color}">
              รู้สึก ${f1(feels)}°C &nbsp;·&nbsp; ${htM.label}
            </div>
          </div>

          <!-- Humidity -->
          <div class="data-card">
            <div class="dc-label">💧 ความชื้น</div>
            <div class="dc-value">${f0(humid)}<span class="dc-unit">%</span></div>
            <div class="dc-sub" style="color:${humM.color}">${humM.label}</div>
          </div>

          <!-- Rain -->
          <div class="data-card">
            <div class="dc-label">🌧️ ฝน</div>
            <div class="dc-value">${f1(precip)}<span class="dc-unit">มม</span></div>
            <div class="dc-sub">${rainHtml}</div>
          </div>

          <!-- Wind -->
          <div class="data-card">
            <div class="dc-label">🌬️ ลม</div>
            <div class="dc-value">${f0(wSpeed)}<span class="dc-unit">กม/ชม</span></div>
            <div class="dc-sub">${wd ? `ทิศ${wd.th} (${wd.short})` : '—'}</div>
          </div>

          <!-- UV -->
          <div class="data-card">
            <div class="dc-label">☀️ UV Index</div>
            <div class="dc-value">${f1(uv)}</div>
            <div class="dc-sub" style="color:${uvM.color}">${uvM.label}</div>
          </div>

          <!-- Pressure -->
          <div class="data-card">
            <div class="dc-label">🔵 ความดันอากาศ</div>
            <div class="dc-value">${f0(press)}<span class="dc-unit">hPa</span></div>
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
              <span class="aqi-pm-val">${pm25 != null ? f1(pm25) : '—'}</span>
              <span class="aqi-pm-unit">µg/m³</span>
            </div>
            <div style="text-align:right">
              <div class="dc-label" style="margin-bottom:1px">PM10</div>
              <span class="aqi-pm-val">${pm10 != null ? f1(pm10) : '—'}</span>
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
              ${esc(aqM.label)}
            </span>
            <span class="aqi-aqi-val">AQI US&nbsp;${aqi != null ? f0(aqi) : '—'}</span>
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

  /* Re-attach close button after innerHTML */
  document.getElementById('panel-close')?.addEventListener('click', closePanel);
}

/* ────────────────────────────────────────────────────────────────────────── */
/* PANEL HELPERS                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
function setPanel(html) {
  const p = document.getElementById('info-panel');
  p.innerHTML = html;
  p.classList.add('open');
}

function showLoading() {
  setPanel(`
    <div id="panel-drag-handle"></div>
    <div id="panel-loading">
      <div class="spinner"></div>
      <span>กำลังดึงข้อมูล...</span>
    </div>
  `);
}

function closePanel() {
  document.getElementById('info-panel').classList.remove('open');
  if (clickMarker) { clickMarker.remove(); clickMarker = null; }
  showHint();
}

function hideHint() { document.getElementById('click-hint')?.classList.add('hidden'); }
function showHint()  { document.getElementById('click-hint')?.classList.remove('hidden'); }

/* ────────────────────────────────────────────────────────────────────────── */
/* PULSE MARKER                                                               */
/* ────────────────────────────────────────────────────────────────────────── */
function makeMarkerEl() {
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
if (typeof maplibregl !== 'undefined') {
  initMap();
} else {
  document.getElementById('map')?.insertAdjacentHTML('afterend',
    '<p style="color:#EF4444;padding:1rem">MapLibre GL JS ไม่ถูกโหลด</p>');
}
