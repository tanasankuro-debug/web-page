/* ==========================================================================
   Heat Safe Khon Kaen — realtime-map.js
   Dedicated map script for map.html (แผนที่เรียลไทม์)
   Independent from map.js — can be customised without affecting other pages.
   ========================================================================== */
'use strict';

function prevMonthDate() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

function resolveTiles(layerDef) {
  if (layerDef.tileTemplate) {
    return [layerDef.tileTemplate.replace('{DATE}', prevMonthDate())];
  }
  return layerDef.tiles || [];
}

function initSatelliteMap() {
  if (typeof maplibregl === 'undefined') {
    console.warn('[realtime-map] MapLibre GL JS not loaded.');
    return;
  }

  const cfg = window.HSKK_CONFIG;
  if (!cfg) { console.warn('[realtime-map] config.js not loaded.'); return; }

  const loc    = cfg.loc;
  const layers = cfg.layers;

  const sources   = {};
  const mapLayers = [];

  const LAYER_ORDER = ['osm', 'esriRelief', 'esriSatellite'];

  LAYER_ORDER.forEach(id => {
    const def = layers[id];
    if (!def || def.sourceType !== 'raster') return;

    sources[id] = {
      type: 'raster',
      tiles: resolveTiles(def),
      tileSize: def.tileSize || 256,
      maxzoom:  def.maxzoom  || 18,
      attribution: def.attribution || ''
    };

    mapLayers.push({
      id,
      type: 'raster',
      source: id,
      layout: { visibility: id === 'esriSatellite' ? 'visible' : 'none' }
    });
  });

  /* Reference overlay: boundaries + place names — shown on top of satellite only */
  if (layers.esriReference) {
    sources['esriReference'] = {
      type: 'raster',
      tiles: layers.esriReference.tiles,
      tileSize: layers.esriReference.tileSize || 256,
      maxzoom:  layers.esriReference.maxzoom  || 19,
      attribution: layers.esriReference.attribution || ''
    };
    mapLayers.push({
      id: 'esriReference',
      type: 'raster',
      source: 'esriReference',
      layout: { visibility: 'visible' }
    });
  }

  if (layers.awsTerrain) {
    sources['aws-terrain'] = {
      type:     'raster-dem',
      tiles:    layers.awsTerrain.tiles,
      tileSize: layers.awsTerrain.tileSize || 256,
      encoding: layers.awsTerrain.encoding || 'terrarium',
      attribution: layers.awsTerrain.attribution || ''
    };
  }

  const map = new maplibregl.Map({
    container: 'satellite-map-el',
    style: {
      version: 8,
      glyphs: cfg.glyphsUrl || 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources,
      layers: mapLayers
    },
    center:  [loc.lng, loc.lat],
    zoom:    loc.zoom,
    maxZoom: 18,
    minZoom: 5,
    attributionControl: { compact: true }
  });

  /* Expose map instance for overlay toggles and map-explore-plugin.js */
  window.HSKK_MAP = map;
  window._mapInstance = map;

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');
  map.addControl(new maplibregl.GeolocateControl({
    positionOptions:  { enableHighAccuracy: true },
    fitBoundsOptions: { maxZoom: 14 },
    trackUserLocation: false,
    showAccuracyCircle: true
  }), 'bottom-right');

  new maplibregl.Marker({ color: '#EF4444', scale: 1.1 })
    .setLngLat([loc.lng, loc.lat])
    .setPopup(
      new maplibregl.Popup({ offset: 28, closeButton: false })
        .setHTML('<strong>ขอนแก่น</strong><br>16.44°N 102.82°E')
    )
    .addTo(map);

  const layerBtns = $$('[data-map-layer]');
  const labelEl   = document.getElementById('map-layer-label');

  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target   = btn.dataset.mapLayer;
      const layerDef = layers[target];

      LAYER_ORDER.forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', id === target ? 'visible' : 'none');
        }
      });

      /* Show reference overlay only when satellite is active */
      if (map.getLayer('esriReference')) {
        map.setLayoutProperty('esriReference', 'visibility',
          target === 'esriSatellite' ? 'visible' : 'none');
      }

      layerBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });

      if (labelEl && layerDef) labelEl.textContent = layerDef.label || target;
    });
  });
}
