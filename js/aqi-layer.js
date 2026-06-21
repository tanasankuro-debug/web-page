/* ==========================================================================
   AQI Layer — js/aqi-layer.js
   Overlay layer for map.html (realtime map).
   Data: Air4Thai PCD API → fallback Open-Meteo Air Quality
   Depends on: maplibre-gl (global), window.HSKK_MAP (realtime-map.js)
   Exposes:    window.AQILayer
   ========================================================================== */
'use strict';

/* ── AQI scale ────────────────────────────────────────────────────────────── */
const AQL_SCALE = [
  { min: 0,   max: 50,   color: '#22C55E', range: '0–50',    label: 'ดี' },
  { min: 51,  max: 100,  color: '#A3E635', range: '51–100',  label: 'ปานกลาง' },
  { min: 101, max: 150,  color: '#FACC15', range: '101–150', label: 'ไม่ดีกลุ่มเสี่ยง' },
  { min: 151, max: 200,  color: '#FB923C', range: '151–200', label: 'ไม่ดี' },
  { min: 201, max: 300,  color: '#EF4444', range: '201–300', label: 'แย่มาก' },
  { min: 301, max: 9999, color: '#7C3AED', range: '301+',    label: 'อันตราย' },
];

function aqlColor(aqi) {
  if (aqi == null || isNaN(+aqi)) return '#94a3b8';
  const row = AQL_SCALE.find(r => +aqi >= r.min && +aqi <= r.max);
  return row ? row.color : '#94a3b8';
}

function aqlLabel(aqi) {
  if (aqi == null || isNaN(+aqi)) return 'ไม่มีข้อมูล';
  const row = AQL_SCALE.find(r => +aqi >= r.min && +aqi <= r.max);
  return row ? row.label : 'ไม่มีข้อมูล';
}

function aqlPm25ToAQI(pm) {
  if (pm == null || isNaN(+pm)) return null;
  const p = Math.round(+pm * 10) / 10;
  const bp = [
    [0,    12.0,  0,   50 ],
    [12.1, 35.4,  51,  100],
    [35.5, 55.4,  101, 150],
    [55.5, 150.4, 151, 200],
    [150.5,250.4, 201, 300],
    [250.5,350.4, 301, 400],
    [350.5,500.4, 401, 500],
  ];
  for (const [cL, cH, iL, iH] of bp)
    if (p >= cL && p <= cH)
      return Math.round((iH - iL) / (cH - cL) * (p - cL) + iL);
  return p > 500 ? 500 : null;
}

