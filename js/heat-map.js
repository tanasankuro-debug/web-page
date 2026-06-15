/* ==========================================================================
   Heat Safe Khon Kaen — heat-map.js
   Satellite map + Open-Meteo temperature markers for heat.html
   Replaces map.js on this page; exports initSatelliteMap() so main.js works.
   ========================================================================== */
'use strict';

/* ── Sampling points across Khon Kaen province ──────────────────────────── */
const HEAT_POINTS = [
  { name: 'เมืองขอนแก่น', lat: 16.4322, lng: 102.8236 },
  { name: 'น้ำพอง',        lat: 16.7786, lng: 102.8125 },
  { name: 'อุบลรัตน์',    lat: 16.7500, lng: 102.8667 },
  { name: 'ชุมแพ',         lat: 16.5370, lng: 102.0987 },
  { name: 'พล',            lat: 15.8062, lng: 102.9255 },
  { name: 'บ้านไผ่',       lat: 15.9742, lng: 102.7372 },
  { name: 'หนองเรือ',      lat: 16.7833, lng: 102.5500 },
  { name: 'มัญจาคีรี',    lat: 16.0833, lng: 102.5333 },
];

/* ── Colour & label by °C ───────────────────────────────────────────────── */
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

/* ── Single batch request to Open-Meteo ─────────────────────────────────── */
async function fetchTemperatures() {
  const lats = HEAT_POINTS.map(p => p.lat).join(',');
  const lngs = HEAT_POINTS.map(p => p.lng).join(',');
  const url  =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lats}&longitude=${lngs}` +
    `&current=temperature_2m,apparent_temperature` +
    `&timezone=Asia%2FBangkok`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    const arr  = Array.isArray(data) ? data : [data];
    return HEAT_POINTS.map((p, i) => ({
      ...p,
      temp:  arr[i]?.current?.temperature_2m       ?? null,
      feels: arr[i]?.current?.apparent_temperature ?? null,
    }));
  } catch {
    return HEAT_POINTS.map(p => ({ ...p, temp: null, feels: null }));
  }
}

/* ── Create one marker element ──────────────────────────────────────────── */
function makeBubble(temp, name, feels) {
  const color = tempColor(temp);
  const label = tempLabel(temp);

  const el = document.createElement('div');
  el.style.cssText =
    `background:${color};` +
    `border:2.5px solid rgba(255,255,255,0.85);` +
    `border-radius:50%;` +
    `width:52px;height:52px;` +
    `display:flex;flex-direction:column;` +
    `align-items:center;justify-content:center;` +
    `cursor:pointer;` +
    `box-shadow:0 3px 10px rgba(0,0,0,0.5);` +
    `transition:transform .15s ease;` +
    `font-weight:700;color:#fff;line-height:1.1;` +
    `font-family:sans-serif;font-size:14px;`;
  el.innerHTML =
    `<span>${Math.round(temp)}°</span>` +
    `<span style="font-size:9px;opacity:.9;">${name.length > 5 ? name.slice(0,5)+'…' : name}</span>`;
  el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.12)'; });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });

  const popup = new maplibregl.Popup({
    offset: 30, closeButton: false, maxWidth: '210px',
  }).setHTML(
    `<div style="padding:4px 2px;font-family:sans-serif;">` +
      `<div style="font-size:13px;font-weight:700;margin-bottom:4px;">${name}</div>` +
      `<div style="display:flex;align-items:baseline;gap:6px;">` +
        `<span style="font-size:26px;font-weight:800;color:${color}">${temp}°C</span>` +
        `<span style="font-size:11px;background:${color};color:#fff;padding:1px 7px;border-radius:99px;">${label}</span>` +
      `</div>` +
      (feels !== null
        ? `<div style="font-size:11px;color:#999;margin-top:3px;">รู้สึกเหมือน ${feels}°C</div>`
        : '') +
    `</div>`
  );

  return { el, popup };
}

