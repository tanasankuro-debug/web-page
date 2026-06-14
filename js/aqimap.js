'use strict';

/* AQI Map — data source cascade:
   1. Air4Thai PCD API  (official, may fail CORS)
   2. OpenAQ v2         (CORS-friendly, radius search)
   3. Open-Meteo        (always works, single point)
   Markers: MapLibre HTML Marker per station (like Air4Thai pin style)
*/

const AIR4THAI_URL = 'https://air4thai.pcd.go.th/services/getLastVal_V2.php';
const OPENAQ_URL   = 'https://api.openaq.org/v2/latest?' +
  'coordinates=16.44,102.82&radius=50000&parameter=pm25&limit=50&order_by=lastUpdated&sort=desc';

/* ── AQI scale ────────────────────────────────────────────────────────────── */
const AQI_SCALE = [
  { min: 0,   max: 50,  color: '#22C55E', range: '0–50',    label: 'ดี' },
  { min: 51,  max: 100, color: '#A3E635', range: '51–100',  label: 'ปานกลาง' },
  { min: 101, max: 150, color: '#FACC15', range: '101–150', label: 'ไม่ดีกลุ่มเสี่ยง' },
  { min: 151, max: 200, color: '#FB923C', range: '151–200', label: 'ไม่ดี' },
  { min: 201, max: 300, color: '#EF4444', range: '201–300', label: 'แย่มาก' },
  { min: 301, max: 9999,color: '#7C3AED', range: '301+',    label: 'อันตราย' }
];

function aqiColor(aqi) {
  const row = AQI_SCALE.find(r => +aqi >= r.min && +aqi <= r.max);
  return row ? row.color : '#94a3b8';
}

function aqiLabel(aqi) {
  const row = AQI_SCALE.find(r => +aqi >= r.min && +aqi <= r.max);
  return row ? row.label : 'ไม่มีข้อมูล';
}

function pm25ToAQI(pm) {
  if (pm == null || isNaN(+pm)) return null;
  const bp = [
    [0,12,0,50],[12.1,35.4,51,100],[35.5,55.4,101,150],
    [55.5,150.4,151,200],[150.5,250.4,201,300],
    [250.5,350.4,301,400],[350.5,500.4,401,500]
  ];
  for (const [cL,cH,iL,iH] of bp)
    if (+pm >= cL && +pm <= cH)
      return Math.round((iH - iL) / (cH - cL) * (+pm - cL) + iL);
  return +pm > 500 ? 500 : 0;
}

/* ── Data sources ─────────────────────────────────────────────────────────── */
async function fetchAir4Thai() {
  const res = await fetch(AIR4THAI_URL, { signal: AbortSignal.timeout(8000) });
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
    stations: list.filter(s => s.lat && s.long).map(s => ({
      name:    s.nameTH || s.nameEN || s.stationID,
      area:    s.areaTH || '',
      lat:     +s.lat,
      lng:     +s.long,
      aqi:     s.AQI?.aqi != null ? +s.AQI.aqi : pm25ToAQI(s.PM25?.value),
      pm25:    s.PM25?.value != null ? +s.PM25.value : null,
      pm10:    s.PM10?.value != null ? +s.PM10.value : null,
      updated: s.LastUpdate || ''
    }))
  };
}

