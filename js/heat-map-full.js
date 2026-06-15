/* ==========================================================================
   Heat Safe Khon Kaen — heat-map-full.js
   Full-page heat map: temperature markers, time selector,
   Heat Index sidebar, 24-hour chart.
   ========================================================================== */
'use strict';

/* ── Sampling points — all 26 districts of Khon Kaen province ───────────── */
/* Coordinates sourced from OpenStreetMap Nominatim (admin boundary centroids  */
/* + district office locations) — verified June 2025.                          */
const HMF_POINTS = [
  { id: 'mueang',      name: 'เมืองขอนแก่น', lat: 16.4304, lng: 102.8356 },
  { id: 'banfang',     name: 'บ้านฝาง',       lat: 16.4533, lng: 102.6384 },
  { id: 'phrayuen',    name: 'พระยืน',         lat: 16.3100, lng: 102.6789 },
  { id: 'nongruea',    name: 'หนองเรือ',       lat: 16.4909, lng: 102.4288 },
  { id: 'chumpae',     name: 'ชุมแพ',          lat: 16.6578, lng: 102.0165 },
  { id: 'sichomphu',   name: 'สีชมพู',         lat: 16.7578, lng: 102.1261 },
  { id: 'nampong',     name: 'น้ำพอง',         lat: 16.7019, lng: 102.8564 },
  { id: 'ubolrat',     name: 'อุบลรัตน์',     lat: 16.7954, lng: 102.6741 },
  { id: 'kranuan',     name: 'กระนวน',         lat: 16.7674, lng: 103.0826 },
  { id: 'banphai',     name: 'บ้านไผ่',        lat: 16.0598, lng: 102.7310 },
  { id: 'puainoi',     name: 'เปือยน้อย',      lat: 15.8929, lng: 102.8519 },
  { id: 'phon',        name: 'พล',             lat: 15.8196, lng: 102.6044 },
  { id: 'waengyai',    name: 'แวงใหญ่',        lat: 15.9597, lng: 102.5478 },
  { id: 'waengnoi',    name: 'แวงน้อย',        lat: 15.7979, lng: 102.4171 },
  { id: 'nongsongkhong', name: 'หนองสองห้อง', lat: 15.7687, lng: 102.7790 },
  { id: 'phuwiang',    name: 'ภูเวียง',        lat: 16.6726, lng: 102.4668 },
  { id: 'mancha',      name: 'มัญจาคีรี',     lat: 16.1295, lng: 102.5385 },
  { id: 'chonbot',     name: 'ชนบท',           lat: 16.0267, lng: 102.5368 },
  { id: 'khaosuan',    name: 'เขาสวนกวาง',    lat: 16.9369, lng: 102.7795 },
  { id: 'phuphaman',   name: 'ภูผาม่าน',       lat: 16.7315, lng: 101.8637 },
  { id: 'samsung',     name: 'ซำสูง',          lat: 16.5556, lng: 103.0502 },
  { id: 'khokpho',     name: 'โคกโพธิ์ไชย',   lat: 16.0694, lng: 102.3881 },
  { id: 'nongna',      name: 'หนองนาคำ',       lat: 16.8142, lng: 102.3216 },
  { id: 'banhaet',     name: 'บ้านแฮด',        lat: 16.2174, lng: 102.7585 },
  { id: 'nonsila',     name: 'โนนศิลา',        lat: 15.9785, lng: 102.6777 },
  { id: 'wiangkao',    name: 'เวียงเก่า',      lat: 16.7216, lng: 102.2907 },
];

/* ── Time slots ──────────────────────────────────────────────────────────── */
const TIME_SLOTS = [
  { id: 'morning', label: 'เช้า',      sub: '06:00', hour: 6  },
  { id: 'noon',    label: 'กลางวัน',   sub: '12:00', hour: 12 },
  { id: 'evening', label: 'เย็น',      sub: '18:00', hour: 18 },
  { id: 'now',     label: 'ปัจจุบัน',  sub: 'Live',  hour: null },
];

/* ── State ───────────────────────────────────────────────────────────────── */
let hmfData        = [];
let hmfMarkers     = [];
let hmfMap         = null;
let hmfActiveSlot  = 'now';
let hmfSelectedId  = null;