/* ── Legend ──────────────────────────────────────────────────────────────── */
function injectLegend(container) {
  if (document.getElementById('heat-temp-legend')) return;
  const steps = [
    ['< 28°C', 'เย็น',     '#60a5fa'],
    ['28–31°', 'ปกติ',     '#4ade80'],
    ['31–33°', 'อุ่น',     '#facc15'],
    ['33–36°', 'ร้อน',     '#fb923c'],
    ['36–39°', 'ร้อนมาก', '#ef4444'],
    ['≥ 39°C', 'ร้อนจัด', '#c026d3'],
  ];
  const div = document.createElement('div');
  div.id = 'heat-temp-legend';
  div.style.cssText =
    `position:absolute;bottom:2.5rem;left:.75rem;z-index:10;` +
    `background:rgba(11,15,26,.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);` +
    `border:1px solid rgba(255,255,255,.12);border-radius:8px;` +
    `padding:8px 10px;font-family:sans-serif;font-size:11px;color:#e5e7eb;` +
    `pointer-events:none;min-width:130px;`;
  div.innerHTML =
    `<div style="font-weight:700;margin-bottom:5px;color:#fff;font-size:12px;">อุณหภูมิ (°C)</div>` +
    steps.map(([deg, th, col]) =>
      `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">` +
        `<span style="width:12px;height:12px;border-radius:50%;background:${col};flex-shrink:0;"></span>` +
        `<span>${deg} ${th}</span>` +
      `</div>`
    ).join('');
  container.appendChild(div);
}

/* ── Add all markers to the map ─────────────────────────────────────────── */
function addMarkers(map, points) {
  points.forEach(p => {
    if (p.temp === null) return;
    const { el, popup } = makeBubble(p.temp, p.name, p.feels);
    new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([p.lng, p.lat])
      .setPopup(popup)
      .addTo(map);
  });
}

/* ── Safe-load helper: run fn now if map already loaded, else on 'load' ─── */
function whenLoaded(map, fn) {
  if (map.loaded()) { fn(); } else { map.once('load', fn); }
}

/* ── Main entry point (called by main.js as initSatelliteMap) ────────────── */
function initSatelliteMap() {
  if (typeof maplibregl === 'undefined') return;
  const cfg = window.HSKK_CONFIG;
  if (!cfg) return;

  const { loc, layers } = cfg;
  const LAYER_ORDER = ['osm', 'esriRelief', 'esriSatellite'];

  /* Build sources & base layers */
  const sources   = {};
  const mapLayers = [];

  LAYER_ORDER.forEach(id => {
    const def = layers[id];
    if (!def || def.sourceType !== 'raster') return;
    sources[id] = {
      type: 'raster',
      tiles: def.tiles,
      tileSize: def.tileSize || 256,
      maxzoom:  def.maxzoom  || 18,
      attribution: def.attribution || '',
    };
    mapLayers.push({
      id,
      type: 'raster',
      source: id,
      layout: { visibility: id === 'esriSatellite' ? 'visible' : 'none' },
    });
  });

  /* Reference overlay */
  if (layers.esriReference) {
    sources['esriReference'] = {
      type: 'raster',
      tiles: layers.esriReference.tiles,
      tileSize: layers.esriReference.tileSize || 256,
      maxzoom:  layers.esriReference.maxzoom  || 19,
      attribution: layers.esriReference.attribution || '',
    };
    mapLayers.push({
      id: 'esriReference',
      type: 'raster',
      source: 'esriReference',
      layout: { visibility: 'visible' },
    });
  }

  /* Init MapLibre */
  const map = new maplibregl.Map({
    container: 'satellite-map-el',
    style: {
      version: 8,
      glyphs: cfg.glyphsUrl || 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources,
      layers: mapLayers,
    },
    center:  [loc.lng, loc.lat],
    zoom:    loc.zoom,
    maxZoom: 18,
    minZoom: 5,
    attributionControl: { compact: true },
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');

  /* Layer switcher */
  const layerBtns = $$('[data-map-layer]');
  const labelEl   = document.getElementById('map-layer-label');

  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.mapLayer;
      LAYER_ORDER.forEach(id => {
        if (map.getLayer(id))
          map.setLayoutProperty(id, 'visibility', id === target ? 'visible' : 'none');
      });
      if (map.getLayer('esriReference'))
        map.setLayoutProperty('esriReference', 'visibility',
          target === 'esriSatellite' ? 'visible' : 'none');
      layerBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (labelEl && layers[target]) labelEl.textContent = layers[target].label || target;
    });
  });

  /* Add legend + temperature markers after map ready */
  whenLoaded(map, () => {
    const mapEl = document.getElementById('satellite-map-el');
    if (mapEl) injectLegend(mapEl);

    fetchTemperatures().then(points => addMarkers(map, points));
  });
}
