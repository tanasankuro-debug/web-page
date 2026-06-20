/* ==========================================================================
   Heat Layer — js/heat-layer.js
   Overlay layer for map.html (realtime map).
   Depends on: maplibre-gl (global), window.HSKK_MAP (realtime-map.js)
   Exposes:    window.HeatLayer
   ========================================================================== */
'use strict';

/* ── 26 Khon Kaen districts ─────────────────────────────────────────────── */
const HL_POINTS = [
  { id: 'mueang',        name: 'เมืองขอนแก่น', lat: 16.4304, lng: 102.8356 },
  { id: 'banfang',       name: 'บ้านฝาง',       lat: 16.4533, lng: 102.6384 },
  { id: 'phrayuen',      name: 'พระยืน',         lat: 16.3100, lng: 102.6789 },
  { id: 'nongruea',      name: 'หนองเรือ',       lat: 16.4909, lng: 102.4288 },
  { id: 'chumpae',       name: 'ชุมแพ',          lat: 16.6578, lng: 102.0165 },
  { id: 'sichomphu',     name: 'สีชมพู',         lat: 16.7578, lng: 102.1261 },
  { id: 'nampong',       name: 'น้ำพอง',         lat: 16.7019, lng: 102.8564 },
  { id: 'ubolrat',       name: 'อุบลรัตน์',     lat: 16.7954, lng: 102.6741 },
  { id: 'kranuan',       name: 'กระนวน',         lat: 16.7674, lng: 103.0826 },
  { id: 'banphai',       name: 'บ้านไผ่',        lat: 16.0598, lng: 102.7310 },
  { id: 'puainoi',       name: 'เปือยน้อย',      lat: 15.8929, lng: 102.8519 },
  { id: 'phon',          name: 'พล',             lat: 15.8196, lng: 102.6044 },
  { id: 'waengyai',      name: 'แวงใหญ่',        lat: 15.9597, lng: 102.5478 },
  { id: 'waengnoi',      name: 'แวงน้อย',        lat: 15.7979, lng: 102.4171 },
  { id: 'nongsongkhong', name: 'หนองสองห้อง',   lat: 15.7687, lng: 102.7790 },
  { id: 'phuwiang',      name: 'ภูเวียง',        lat: 16.6726, lng: 102.4668 },
  { id: 'mancha',        name: 'มัญจาคีรี',     lat: 16.1295, lng: 102.5385 },
  { id: 'chonbot',       name: 'ชนบท',           lat: 16.0267, lng: 102.5368 },
  { id: 'khaosuan',      name: 'เขาสวนกวาง',    lat: 16.9369, lng: 102.7795 },
  { id: 'phuphaman',     name: 'ภูผาม่าน',       lat: 16.7315, lng: 101.8637 },
  { id: 'samsung',       name: 'ซำสูง',          lat: 16.5556, lng: 103.0502 },
  { id: 'khokpho',       name: 'โคกโพธิ์ไชย',   lat: 16.0694, lng: 102.3881 },
  { id: 'nongna',        name: 'หนองนาคำ',       lat: 16.8142, lng: 102.3216 },
  { id: 'banhaet',       name: 'บ้านแฮด',        lat: 16.2174, lng: 102.7585 },
  { id: 'nonsila',       name: 'โนนศิลา',        lat: 15.9785, lng: 102.6777 },
  { id: 'wiangkao',      name: 'เวียงเก่า',      lat: 16.7216, lng: 102.2907 },
];

/* ── Colour / label helpers ─────────────────────────────────────────────── */
function hlTempColor(t) {
  if (t < 28) return '#60a5fa';
  if (t < 31) return '#4ade80';
  if (t < 33) return '#facc15';
  if (t < 36) return '#fb923c';
  if (t < 39) return '#ef4444';
  return '#c026d3';
}
function hlTempLabel(t) {
  if (t < 28) return 'เย็น';
  if (t < 31) return 'ปกติ';
  if (t < 33) return 'อุ่น';
  if (t < 36) return 'ร้อน';
  if (t < 39) return 'ร้อนมาก';
  return 'ร้อนจัด';
}