/* ── Data sources ─────────────────────────────────────────────────────────── */
async function aqlFetchAir4Thai() {
  const res = await fetch('https://air4thai.pcd.go.th/services/getLastVal_V2.php',
    { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const list = (data.stations || []).filter(s =>
    (s.areaTH || '').includes('ขอนแก่น') ||
    (s.areaEN || '').toLowerCase().includes('khon kaen') ||
    (s.provinceTH || '').includes('ขอนแก่น')
  );
  if (!list.length) throw new Error('no KK stations');
  return {
    source: 'Air4Thai · กรมควบคุมมลพิษ',
    stations: list.filter(s => s.lat && s.long).map(s => {
      const rawAqi  = s.AQI?.aqi;
      const rawPm25 = s.PM25?.value;
      const rawPm10 = s.PM10?.value;
      const pm25 = rawPm25 != null && rawPm25 !== '' && !isNaN(+rawPm25) ? +rawPm25 : null;
      const pm10 = rawPm10 != null && rawPm10 !== '' && !isNaN(+rawPm10) ? +rawPm10 : null;
      const aqi  = rawAqi != null && rawAqi !== '' && !isNaN(+rawAqi) && +rawAqi > 0
                 ? +rawAqi : aqlPm25ToAQI(pm25);
      return {
        name:    s.nameTH || s.nameEN || s.stationID,
        area:    s.areaTH || '',
        lat:     +s.lat,
        lng:     +s.long,
        aqi, pm25, pm10,
        updated: s.LastUpdate || '',
        source:  'Air4Thai · กรมควบคุมมลพิษ',
      };
    }),
  };
}

async function aqlFetchOpenMeteo() {
  const url = window.HSKK_CONFIG?.airQualityUrl;
  if (!url) throw new Error('no config');
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const pm25 = data.current?.pm2_5 ?? null;
  const aqi  = data.current?.us_aqi ?? aqlPm25ToAQI(pm25);
  return {
    source: 'Open-Meteo Air Quality',
    stations: [{
      name: 'ขอนแก่น', area: '', lat: 16.44, lng: 102.82,
      aqi, pm25, pm10: null, updated: 'เรียลไทม์',
      source: 'Open-Meteo Air Quality',
    }],
  };
}

/* ── Gauge SVG pin ────────────────────────────────────────────────────────── */
function aqlGaugePin(aqiVal, color) {
  const aqi      = aqiVal != null ? Math.min(+aqiVal, 300) : 0;
  const sweepDeg = 270 * (aqi / 300);
  const R = 19, CX = 24, CY = 24;
  const toRad  = d => d * Math.PI / 180;
  const startD = 135;
  const sx = (CX + R * Math.cos(toRad(startD))).toFixed(1);
  const sy = (CY + R * Math.sin(toRad(startD))).toFixed(1);
  const tx = (CX + R * Math.cos(toRad(startD + 270))).toFixed(1);
  const ty = (CY + R * Math.sin(toRad(startD + 270))).toFixed(1);
  const ex = (CX + R * Math.cos(toRad(startD + sweepDeg))).toFixed(1);
  const ey = (CY + R * Math.sin(toRad(startD + sweepDeg))).toFixed(1);
  const la  = sweepDeg > 180 ? 1 : 0;
  const num = aqiVal != null ? Math.round(+aqiVal) : '–';
  const arc = sweepDeg > 0.5
    ? `<path d="M${sx} ${sy} A19 19 0 ${la} 1 ${ex} ${ey}"
               stroke="${color}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
    : '';
  return `<svg viewBox="0 0 48 48" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="13.5" fill="rgba(10,15,25,0.88)"/>
    <path d="M${sx} ${sy} A19 19 0 1 1 ${tx} ${ty}"
          stroke="rgba(255,255,255,0.1)" stroke-width="5.5" fill="none" stroke-linecap="round"/>
    ${arc}
    <text x="24" y="22" text-anchor="middle" dominant-baseline="middle"
          fill="${color}" font-family="'Barlow Condensed',sans-serif"
          font-size="15" font-weight="800">${num}</text>
    <text x="24" y="32" text-anchor="middle" dominant-baseline="middle"
          fill="rgba(255,255,255,0.42)" font-family="sans-serif" font-size="7">AQI</text>
  </svg>`;
}

/* ── Info panel HTML ──────────────────────────────────────────────────────── */
function aqlPanelHTML(station) {
  const { name, area, aqi, pm25, pm10, updated, source } = station;
  const color  = aqlColor(aqi);
  const label  = aqlLabel(aqi);
  const aqiNum = aqi != null ? Math.round(+aqi) : '–';
  const pm10Row = pm10 != null
    ? `<div class="data-card">
         <div class="dc-label">PM10</div>
         <div class="dc-value">${(+pm10).toFixed(1)}<span class="dc-unit">µg/m³</span></div>
       </div>`
    : '';

  const scaleRows = AQL_SCALE.map(r => {
    const active = aqi != null && +aqi >= r.min && +aqi <= r.max;
    return `<div style="display:flex;align-items:center;gap:7px;padding:3.5px 4px;border-radius:5px;
      ${active ? 'background:rgba(255,255,255,.05);' : ''}">
      <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;
        background:${active ? r.color : r.color + '55'};"></span>
      <span style="font-size:0.72rem;flex:1;
        color:${active ? '#e2e8f0' : '#475569'};
        font-weight:${active ? '700' : '400'};">${r.range}</span>
      <span style="font-size:0.72rem;
        color:${active ? r.color : '#475569'};
        font-weight:${active ? '700' : '400'};">${r.label}</span>
    </div>`;
  }).join('');

  const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  return `
    <div id="panel-drag-handle"></div>
    <div id="panel-topbar">
      <div id="loc-body">
        <div id="loc-pin-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true">
            <circle cx="7.5" cy="9" r="1.7"/><circle cx="14" cy="6.5" r="2.3"/>
            <circle cx="17" cy="13.5" r="1.7"/><circle cx="9" cy="15.5" r="2"/>
            <circle cx="13.5" cy="17" r="1.3"/>
          </svg>
          <span style="font-size:0.62rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#a78bfa;">คุณภาพอากาศ</span>
        </div>
        <div id="loc-main">${name}</div>
        <div id="loc-sub">${area || 'จ.ขอนแก่น'}</div>
        <div id="loc-coords">${station.lat.toFixed(4)}°N &nbsp;${station.lng.toFixed(4)}°E</div>
      </div>
      <button id="panel-close" aria-label="ปิด">✕</button>
    </div>
    <div id="panel-scroll">
      <div class="p-section">

        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px;">
          <span style="font-size:2.4rem;font-weight:800;line-height:1;
            color:${color};font-family:'Barlow Condensed',sans-serif;">${aqiNum}</span>
          <div>
            <div style="font-size:0.68rem;color:#64748b;font-weight:600;
              text-transform:uppercase;letter-spacing:.05em;">AQI</div>
            <div style="font-size:0.88rem;font-weight:700;color:${color};">${label}</div>
          </div>
        </div>

        <div class="data-grid" style="margin-bottom:12px;">
          <div class="data-card">
            <div class="dc-label">PM2.5</div>
            <div class="dc-value">${pm25 != null ? (+pm25).toFixed(1) : '–'}<span class="dc-unit">µg/m³</span></div>
          </div>
          ${pm10Row}
        </div>

        <div style="margin-bottom:12px;">
          <div class="dc-label" style="margin-bottom:6px;">ระดับ AQI</div>
          ${scaleRows}
        </div>

        <div style="font-size:0.74rem;color:#475569;">
          อัปเดต: ${updated || '—'}
        </div>

      </div>
      <div id="panel-footer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" width="10" height="10">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        ${now} &nbsp;·&nbsp; ${source}
      </div>
    </div>`;
}

/* ── AQILayer module ─────────────────────────────────────────────────────── */
const AQILayer = (() => {
  let _stations = [];
  let _markers  = [];
  let _enabled  = false;

  function _openPanel(station) {
    const panel = document.getElementById('info-panel');
    if (!panel) return;
    panel.innerHTML = aqlPanelHTML(station);
    panel.classList.add('open');
    document.getElementById('panel-close')?.addEventListener('click', () => {
      panel.classList.remove('open');
    });
  }

  function _placeMarkers() {
    const map = window.HSKK_MAP;
    _stations.forEach(s => {
      const color = aqlColor(s.aqi);
      const label = s.aqi != null
        ? `${s.name}: AQI ${Math.round(+s.aqi)}`
        : `${s.name}: ไม่มีข้อมูล`;

      const el = document.createElement('div');
      el.style.cssText = 'width:60px;height:60px;cursor:pointer;';
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', label);

      const inner = document.createElement('div');
      inner.style.cssText =
        'transition:transform .15s,filter .15s;' +
        'filter:drop-shadow(0 3px 8px rgba(0,0,0,.5));';
      inner.innerHTML = aqlGaugePin(s.aqi, color);
      el.appendChild(inner);

      el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.1)'; });
      el.addEventListener('mouseleave', () => { inner.style.transform = ''; });
      el.addEventListener('click', e => {
        e.stopPropagation();
        _openPanel(s);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([s.lng, s.lat])
        .addTo(map);

      _markers.push({ s, el, marker });
    });
  }

  function _injectLegend() {
    let legend = document.getElementById('aql-legend');
    if (legend) { legend.style.display = ''; return; }

    legend = document.createElement('div');
    legend.id = 'aql-legend';
    legend.innerHTML = `
      <div class="hl-legend-hd">
        <span>คุณภาพอากาศ (AQI)</span>
        <button class="hl-legend-toggle" id="aql-legend-toggle"
                aria-expanded="true" aria-label="ซ่อน/แสดงคำอธิบาย">
          <svg viewBox="0 0 10 6" width="8" height="8" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round"><path d="M1 1l4 4 4-4"/></svg>
        </button>
      </div>
      <div id="aql-legend-body">
        ${AQL_SCALE.map(r =>
          `<div class="hl-legend-row">
             <span class="hl-legend-swatch" style="background:${r.color}"></span>
             <span>${r.range} ${r.label}</span>
           </div>`
        ).join('')}
      </div>`;

    /* Avoid overlapping heat legend — offset to the right if heat is active */
    const hlLeg = document.getElementById('hl-legend');
    if (hlLeg && hlLeg.style.display !== 'none') {
      legend.style.left = '11rem';
    }

    document.querySelector('.map-canvas').appendChild(legend);

    document.getElementById('aql-legend-toggle')?.addEventListener('click', () => {
      const body = document.getElementById('aql-legend-body');
      const btn  = document.getElementById('aql-legend-toggle');
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      btn.setAttribute('aria-expanded', String(!open));
      btn.classList.toggle('collapsed', open);
    });
  }

  function _removeLegend() {
    const el = document.getElementById('aql-legend');
    if (el) el.style.display = 'none';
  }

  /* ── Public API ── */
  return {
    get enabled() { return _enabled; },

    async enable() {
      if (_enabled) return;
      _enabled = true;
      if (!window.HSKK_MAP) { _enabled = false; return; }

      if (window.LayerRegistry) window.LayerRegistry.setLayerLoading('aqi', true);

      let result;
      try {
        result = await aqlFetchAir4Thai();
        console.info('[aqi-layer] Air4Thai OK:', result.stations.length, 'stations');
      } catch (e1) {
        console.warn('[aqi-layer] Air4Thai failed:', e1.message, '→ Open-Meteo');
        try {
          result = await aqlFetchOpenMeteo();
          console.info('[aqi-layer] Open-Meteo OK');
        } catch (e2) {
          console.error('[aqi-layer] all sources failed:', e2.message);
          result = { stations: [] };
        }
      }

      if (window.LayerRegistry) window.LayerRegistry.setLayerLoading('aqi', false);
      if (!_enabled) return;

      _stations = result.stations;
      _placeMarkers();
      _injectLegend();
    },

    disable() {
      if (!_enabled) return;
      _enabled = false;
      _markers.forEach(m => m.marker.remove());
      _markers = [];
      _stations = [];
      _removeLegend();

      const panel  = document.getElementById('info-panel');
      const pinTxt = panel?.querySelector('#loc-pin-icon span');
      if (pinTxt?.textContent?.includes('คุณภาพอากาศ')) {
        panel.classList.remove('open');
      }
    },
  };
})();

window.AQILayer = AQILayer;