/* ── Temperature colour & label ─────────────────────────────────────────── */
function tempColor(t) {
  if (t < 28) return '#60a5fa';
  if (t < 31) return '#4ade80';
  if (t < 33) return '#facc15';
  if (t < 36) return '#fb923c';
  if (t < 39) return '#ef4444';
  return '#c026d3';
}
function tempLabel(t) {
  if (t < 28) return 'เย็น';
  if (t < 31) return 'ปกติ';
  if (t < 33) return 'อุ่น';
  if (t < 36) return 'ร้อน';
  if (t < 39) return 'ร้อนมาก';
  return 'ร้อนจัด';
}

/* ── Heat Index (Steadman regression, °C) ───────────────────────────────── */
function calcHI(T, RH) {
  return -8.78469475556
    + 1.61139411   * T
    + 2.33854883889 * RH
    - 0.14611605   * T  * RH
    - 0.012308094  * T  * T
    - 0.0164248277778 * RH * RH
    + 0.002211732  * T  * T  * RH
    + 0.00072546   * T  * RH * RH
    - 0.000003582  * T  * T  * RH * RH;
}
function hiRisk(hi) {
  if (hi < 27) return { label: 'ปกติ',       color: '#22c55e', bg: 'rgba(34,197,94,.15)'   };
  if (hi < 32) return { label: 'ระวัง',       color: '#facc15', bg: 'rgba(250,204,21,.15)'  };
  if (hi < 41) return { label: 'ระวังมาก',   color: '#fb923c', bg: 'rgba(251,146,60,.15)'  };
  if (hi < 54) return { label: 'อันตราย',     color: '#ef4444', bg: 'rgba(239,68,68,.15)'   };
  return              { label: 'อันตรายมาก', color: '#c026d3', bg: 'rgba(192,38,211,.15)'  };
}

/* ── Get active hour ────────────────────────────────────────────────────── */
function activeHour() {
  const slot = TIME_SLOTS.find(s => s.id === hmfActiveSlot);
  return slot?.hour ?? new Date().getHours();
}

/* ── Get a point's data at a given hour index ───────────────────────────── */
function dataAtHour(pd, hour) {
  const h = pd.hourly;
  if (!h) return null;
  const idx = h.time?.findIndex(t => +t.slice(11, 13) === hour) ?? -1;
  if (idx === -1) return null;
  return {
    temp:     h.temperature_2m?.[idx]         ?? null,
    feels:    h.apparent_temperature?.[idx]    ?? null,
    humidity: h.relative_humidity_2m?.[idx]    ?? null,
    uv:       h.uv_index?.[idx]               ?? null,
  };
}