/* ── Heat Index (Steadman regression, °C) ───────────────────────────────── */
function hlCalcHI(T, RH) {
  return -8.78469475556
    + 1.61139411    * T
    + 2.33854883889 * RH
    - 0.14611605    * T  * RH
    - 0.012308094   * T  * T
    - 0.0164248277778 * RH * RH
    + 0.002211732   * T  * T  * RH
    + 0.00072546    * T  * RH * RH
    - 0.000003582   * T  * T  * RH * RH;
}

function hlHiRisk(hi) {
  if (hi < 27) return { label: 'ปกติ',       color: '#22c55e', bg: 'rgba(34,197,94,.15)'   };
  if (hi < 32) return { label: 'ระวัง',       color: '#facc15', bg: 'rgba(250,204,21,.15)'  };
  if (hi < 41) return { label: 'ระวังมาก',   color: '#fb923c', bg: 'rgba(251,146,60,.15)'  };
  if (hi < 54) return { label: 'อันตราย',     color: '#ef4444', bg: 'rgba(239,68,68,.15)'   };
  return              { label: 'อันตรายมาก', color: '#c026d3', bg: 'rgba(192,38,211,.15)'  };
}

function hlUvLabel(uv) {
  if (uv < 3)  return { t: 'ต่ำ',     c: '#22d3ee' };
  if (uv < 6)  return { t: 'ปานกลาง', c: '#facc15' };
  if (uv < 8)  return { t: 'สูง',     c: '#fb923c' };
  if (uv < 11) return { t: 'สูงมาก',  c: '#ef4444' };
  return               { t: 'อันตราย', c: '#a855f7' };
}

/* ── Data extraction ────────────────────────────────────────────────────── */
function hlDataAtHour(pd, hour) {
  const h = pd.hourly;
  if (!h) return null;
  const idx = h.time?.findIndex(t => +t.slice(11, 13) === hour) ?? -1;
  if (idx === -1) return null;
  return {
    temp:     h.temperature_2m?.[idx]      ?? null,
    feels:    h.apparent_temperature?.[idx] ?? null,
    humidity: h.relative_humidity_2m?.[idx] ?? null,
    uv:       h.uv_index?.[idx]            ?? null,
  };
}

