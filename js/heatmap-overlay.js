'use strict';
/* ==========================================================================
   Heatmap Overlay — js/heatmap-overlay.js
   Temperature heatmap from 26 real monitoring points in อำเภอเมืองขอนแก่น.
   Uses Open-Meteo current temperature at each point location.
   Relative min–max scaling ensures urban-heat-island variation is visible.

   Depends on: maplibregl (global), window.HSKK_MAP (realtime-map.js)
   Exposes:    window.HeatmapOverlay
   ========================================================================== */

/* ── 26 monitoring points: urban core → suburban → rural edges ────────────
   Spread across multiple Open-Meteo grid cells (~11 km) so temperature
   difference between city centre and outer rural areas is captured.       */
const HMO_POINTS = [
  /* Urban core – dense roads, markets, built-up (hottest) */
  { lat: 16.4414, lng: 102.8356 }, // ตลาดกลางเมือง
  { lat: 16.4380, lng: 102.8340 }, // ย่านธุรกิจ
  { lat: 16.4450, lng: 102.8370 }, // ถนนหน้าเมือง
  { lat: 16.4300, lng: 102.8320 }, // ใจกลางเมือง
  { lat: 16.4404, lng: 102.8400 }, // สถานีรถไฟ
  { lat: 16.4284, lng: 102.8335 }, // แยกเซ็นทรัล
  { lat: 16.4422, lng: 102.8290 }, // ถนนมิตรภาพฝั่งใน
  { lat: 16.4350, lng: 102.8360 }, // ย่านวัดกลางเมือง

  /* Near water / parks – cooler microclimate */
  { lat: 16.4369, lng: 102.8260 }, // บึงแก่นนคร
  { lat: 16.4550, lng: 102.8450 }, // บึงทุ่งสร้าง

  /* Institutional / university */
  { lat: 16.4308, lng: 102.8199 }, // มข. (KKU)
  { lat: 16.4250, lng: 102.8150 }, // รอบมหาวิทยาลัย

  /* Peri-urban – first ring */
  { lat: 16.4700, lng: 102.8350 }, // บ้านทุ่ม
  { lat: 16.4600, lng: 102.8200 }, // ชานเมืองเหนือ
  { lat: 16.4150, lng: 102.8150 }, // ชานเมืองตะวันตก
  { lat: 16.4100, lng: 102.8350 }, // บ้านพระลับ
  { lat: 16.4500, lng: 102.8600 }, // ชานเมืองตะวันออก
  { lat: 16.4250, lng: 102.8500 }, // ย่านใต้-ตะวันออก

  /* Outer suburban */
  { lat: 16.3900, lng: 102.8300 }, // ท่าพระ
  { lat: 16.4600, lng: 102.7900 }, // โคกสี
  { lat: 16.4800, lng: 102.7900 }, // สาวะถี

  /* Rural / agricultural edges (coolest) */
  { lat: 16.5100, lng: 102.8300 }, // ชนบทเหนือ
  { lat: 16.3700, lng: 102.8500 }, // ชนบทใต้
  { lat: 16.4400, lng: 102.9000 }, // ชนบทตะวันออก
  { lat: 16.4400, lng: 102.7600 }, // ชนบทตะวันตก
  { lat: 16.5300, lng: 102.8800 }, // ชนบทเหนือ-ตะวันออก
];