/* ── Batch fetch from Open-Meteo ────────────────────────────────────────── */
async function fetchHeatData() {
  const lats = HMF_POINTS.map(p => p.lat).join(',');
  const lngs = HMF_POINTS.map(p => p.lng).join(',');
  const url  =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lats}&longitude=${lngs}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,uv_index` +
    `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,uv_index` +
    `&timezone=Asia%2FBangkok&forecast_days=1`;
  try {
    const res  = await fetch(url);
    const json = await res.json();
    const arr  = Array.isArray(json) ? json : [json];
    return HMF_POINTS.map((p, i) => ({
      ...p,
      current: arr[i]?.current ?? null,
      hourly:  arr[i]?.hourly  ?? null,
    }));
  } catch {
    return HMF_POINTS.map(p => ({ ...p, current: null, hourly: null }));
  }
}

/* ── 24-hour SVG mini chart ─────────────────────────────────────────────── */
function draw24h(hourly, highlightHour) {
  if (!hourly?.temperature_2m) return '<p style="color:#475569;font-size:11px;">ไม่มีข้อมูลรายชั่วโมง</p>';
  const raw  = hourly.temperature_2m.slice(0, 24);
  const minT = Math.floor(Math.min(...raw)) - 1;
  const maxT = Math.ceil(Math.max(...raw))  + 1;
  const W = 260, H = 72;
  const pl = 26, pr = 6, pt = 6, pb = 18;
  const iW = W - pl - pr, iH = H - pt - pb;
  const x  = i => pl + (i / 23) * iW;
  const y  = t => pt + iH - ((t - minT) / (maxT - minT)) * iH;
  const pts = raw.map((t, i) => `${x(i).toFixed(1)},${y(t).toFixed(1)}`).join(' L ');
  const hl  = Math.min(highlightHour, 23);
  const hlY = y(raw[hl] ?? raw[0]);

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible">
    <defs>
      <linearGradient id="hmf-cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ef4444" stop-opacity=".35"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="M ${x(0).toFixed(1)},${y(minT).toFixed(1)} L ${pts} L ${x(23).toFixed(1)},${y(minT).toFixed(1)} Z"
          fill="url(#hmf-cg)"/>
    <path d="M ${pts}" fill="none" stroke="#ef4444" stroke-width="1.6"
          stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="${x(hl).toFixed(1)}" y1="${pt}" x2="${x(hl).toFixed(1)}" y2="${H-pb}"
          stroke="#facc15" stroke-width="1.5" stroke-dasharray="3,2"/>
    <circle cx="${x(hl).toFixed(1)}" cy="${hlY.toFixed(1)}" r="3.5"
            fill="#facc15" stroke="#090D18" stroke-width="1.2"/>
    ${[0,6,12,18,23].map(h =>
      `<text x="${x(h).toFixed(1)}" y="${H-4}" text-anchor="middle"
             fill="#475569" font-size="8" font-family="sans-serif">${h}:00</text>`
    ).join('')}
    ${[minT, Math.round((minT+maxT)/2), maxT].map(t =>
      `<text x="${pl-3}" y="${(y(t)+3).toFixed(1)}" text-anchor="end"
             fill="#475569" font-size="8" font-family="sans-serif">${t}°</text>`
    ).join('')}
    <line x1="${pl}" y1="${pt}" x2="${pl}" y2="${H-pb}" stroke="#1e293b" stroke-width="1"/>
    <line x1="${pl}" y1="${H-pb}" x2="${W-pr}" y2="${H-pb}" stroke="#1e293b" stroke-width="1"/>
  </svg>`;
}

/* ── Sidebar: detail view for a selected point ──────────────────────────── */
function renderDetail(pd, hour) {
  const d = dataAtHour(pd, hour) ?? {
    temp:     pd.current?.temperature_2m         ?? null,
    feels:    pd.current?.apparent_temperature   ?? null,
    humidity: pd.current?.relative_humidity_2m   ?? null,
    uv:       pd.current?.uv_index               ?? null,
  };
  if (d.temp === null) return '<p style="color:#475569;font-size:12px;padding:12px 0;">ไม่มีข้อมูล</p>';

  const col  = tempColor(d.temp);
  const lbl  = tempLabel(d.temp);
  const hi   = calcHI(d.temp, d.humidity ?? 60);
  const risk = hiRisk(hi);

  return `
<div class="hmf-point-name">${pd.name}</div>

<div class="hmf-temp-row">
  <span class="hmf-temp-big" style="color:${col}">${d.temp.toFixed(1)}°C</span>
  <span class="hmf-temp-badge" style="background:${col}">${lbl}</span>
</div>

<div class="hmf-hi-card" style="background:${risk.bg};border-color:${risk.color}40">
  <div class="hmf-hi-label">ดัชนีความร้อน (Heat Index)</div>
  <div class="hmf-hi-row">
    <span class="hmf-hi-val" style="color:${risk.color}">${Math.round(hi)}°C</span>
    <span class="hmf-hi-risk" style="color:${risk.color}">${risk.label}</span>
  </div>
</div>

<div class="hmf-stats-grid">
  <div class="hmf-stat">
    <div class="hmf-stat-label">รู้สึกเหมือน</div>
    <div class="hmf-stat-val">${d.feels !== null ? d.feels.toFixed(1)+'°C' : '—'}</div>
  </div>
  <div class="hmf-stat">
    <div class="hmf-stat-label">ความชื้น</div>
    <div class="hmf-stat-val" style="color:#3b82f6">${d.humidity !== null ? Math.round(d.humidity)+'%' : '—'}</div>
  </div>
  <div class="hmf-stat">
    <div class="hmf-stat-label">UV Index</div>
    <div class="hmf-stat-val" style="color:#eab308">${d.uv !== null ? d.uv.toFixed(1) : '—'}</div>
  </div>
  <div class="hmf-stat">
    <div class="hmf-stat-label">ความเสี่ยง</div>
    <div class="hmf-stat-val" style="color:${risk.color}">${risk.label}</div>
  </div>
</div>

<div class="hmf-chart-box">
  <div class="hmf-chart-title">อุณหภูมิรายชั่วโมงวันนี้</div>
  ${draw24h(pd.hourly, hour)}
</div>`;
}