/* ── API fetch ──────────────────────────────────────────────────────────── */
async function hlFetchData() {
  const lats = HL_POINTS.map(p => p.lat).join(',');
  const lngs = HL_POINTS.map(p => p.lng).join(',');
  const url  =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lats}&longitude=${lngs}` +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,uv_index' +
    '&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,uv_index' +
    '&timezone=Asia%2FBangkok&forecast_days=1';
  try {
    const res  = await fetch(url);
    const json = await res.json();
    const arr  = Array.isArray(json) ? json : [json];
    return HL_POINTS.map((p, i) => ({
      ...p,
      current: arr[i]?.current ?? null,
      hourly:  arr[i]?.hourly  ?? null,
    }));
  } catch {
    return HL_POINTS.map(p => ({ ...p, current: null, hourly: null }));
  }
}

/* ── 24-hour SVG mini-chart ─────────────────────────────────────────────── */
function hlDraw24h(hourly, hour) {
  if (!hourly?.temperature_2m) {
    return '<p style="color:#475569;font-size:11px;padding:4px 0;">ไม่มีข้อมูลรายชั่วโมง</p>';
  }
  const raw  = hourly.temperature_2m.slice(0, 24);
  const minT = Math.floor(Math.min(...raw)) - 1;
  const maxT = Math.ceil(Math.max(...raw))  + 1;
  const W = 258, H = 70;
  const pl = 24, pr = 6, pt = 5, pb = 17;
  const iW = W - pl - pr, iH = H - pt - pb;
  const cx = i => pl + (i / 23) * iW;
  const cy = t => pt + iH - ((t - minT) / (maxT - minT)) * iH;
  const pts = raw.map((t, i) => `${cx(i).toFixed(1)},${cy(t).toFixed(1)}`).join(' L ');
  const hl  = Math.min(hour, 23);
  const hlY = cy(raw[hl] ?? raw[0]);

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible">
    <defs><linearGradient id="hl-cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ef4444" stop-opacity=".35"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="M ${cx(0).toFixed(1)},${cy(minT).toFixed(1)} L ${pts} L ${cx(23).toFixed(1)},${cy(minT).toFixed(1)} Z"
          fill="url(#hl-cg)"/>
    <path d="M ${pts}" fill="none" stroke="#ef4444" stroke-width="1.6"
          stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="${cx(hl).toFixed(1)}" y1="${pt}" x2="${cx(hl).toFixed(1)}" y2="${H - pb}"
          stroke="#facc15" stroke-width="1.5" stroke-dasharray="3,2"/>
    <circle cx="${cx(hl).toFixed(1)}" cy="${hlY.toFixed(1)}" r="3.5"
            fill="#facc15" stroke="#090D18" stroke-width="1.2"/>
    ${[0, 6, 12, 18, 23].map(h =>
      `<text x="${cx(h).toFixed(1)}" y="${H - 3}" text-anchor="middle"
             fill="#475569" font-size="8" font-family="sans-serif">${h}:00</text>`
    ).join('')}
    ${[minT, Math.round((minT + maxT) / 2), maxT].map(t =>
      `<text x="${pl - 3}" y="${(cy(t) + 3).toFixed(1)}" text-anchor="end"
             fill="#475569" font-size="8" font-family="sans-serif">${t}°</text>`
    ).join('')}
    <line x1="${pl}" y1="${pt}" x2="${pl}" y2="${H - pb}" stroke="#1e293b" stroke-width="1"/>
    <line x1="${pl}" y1="${H - pb}" x2="${W - pr}" y2="${H - pb}" stroke="#1e293b" stroke-width="1"/>
  </svg>`;
}

/* ── Panel HTML builders ────────────────────────────────────────────────── */
function hlDetailBody(pd, hour) {
  const d = hlDataAtHour(pd, hour) ?? {
    temp:     pd.current?.temperature_2m         ?? null,
    feels:    pd.current?.apparent_temperature   ?? null,
    humidity: pd.current?.relative_humidity_2m   ?? null,
    uv:       pd.current?.uv_index               ?? null,
  };
  if (d.temp === null) return '<p style="color:#475569;font-size:12px;padding:8px 0">ไม่มีข้อมูล</p>';

  const col  = hlTempColor(d.temp);
  const lbl  = hlTempLabel(d.temp);
  const hi   = hlCalcHI(d.temp, d.humidity ?? 60);
  const risk = hlHiRisk(hi);
  const uvM  = d.uv != null ? hlUvLabel(d.uv) : null;

  return `
<div id="wx-row" style="margin-bottom:10px;">
  <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${col};
    box-shadow:0 0 5px ${col}99;margin-right:7px;vertical-align:middle;flex-shrink:0;"></span>
  <span id="wx-label">${lbl} · ${d.temp.toFixed(1)}°C</span>
</div>

<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px;">
  <span style="font-size:2.05rem;font-weight:800;color:${col};font-family:'Barlow Condensed',sans-serif;line-height:1;">${d.temp.toFixed(1)}°C</span>
  <span style="font-size:0.78rem;font-weight:700;color:#fff;padding:3px 10px;border-radius:99px;background:${col};">${lbl}</span>
</div>

<div style="border:1px solid ${risk.color}44;border-radius:9px;padding:9px 11px;background:${risk.bg};margin-bottom:10px;">
  <div class="dc-label" style="margin-bottom:4px;">ดัชนีความร้อน (Heat Index)</div>
  <div style="display:flex;align-items:baseline;gap:8px;">
    <span style="font-size:1.42rem;font-weight:700;color:${risk.color};font-family:'Barlow Condensed',sans-serif;line-height:1;">${Math.round(hi)}°C</span>
    <span style="font-size:0.84rem;font-weight:700;color:${risk.color};">${risk.label}</span>
  </div>
</div>

<div class="data-grid" style="margin-bottom:10px;">
  <div class="data-card">
    <div class="dc-label">รู้สึกเหมือน</div>
    <div class="dc-value">${d.feels !== null ? d.feels.toFixed(1) : '—'}<span class="dc-unit">°C</span></div>
  </div>
  <div class="data-card">
    <div class="dc-label">ความชื้น</div>
    <div class="dc-value" style="color:#60a5fa;">${d.humidity !== null ? Math.round(d.humidity) : '—'}<span class="dc-unit">%</span></div>
  </div>
  <div class="data-card">
    <div class="dc-label">UV Index</div>
    <div class="dc-value" style="color:#eab308;">${d.uv !== null ? d.uv.toFixed(1) : '—'}</div>
    ${uvM ? `<div class="dc-sub" style="color:${uvM.c};">${uvM.t}</div>` : ''}
  </div>
  <div class="data-card">
    <div class="dc-label">ความเสี่ยง</div>
    <div class="dc-value" style="color:${risk.color};font-size:0.9rem;">${risk.label}</div>
  </div>
</div>

<div class="data-card">
  <div class="dc-label" style="margin-bottom:7px;">อุณหภูมิรายชั่วโมงวันนี้</div>
  ${hlDraw24h(pd.hourly, hour)}
</div>`;
}