/* ── Fetch current temperature at all 26 points (1 batch request) ─────── */
async function hmoFetch() {
  const lats = HMO_POINTS.map(p => p.lat).join(',');
  const lngs = HMO_POINTS.map(p => p.lng).join(',');
  const url  =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lats}&longitude=${lngs}` +
    '&current=temperature_2m&timezone=Asia%2FBangkok';

  const res  = await fetch(url);
  const json = await res.json();
  const arr  = Array.isArray(json) ? json : [json];

  const raw = HMO_POINTS
    .map((p, i) => ({ lat: p.lat, lng: p.lng, temp: arr[i]?.current?.temperature_2m ?? null }))
    .filter(p => p.temp !== null);

  if (!raw.length) throw new Error('[heatmap-overlay] no temperature data');
  return raw;
}

/* ── Relative min–max weight: coolest=0 (blue/green), hottest=1 (red) ─── */
function hmoRelative(pts) {
  const temps = pts.map(p => p.temp);
  const minT  = Math.min(...temps);
  const maxT  = Math.max(...temps);
  const range = (maxT - minT) || 0.01;
  return {
    minT, maxT,
    weighted: pts.map(p => ({ ...p, w: (p.temp - minT) / range })),
  };
}

/* ── GeoJSON ─────────────────────────────────────────────────────────────── */
function hmoGeoJSON(weighted) {
  return {
    type: 'FeatureCollection',
    features: weighted.map(p => ({
      type:       'Feature',
      geometry:   { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { w: p.w },
    })),
  };
}

/* ── MapLibre heatmap paint ──────────────────────────────────────────────
   Radius is large so sparse 26 points blend into an organic shape —
   NOT a grid rectangle. Edges fade naturally where no points exist.      */
const HMO_PAINT = {
  'heatmap-weight': ['interpolate', ['linear'], ['get', 'w'], 0, 0, 1, 1],

  /* Intensity: ramps up with zoom for fine detail when zooming in */
  'heatmap-intensity': ['interpolate', ['linear'], ['zoom'],
    7,  0.6,
    9,  1.0,
    11, 1.6,
    13, 2.4,
  ],

  /* Radius large enough to blend 2–5 km gaps between 26 real points */
  'heatmap-radius': ['interpolate', ['linear'], ['zoom'],
    7,  45,
    8,  65,
    9,  95,
    10, 140,
    11, 200,
    12, 300,
  ],

  /* Color: transparent → blue (cool) → green → yellow → orange → red (hot) */
  'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'],
    0,    'rgba(0,0,0,0)',
    0.05, 'rgba(30,100,220,0.50)',
    0.22, 'rgba(0,200,100,0.68)',
    0.42, 'rgba(255,225,0,0.82)',
    0.62, 'rgba(255,130,0,0.90)',
    0.82, 'rgba(235,40,10,0.95)',
    1.0,  'rgb(150,0,0)',
  ],

  'heatmap-opacity': 0.88,
};

/* ── Legend ──────────────────────────────────────────────────────────────── */
function hmoShowLegend(minT, maxT, fetchedAt) {
  let el = document.getElementById('hmo-legend');
  if (!el) {
    el = document.createElement('div');
    el.id = 'hmo-legend';
    Object.assign(el.style, {
      position:            'absolute',
      bottom:              '2.75rem',
      right:               '1rem',
      background:          'rgba(8,15,28,0.90)',
      backdropFilter:      'blur(10px)',
      WebkitBackdropFilter:'blur(10px)',
      border:              '1px solid rgba(255,255,255,0.13)',
      borderRadius:        '10px',
      padding:             '0.65rem 0.85rem',
      zIndex:              '10',
      minWidth:            '155px',
      pointerEvents:       'none',
      fontFamily:          "'Noto Sans Thai', sans-serif",
    });
    document.querySelector('.map-canvas')?.appendChild(el);
  }

  el.style.display = '';
  el.innerHTML = `
    <div style="font-size:0.59rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;
                color:#94a3b8;margin-bottom:0.35rem;">อุณหภูมิพื้นที่ (°C)</div>
    <div style="display:flex;justify-content:space-between;font-size:0.66rem;
                color:#e2e8f0;margin-bottom:0.25rem;">
      <span>${minT.toFixed(1)}°</span>
      <span>${((minT + maxT) / 2).toFixed(1)}°</span>
      <span>${maxT.toFixed(1)}°</span>
    </div>
    <div style="height:10px;border-radius:5px;margin-bottom:0.32rem;
                background:linear-gradient(to right,
                  rgb(30,100,220),
                  rgb(0,200,100),
                  rgb(255,225,0),
                  rgb(255,130,0),
                  rgb(235,40,10),
                  rgb(150,0,0));"></div>
    <div style="display:flex;justify-content:space-between;font-size:0.60rem;
                color:#64748b;margin-bottom:0.28rem;">
      <span>เย็น</span><span>ร้อน</span>
    </div>
    <div style="font-size:0.56rem;color:#334155;text-align:center;line-height:1.55;
                border-top:1px solid rgba(255,255,255,0.07);padding-top:0.25rem;">
      ประมาณจาก 26 จุดตรวจ · Open-Meteo<br>
      ไม่ใช่ค่าตรวจวัดจริงรายหลังคาเรือน<br>
      <span style="color:#475569;">อัปเดต ${fetchedAt}</span>
    </div>`;
}

function hmoHideLegend() {
  const el = document.getElementById('hmo-legend');
  if (el) el.style.display = 'none';
}

/* ── Module ──────────────────────────────────────────────────────────────── */
const HeatmapOverlay = (() => {
  let _on = false;

  function _map() { return window.HSKK_MAP; }

  function _upsert(geojson) {
    const map = _map();
    if (!map) return;
    if (map.getSource('hmo-src')) {
      map.getSource('hmo-src').setData(geojson);
      if (map.getLayer('hmo-layer')) {
        map.setLayoutProperty('hmo-layer', 'visibility', 'visible');
      }
    } else {
      map.addSource('hmo-src', { type: 'geojson', data: geojson });
      map.addLayer({ id: 'hmo-layer', type: 'heatmap', source: 'hmo-src', paint: HMO_PAINT });
    }
  }

  function _hide() {
    const map = _map();
    if (map?.getLayer('hmo-layer')) {
      map.setLayoutProperty('hmo-layer', 'visibility', 'none');
    }
  }

  async function _load() {
    const raw = await hmoFetch();
    if (!_on) return;

    const { minT, maxT, weighted } = hmoRelative(raw);
    _upsert(hmoGeoJSON(weighted));

    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    hmoShowLegend(minT, maxT, now);
  }

  return {
    get enabled() { return _on; },

    async enable() {
      if (_on) return;
      _on = true;
      const map = _map();
      if (!map) { _on = false; return; }
      try {
        map.isStyleLoaded() ? await _load() : map.once('load', _load);
      } catch (e) {
        console.error('[heatmap-overlay]', e);
        _on = false;
      }
    },

    disable() {
      _on = false;
      _hide();
      hmoHideLegend();
    },

    toggle() {
      if (_on) this.disable(); else this.enable();
    },
  };
})();

window.HeatmapOverlay = HeatmapOverlay;