/* ── Sidebar: default (no selection) ────────────────────────────────────── */
function renderDefault() {
  const hour    = activeHour();
  let hot = null, hotT = -Infinity;
  hmfData.forEach(pd => {
    const d = dataAtHour(pd, hour);
    const t = d?.temp ?? pd.current?.temperature_2m;
    if (t !== null && t !== undefined && t > hotT) { hotT = t; hot = pd; }
  });
  return `
<div style="text-align:center;padding:16px 0 8px;color:rgba(255,255,255,.4);font-size:12px;line-height:1.7;">
  <div style="font-size:28px;margin-bottom:6px;">🌡</div>
  คลิกที่จุดบนแผนที่<br>เพื่อดูข้อมูลละเอียด
  ${hot ? `<div class="hmf-hottest-badge">
    🔴 ร้อนสุด: <strong>${hot.name}</strong> ${Math.round(hotT)}°C
  </div>` : ''}
</div>`;
}

/* ── Update all bubble colours for the active hour ──────────────────────── */
function refreshBubbles() {
  const hour = activeHour();
  hmfMarkers.forEach(({ pd, bubble }) => {
    const d = dataAtHour(pd, hour) ?? { temp: pd.current?.temperature_2m };
    if (d?.temp === null) return;
    const col = tempColor(d.temp);
    bubble.style.background = col;
    bubble.children[0].textContent = `${Math.round(d.temp)}°`;
  });
}

/* ── Update sidebar ──────────────────────────────────────────────────────── */
function updateSidebar() {
  const panel = document.getElementById('hmf-panel');
  if (!panel) return;
  if (hmfSelectedId) {
    const pd = hmfData.find(p => p.id === hmfSelectedId);
    panel.innerHTML = pd ? renderDetail(pd, activeHour()) : renderDefault();
  } else {
    panel.innerHTML = renderDefault();
  }
}

/* ── Legend ──────────────────────────────────────────────────────────────── */
function injectLegend() {
  const wrap = document.getElementById('hmf-map-el');
  if (!wrap || document.getElementById('hmf-legend')) return;
  const steps = [
    ['< 28°C','เย็น','#60a5fa'],['28–31°','ปกติ','#4ade80'],['31–33°','อุ่น','#facc15'],
    ['33–36°','ร้อน','#fb923c'],['36–39°','ร้อนมาก','#ef4444'],['≥ 39°C','ร้อนจัด','#c026d3'],
  ];
  const el = document.createElement('div');
  el.id = 'hmf-legend';
  el.innerHTML =
    '<div style="font-weight:700;margin-bottom:7px;color:#fff;font-size:14px;">อุณหภูมิ (°C)</div>' +
    steps.map(([d,l,c]) =>
      `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">` +
      `<span style="width:14px;height:14px;border-radius:50%;background:${c};flex-shrink:0"></span>` +
      `<span>${d} ${l}</span></div>`
    ).join('');
  wrap.appendChild(el);
}

