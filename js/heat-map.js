/* ==========================================================================
   Heat Safe Khon Kaen — heat-map.js
   Satellite map + Open-Meteo temperature markers for heat.html
   Replaces map.js on this page only; exports initSatelliteMap() so
   main.js can call it without changes.
   ========================================================================== */
'use strict';

/* ── Temperature sampling points across Khon Kaen province ─────────────── */
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

/* ── Colour scale: °C → hex ─────────────────────────────────────────────── */
function tempColor(t) {
  if (t < 28) return '#60a5fa'; // blue  — เย็น
  if (t < 31) return '#4ade80'; // green — ปกติ
  if (t < 33) return '#facc15'; // yellow— อุ่น
  if (t < 36) return '#fb923c'; // orange— ร้อน
  if (t < 39) return '#ef4444'; // red   — ร้อนมาก
  return '#c026d3';             // purple— ร้อนจัด
}

function tempLabel(t) {
  if (t < 28) return 'เย็น';
  if (t < 31) return 'ปกติ';
  if (t < 33) return 'อุ่น';
  if (t < 36) return 'ร้อน';
  if (t < 39) return 'ร้อนมาก';
  return 'ร้อนจัด';
}

/* ── Fetch temperature for all points in parallel ───────────────────────── */
async function fetchTemperatures() {
  const results = await Promise.allSettled(
    HEAT_POINTS.map(p =>
      fetch(
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${p.lat}&longitude=${p.lng}` +
        `&current=temperature_2m,apparent_temperature` +
        `&timezone=Asia%2FBangkok`
      ).then(r => r.json())
    )
  );
  return results.map((r, i) => ({
    ...HEAT_POINTS[i],
    temp:  r.status === 'fulfilled' ? (r.value?.current?.temperature_2m   ?? null) : null,
    feels: r.status === 'fulfilled' ? (r.value?.current?.apparent_temperature ?? null) : null,
  }));
}

/* ── Add temperature bubble markers to the map ──────────────────────────── */
function addTempMarkers(map, points) {
  points.forEach(p => {
    if (p.temp === null) return;

    const color = tempColor(p.temp);
    const label = tempLabel(p.temp);

    /* Bubble element */
    const el = document.createElement('div');
    el.className = 'heat-temp-marker';
    el.setAttribute('aria-label', `${p.name}: ${p.temp}°C`);
    el.style.cssText = [
      `background:${color}`,
      'border:2.5px solid rgba(255,255,255,0.85)',
      'border-radius:50%',
      'width:52px',
      'height:52px',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'cursor:pointer',
      'box-shadow:0 3px 10px rgba(0,0,0,0.45)',
      'transition:transform .15s ease',
      'font-weight:700',
      'color:#fff',
      'line-height:1',
    ].join(';');
    el.innerHTML =
      `<span style="font-size:15px">${Math.round(p.temp)}°</span>` +
      `<span style="font-size:9px;opacity:.9;margin-top:1px">${p.name.length > 5 ? p.name.slice(0, 5) + '…' : p.name}</span>`;

    el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.12)'; });
    el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

    /* Popup */
    const popup = new maplibregl.Popup({
      offset: 30,
      closeButton: false,
      maxWidth: '210px',
      className: 'heat-temp-popup',
    }).setHTML(
      `<div style="padding:6px 2px;font-family:sans-serif;">
        <div style="font-size:13px;font-weight:700;margin-bottom:4px;">${p.name}</div>
        <div style="display:flex;align-items:baseline;gap:6px;">
          <span style="font-size:26px;font-weight:800;color:${color}">${p.temp}°C</span>
          <span style="font-size:11px;background:${color};color:#fff;padding:1px 6px;border-radius:99px">${label}</span>
        </div>
        ${p.feels !== null
          ? `<div style="font-size:11px;color:#888;margin-top:3px;">รู้สึกเหมือน ${p.feels}°C</div>`
          : ''}
      </div>`
    );

    new maplibregl.Marker({ element: el })
      .setLngLat([p.lng, p.lat])
      .setPopup(popup)
      .addTo(map);
  });
}

/* ── Add temperature legend ─────────────────────────────────────────────── */
function addTempLegend(mapContainer) {
  const legend = document.createElement('div');
  legend.id = 'heat-temp-legend';
  legend.style.cssText = [
    'position:absolute',
    'bottom:2.5rem',
    'left:0.75rem',
    'background:rgba(11,15,26,0.82)',
    'backdrop-filter:blur(6px)',
    'border:1px solid rgba(255,255,255,0.12)',
    'border-radius:8px',
    'padding:8px 10px',
    'font-family:sans-serif',
    'font-size:11px',
    'color:#e5e7eb',
    'z-index:10',
    'pointer-events:none',
  ].join(';');

  const steps = [
    { label: '< 28°C เย็น',     color: '#60a5fa' },
    { label: '28–31°C ปกติ',    color: '#4ade80' },
    { label: '31–33°C อุ่น',    color: '#facc15' },
    { label: '33–36°C ร้อน',    color: '#fb923c' },
    { label: '36–39°C ร้อนมาก', color: '#ef4444' },
    { label: '≥ 39°C ร้อนจัด',  color: '#c026d3' },
  ];

  legend.innerHTML =
    `<div style="font-weight:700;margin-bottom:5px;color:#fff;">อุณหภูมิ (°C)</div>` +
    steps.map(s =>
      `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
        <span style="width:12px;height:12px;border-radius:50%;background:${s.color};flex-shrink:0;"></span>
        <span>${s.label}</span>
      </div>`
    ).join('');

  mapContainer.style.position = 'relative';
  mapContainer.appendChild(legend);
}

/* ── Main init — replaces initSatelliteMap() from map.js ───────────────── */
function initSatelliteMap() {
  if (typeof maplibregl === 'undefined') {
    console.warn('[heat-map] MapLibre GL JS not loaded.');
    return;
  }
  const cfg = window.HSKK_CONFIG;
  if (!cfg) { console.warn('[heat-map] config.js not loaded.'); return; }

  const { loc, layers } = cfg;

  const LAYER_ORDER = ['osm', 'esriRelief', 'esriSatellite'];

  const sources = {};
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

  /* Reference overlay (boundaries + labels) — on top of satellite */
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
        map.setLayoutProperty('esriReference', 'visibility', target === 'esriSatellite' ? 'visible' : 'none');

      layerBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      if (labelEl && layers[target]) labelEl.textContent = layers[target].label || target;
    });
  });

  /* Fetch temps and add markers once tiles are ready */
  map.on('load', async () => {
    const mapEl = document.getElementById('satellite-map-el');
    if (mapEl) addTempLegend(mapEl);

    const points = await fetchTemperatures();
    addTempMarkers(map, points);
  });
}