function hlDefaultBody(data, hour) {
  let hot = null, hotT = -Infinity;
  data.forEach(pd => {
    const d = hlDataAtHour(pd, hour);
    const t = d?.temp ?? pd.current?.temperature_2m;
    if (t != null && t > hotT) { hotT = t; hot = pd; }
  });
  return `
<div style="text-align:center;padding:12px 0 6px;">
  <p style="color:rgba(255,255,255,.38);font-size:0.82rem;line-height:1.8;margin-bottom:10px;">
    แตะจุดบนแผนที่<br>เพื่อดูข้อมูลละเอียด
  </p>
  ${hot ? `<div style="padding:9px 12px;background:rgba(239,68,68,.1);
    border:1px solid rgba(239,68,68,.22);border-radius:8px;
    color:#fca5a5;font-size:0.80rem;line-height:1.5;text-align:left;">
    🔴 ร้อนสุด: <strong>${hot.name}</strong> — ${Math.round(hotT)}°C
  </div>` : ''}
</div>`;
}

function hlBuildPanelHTML(pd, hour, data) {
  const now     = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const mainTxt = pd ? pd.name : 'เลเยอร์ความร้อน';
  const subTxt  = pd ? `จ.ขอนแก่น` : '26 จุดตรวจวัด · ขอนแก่น';
  const body    = pd ? hlDetailBody(pd, hour) : hlDefaultBody(data, hour);

  return `
    <div id="panel-drag-handle"></div>
    <div id="panel-topbar">
      <div id="loc-body">
        <div id="loc-pin-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true">
            <path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0z"/>
          </svg>
          <span style="font-size:0.62rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#fb923c;">ความร้อน</span>
        </div>
        <div id="loc-main">${mainTxt}</div>
        <div id="loc-sub">${subTxt}</div>
        ${pd ? `<div id="loc-coords">${pd.lat.toFixed(4)}°N &nbsp;${pd.lng.toFixed(4)}°E</div>` : ''}
      </div>
      <button id="panel-close" aria-label="ปิด">✕</button>
    </div>
    <div id="panel-scroll">
      <div class="p-section">${body}</div>
      <div id="panel-footer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" width="10" height="10">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        ${now} &nbsp;·&nbsp; Open-Meteo
      </div>
    </div>`;
}