/* ── Main init ───────────────────────────────────────────────────────────── */
function initHeatMapFull() {
  if (typeof maplibregl === 'undefined') return;
  const cfg = window.HSKK_CONFIG;
  if (!cfg) return;

  const { loc, layers } = cfg;
  const LAYER_ORDER = ['osm','esriRelief','esriSatellite'];
  const sources = {}, mapLayers = [];

  LAYER_ORDER.forEach(id => {
    const def = layers[id];
    if (!def || def.sourceType !== 'raster') return;
    sources[id] = { type:'raster', tiles: def.tiles, tileSize: def.tileSize||256,
                    maxzoom: def.maxzoom||18, attribution: def.attribution||'' };
    mapLayers.push({ id, type:'raster', source:id,
                     layout:{ visibility: id==='esriSatellite'?'visible':'none' } });
  });
  if (layers.esriReference) {
    sources['esriReference'] = { type:'raster', tiles: layers.esriReference.tiles,
      tileSize:256, maxzoom:19, attribution: layers.esriReference.attribution||'' };
    mapLayers.push({ id:'esriReference', type:'raster', source:'esriReference',
                     layout:{ visibility:'visible' } });
  }

  hmfMap = new maplibregl.Map({
    container: 'hmf-map-el',
    style: { version:8, glyphs: cfg.glyphsUrl||'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
             sources, layers: mapLayers },
    center: [loc.lng, loc.lat], zoom: loc.zoom,
    maxZoom:18, minZoom:5, attributionControl:{ compact:true },
  });
  hmfMap.addControl(new maplibregl.NavigationControl({ visualizePitch:false }), 'top-right');

  /* Layer switcher */
  $$('[data-heat-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.heatLayer;
      LAYER_ORDER.forEach(id => {
        if (hmfMap.getLayer(id))
          hmfMap.setLayoutProperty(id,'visibility', id===target?'visible':'none');
      });
      if (hmfMap.getLayer('esriReference'))
        hmfMap.setLayoutProperty('esriReference','visibility', target==='esriSatellite'?'visible':'none');
      $$('[data-heat-layer]').forEach(b => {
        b.classList.toggle('active', b===btn);
        b.setAttribute('aria-pressed', String(b===btn));
      });
    });
  });

  /* Time selector */
  $$('[data-time-slot]').forEach(btn => {
    btn.addEventListener('click', () => {
      hmfActiveSlot = btn.dataset.timeSlot;
      $$('[data-time-slot]').forEach(b => {
        b.classList.toggle('active', b===btn);
        b.setAttribute('aria-pressed', String(b===btn));
      });
      refreshBubbles();
      updateSidebar();
    });
  });

  /* Load data + add markers */
  if (hmfMap.loaded()) { loadAndRender(); }
  else { hmfMap.once('load', loadAndRender); }

  async function loadAndRender() {
    injectLegend();
    hmfData = await fetchHeatData();

    const hour = activeHour();
    hmfData.forEach(pd => {
      const d = dataAtHour(pd, hour) ?? { temp: pd.current?.temperature_2m };
      if (!d || d.temp === null) return;

      const col = tempColor(d.temp);

      /* el = transparent container that MapLibre applies its position transform to.
         Never apply transform here — it would overwrite MapLibre's translate and
         cause the marker to jump to the upper-left corner of the canvas. */
      const el = document.createElement('div');
      el.className = 'hmf-bubble';
      el.style.cssText = `width:68px;height:68px;cursor:pointer;`;

      /* bubble = inner visual circle. Scale animations go here instead. */
      const bubble = document.createElement('div');
      bubble.style.cssText =
        `background:${col};border:3px solid rgba(255,255,255,.9);border-radius:50%;` +
        `width:100%;height:100%;display:flex;flex-direction:column;` +
        `align-items:center;justify-content:center;` +
        `box-shadow:0 4px 14px rgba(0,0,0,.6);transition:transform .15s,box-shadow .15s;` +
        `font-weight:800;color:#fff;line-height:1.15;font-family:sans-serif;font-size:18px;`;
      bubble.innerHTML =
        `<span>${Math.round(d.temp)}°</span>` +
        `<span style="font-size:11px;font-weight:600;opacity:.9">${pd.name.length>5?pd.name.slice(0,5)+'…':pd.name}</span>`;
      el.appendChild(bubble);

      el.addEventListener('mouseenter', () => {
        bubble.style.transform = 'scale(1.12)';
        bubble.style.boxShadow = '0 6px 18px rgba(0,0,0,.65)';
      });
      el.addEventListener('mouseleave', () => {
        if (hmfSelectedId !== pd.id) {
          bubble.style.transform = '';
          bubble.style.boxShadow = '';
        }
      });
      el.addEventListener('click', e => {
        e.stopPropagation();
        hmfMarkers.forEach(m => {
          if (m.pd.id !== pd.id) {
            m.bubble.style.transform = '';
            m.bubble.style.boxShadow = '';
            m.bubble.style.border = '3px solid rgba(255,255,255,.9)';
          }
        });
        hmfSelectedId = pd.id;
        bubble.style.transform = 'scale(1.12)';
        bubble.style.border = '3.5px solid #fff';
        updateSidebar();
      });

      new maplibregl.Marker({ element: el, anchor:'center' })
        .setLngLat([pd.lng, pd.lat])
        .addTo(hmfMap);

      hmfMarkers.push({ pd, el, bubble });
    });

    updateSidebar();
  }
}