async function fetchOpenAQ() {
  const res = await fetch(OPENAQ_URL, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const list = (data.results || []).filter(r => r.coordinates?.latitude);
  if (!list.length) throw new Error('no results');
  const stations = list.map(r => {
    const m    = r.measurements?.find(x => x.parameter === 'pm25');
    const pm25 = m?.value ?? null;
    return {
      name:    r.location,
      area:    r.city || '',
      lat:     r.coordinates.latitude,
      lng:     r.coordinates.longitude,
      aqi:     pm25ToAQI(pm25),
      pm25,
      updated: m?.lastUpdated?.slice(0, 16).replace('T', ' ') || ''
    };
  }).filter(s => s.pm25 !== null);
  if (!stations.length) throw new Error('no pm25');
  return { source: 'OpenAQ', stations };
}

async function fetchOpenMeteo() {
  const url = window.HSKK_CONFIG?.airQualityUrl;
  if (!url) throw new Error('no config');
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const pm25 = data.current?.pm2_5 ?? null;
  const aqi  = data.current?.us_aqi ?? pm25ToAQI(pm25);
  return {
    source: 'Open-Meteo Air Quality',
    stations: [{ name: 'ขอนแก่น', area: '', lat: 16.44, lng: 102.82, aqi, pm25, updated: 'เรียลไทม์' }]
  };
}

/* ── Popup HTML ───────────────────────────────────────────────────────────── */
function buildPopupHTML(s) {
  const aqi   = s.aqi  != null ? s.aqi  : '-';
  const pm25  = s.pm25 != null ? (+s.pm25).toFixed(1) : '-';
  const pm10  = s.pm10 != null ? (+s.pm10).toFixed(1) : null;
  const color = aqiColor(s.aqi);

  const scaleRows = AQI_SCALE.map(r => {
    const active = s.aqi != null && +s.aqi >= r.min && +s.aqi <= r.max;
    return `<li class="aqi-scale-row${active ? ' aqi-scale-active' : ''}" style="--sc:${r.color};">
      <span class="aqi-scale-dot"></span>
      <span class="aqi-scale-range">${r.range}</span>
      <span class="aqi-scale-lbl">${r.label}</span>
    </li>`;
  }).join('');

  const pm10Row = pm10
    ? `<div class="aqi-popup-extra">PM10 <strong>${pm10}</strong> µg/m³</div>`
    : '';

  return `
    <div class="aqi-popup">
      <div class="aqi-popup-name">${s.name}</div>
      ${s.area ? `<div class="aqi-popup-area">${s.area}</div>` : ''}
      <div class="aqi-popup-vals">
        <div class="aqi-popup-num" style="color:${color};">
          ${aqi}<span>AQI</span>
        </div>
        <div class="aqi-popup-num">
          ${pm25}<span>PM2.5 µg/m³</span>
        </div>
      </div>
      ${pm10Row}
      <ul class="aqi-popup-scale">${scaleRows}</ul>
      <div class="aqi-popup-time">อัปเดต: ${s.updated || '-'}</div>
    </div>`;
}

/* ── Sidebar cards ────────────────────────────────────────────────────────── */
function renderCards(stations) {
  const el = document.getElementById('aqi-station-list');
  if (!el) return;
  if (!stations.length) {
    el.innerHTML = '<p class="aqi-status">ไม่พบสถานีในบริเวณนี้</p>';
    return;
  }
  el.innerHTML = stations.map(s => {
    const aqi   = s.aqi  != null ? s.aqi  : '-';
    const pm25  = s.pm25 != null ? (+s.pm25).toFixed(1) : '-';
    const color = aqiColor(s.aqi);
    return `
      <div class="aqi-card" style="--aqi-c:${color};">
        <div class="aqi-card-name">${s.name}</div>
        <div class="aqi-card-vals">
          <span class="aqi-card-val">${aqi}<small>AQI</small></span>
          <span class="aqi-card-val pm25">${pm25}<small>µg/m³</small></span>
        </div>
        <div class="aqi-card-level">${aqiLabel(s.aqi)}</div>
        <div class="aqi-card-time">${s.updated}</div>
      </div>`;
  }).join('');
}

/* ── HTML Markers ─────────────────────────────────────────────────────────── */
function addMarkers(map, stations) {
  stations.filter(s => s.lat && s.lng).forEach(s => {
    const aqi   = s.aqi  != null ? s.aqi  : '-';
    const color = aqiColor(s.aqi);

    /* Pin element */
    const el = document.createElement('div');
    el.className = 'aqi-pin';
    el.style.setProperty('--pin-c', color);
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${s.name}: AQI ${aqi}`);
    el.innerHTML = `<strong>${aqi}</strong><small>AQI</small>`;

    /* Popup */
    const popup = new maplibregl.Popup({
      closeButton: true,
      maxWidth: '280px',
      className: 'aqi-mgl-popup',
      offset: 24
    }).setHTML(buildPopupHTML(s));

    new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([s.lng, s.lat])
      .setPopup(popup)
      .addTo(map);
  });
}

/* ── Main init ────────────────────────────────────────────────────────────── */
window.initAQIMap = function () {
  const container = document.getElementById('aqi-map-el');
  if (!container) return;
  if (typeof maplibregl === 'undefined') {
    console.warn('[aqimap] MapLibre GL not loaded');
    return;
  }

  const map = new maplibregl.Map({
    container: 'aqi-map-el',
    style: {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
        osm: {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: '© OpenStreetMap contributors'
        },
        esriSatellite: {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          maxzoom: 19,
          attribution: 'Tiles © Esri — Maxar, Earthstar Geographics'
        },
        esriLabels: {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          maxzoom: 19,
          attribution: 'Labels © Esri'
        }
      },
      layers: [
        { id: 'osm',          type: 'raster', source: 'osm',          layout: { visibility: 'visible' } },
        { id: 'esriSatellite',type: 'raster', source: 'esriSatellite',layout: { visibility: 'none'    } },
        { id: 'esriLabels',   type: 'raster', source: 'esriLabels',   layout: { visibility: 'none'    } }
      ]
    },
    center: [102.82, 16.44],
    zoom: 10,
    attributionControl: false
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

  /* Layer switcher */
  document.querySelectorAll('[data-aqi-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isSat = btn.dataset.aqiLayer === 'esriSatellite';
      map.setLayoutProperty('osm',          'visibility', isSat ? 'none'    : 'visible');
      map.setLayoutProperty('esriSatellite','visibility', isSat ? 'visible' : 'none');
      map.setLayoutProperty('esriLabels',   'visibility', isSat ? 'visible' : 'none');
      document.querySelectorAll('[data-aqi-layer]').forEach(b => {
        b.classList.toggle('active', b.dataset.aqiLayer === btn.dataset.aqiLayer);
        b.setAttribute('aria-pressed', String(b.dataset.aqiLayer === btn.dataset.aqiLayer));
      });
    });
  });

  /* Load station data */
  map.on('load', async () => {
    let result;

    try {
      result = await fetchAir4Thai();
      console.info('[aqimap] Air4Thai OK');
    } catch (e1) {
      console.warn('[aqimap] Air4Thai failed:', e1.message, '→ OpenAQ');
      try {
        result = await fetchOpenAQ();
        console.info('[aqimap] OpenAQ OK');
      } catch (e2) {
        console.warn('[aqimap] OpenAQ failed:', e2.message, '→ Open-Meteo');
        try {
          result = await fetchOpenMeteo();
          console.info('[aqimap] Open-Meteo OK');
        } catch (e3) {
          console.error('[aqimap] all failed:', e3.message);
          const el = document.getElementById('aqi-station-list');
          if (el) el.innerHTML = '<p class="aqi-status aqi-error">โหลดข้อมูลไม่สำเร็จ<br/>กรุณาลองใหม่</p>';
          return;
        }
      }
    }

    const src = document.getElementById('aqi-source-label');
    if (src) src.textContent = 'ข้อมูล: ' + result.source;

    renderCards(result.stations);
    addMarkers(map, result.stations);
  });
};