/* ── HeatLayer module ───────────────────────────────────────────────────── */
const HeatLayer = (() => {
  const TIME_SLOTS = [
    { id: 'morning', label: 'เช้า',     sub: '06:00', hour: 6    },
    { id: 'noon',    label: 'กลางวัน', sub: '12:00', hour: 12   },
    { id: 'evening', label: 'เย็น',     sub: '18:00', hour: 18   },
    { id: 'now',     label: 'ตอนนี้',   sub: 'Live',  hour: null },
  ];

  let _data       = [];
  let _markers    = [];
  let _activeSlot = 'now';
  let _selectedId = null;
  let _enabled    = false;

  function _activeHour() {
    const slot = TIME_SLOTS.find(s => s.id === _activeSlot);
    return slot?.hour ?? new Date().getHours();
  }

  function _refreshBubbles() {
    const hour = _activeHour();
    _markers.forEach(({ pd, bubble }) => {
      const d = hlDataAtHour(pd, hour) ?? { temp: pd.current?.temperature_2m };
      if (d?.temp == null) return;
      const col = hlTempColor(d.temp);
      bubble.style.background = col;
      bubble.querySelector('.hl-temp').textContent = `${Math.round(d.temp)}°`;
    });
  }

  function _clearSelection() {
    _selectedId = null;
    _markers.forEach(({ bubble }) => {
      bubble.style.outline   = '';
      bubble.style.transform = '';
    });
  }

  function _openPanel(pd) {
    const panel = document.getElementById('info-panel');
    if (!panel) return;
    panel.innerHTML = hlBuildPanelHTML(pd, _activeHour(), _data);
    panel.classList.add('open');
    document.getElementById('panel-close')?.addEventListener('click', () => {
      panel.classList.remove('open');
      _clearSelection();
    });
  }

  function _showDetail(pd) {
    _selectedId = pd.id;
    _markers.forEach(m => {
      const selected = m.pd.id === pd.id;
      m.bubble.style.outline   = selected ? '3px solid rgba(255,255,255,.95)' : '';
      m.bubble.style.transform = selected ? 'scale(1.1)' : '';
    });
    _openPanel(pd);
    // On mobile the panel slides up from bottom — user must scroll to see it
    if (window.innerWidth <= 700) {
      document.getElementById('info-panel')?.classList.add('open');
    }
  }

  function _placeMarkers() {
    const map  = window.HSKK_MAP;
    const hour = _activeHour();

    _data.forEach(pd => {
      const d = hlDataAtHour(pd, hour) ?? { temp: pd.current?.temperature_2m };
      if (d?.temp == null) return;

      const col       = hlTempColor(d.temp);
      const shortName = pd.name.length > 5 ? pd.name.slice(0, 5) + '…' : pd.name;

      /* Outer wrapper — sets hit-test size */
      const el = document.createElement('div');
      el.style.cssText = 'width:60px;height:60px;cursor:pointer;';

      /* Visible bubble */
      const bubble = document.createElement('div');
      bubble.style.cssText = [
        `background:${col}`,
        'border-radius:50%',
        'width:100%;height:100%',
        'display:flex;flex-direction:column;align-items:center;justify-content:center',
        'border:3px solid rgba(255,255,255,.88)',
        'box-shadow:0 3px 12px rgba(0,0,0,.6)',
        'transition:transform .15s,box-shadow .15s,outline .15s',
        'font-weight:800;color:#fff;line-height:1.2',
        "font-family:'Barlow Condensed',sans-serif;font-size:16px",
        'cursor:pointer;touch-action:manipulation',
        '-webkit-tap-highlight-color:transparent',
      ].join(';');

      const tempSpan = document.createElement('span');
      tempSpan.className   = 'hl-temp';
      tempSpan.textContent = `${Math.round(d.temp)}°`;

      const nameSpan = document.createElement('span');
      nameSpan.style.cssText = 'font-size:9.5px;font-weight:600;opacity:.88;font-family:"Noto Sans Thai",sans-serif;';
      nameSpan.textContent   = shortName;

      bubble.append(tempSpan, nameSpan);
      el.appendChild(bubble);

      el.addEventListener('mouseenter', () => {
        if (_selectedId !== pd.id) bubble.style.transform = 'scale(1.1)';
        bubble.style.boxShadow = '0 5px 18px rgba(0,0,0,.65)';
      });
      el.addEventListener('mouseleave', () => {
        if (_selectedId !== pd.id) { bubble.style.transform = ''; bubble.style.boxShadow = ''; }
      });
      el.addEventListener('click', e => {
        e.stopPropagation(); // prevent map-explore-plugin from also firing
        _showDetail(pd);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([pd.lng, pd.lat])
        .addTo(map);

      _markers.push({ pd, el, bubble, marker });
    });
  }

  function _injectLegend() {
    let legend = document.getElementById('hl-legend');
    if (legend) { legend.style.display = ''; return; }

    const steps = [
      ['< 28°',  'เย็น',     '#60a5fa'],
      ['28–31°', 'ปกติ',    '#4ade80'],
      ['31–33°', 'อุ่น',     '#facc15'],
      ['33–36°', 'ร้อน',    '#fb923c'],
      ['36–39°', 'ร้อนมาก', '#ef4444'],
      ['≥ 39°',  'ร้อนจัด', '#c026d3'],
    ];

    legend = document.createElement('div');
    legend.id = 'hl-legend';
    legend.innerHTML = `
      <div class="hl-legend-hd">
        <span>อุณหภูมิ (°C)</span>
        <button class="hl-legend-toggle" id="hl-legend-toggle"
                aria-expanded="true" aria-label="ซ่อน/แสดงคำอธิบาย">
          <svg viewBox="0 0 10 6" width="8" height="8" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round"><path d="M1 1l4 4 4-4"/></svg>
        </button>
      </div>
      <div id="hl-legend-body">
        ${steps.map(([r, l, c]) =>
          `<div class="hl-legend-row">
             <span class="hl-legend-swatch" style="background:${c}"></span>
             <span>${r} ${l}</span>
           </div>`
        ).join('')}
      </div>`;

    document.querySelector('.map-canvas').appendChild(legend);

    document.getElementById('hl-legend-toggle')?.addEventListener('click', () => {
      const body = document.getElementById('hl-legend-body');
      const btn  = document.getElementById('hl-legend-toggle');
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      btn.setAttribute('aria-expanded', String(!open));
      btn.classList.toggle('collapsed', open);
    });
  }

  function _removeLegend() {
    const el = document.getElementById('hl-legend');
    if (el) el.style.display = 'none';
  }

  /* ── Public API ── */
  return {
    get enabled()    { return _enabled; },
    get timeSlots()  { return TIME_SLOTS; },
    get activeSlot() { return _activeSlot; },

    async enable() {
      if (_enabled) return;
      _enabled = true;
      if (!window.HSKK_MAP) { _enabled = false; return; }

      if (window.LayerRegistry) window.LayerRegistry.setLayerLoading('heat', true);
      _data = await hlFetchData();
      if (window.LayerRegistry) window.LayerRegistry.setLayerLoading('heat', false);

      if (!_enabled) return; // user toggled off while loading

      _placeMarkers();
      _injectLegend();

      // Show default panel on desktop; on mobile user can tap a bubble
      if (window.innerWidth > 700) {
        _openPanel(null);
      }
    },

    disable() {
      if (!_enabled) return;
      _enabled    = false;
      _selectedId = null;
      _markers.forEach(m => m.marker.remove());
      _markers = [];
      _removeLegend();

      // Close panel only if it currently shows heat data
      const panel  = document.getElementById('info-panel');
      const pinTxt = panel?.querySelector('#loc-pin-icon span');
      if (pinTxt?.textContent?.includes('ความร้อน')) {
        panel.classList.remove('open');
      }
    },

    setTimeSlot(id) {
      _activeSlot = id;
      _refreshBubbles();
      // Refresh panel if a bubble is selected
      if (_selectedId) {
        const pd = _data.find(p => p.id === _selectedId);
        if (pd) {
          const panel = document.getElementById('info-panel');
          if (panel?.classList.contains('open')) {
            panel.innerHTML = hlBuildPanelHTML(pd, _activeHour(), _data);
            document.getElementById('panel-close')?.addEventListener('click', () => {
              panel.classList.remove('open');
              _clearSelection();
            });
          }
        }
      }
    },
  };
})();

window.HeatLayer = HeatLayer;
