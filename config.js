/* ==========================================================================
   Heat Safe Khon Kaen — config.js
   Single source of truth for ALL external API endpoints and tile layers.
   Must be loaded before script.js.
   No API keys required except Supabase (item 13).
   ========================================================================== */

'use strict';

window.HSKK_CONFIG = {

  /* ── Location ──────────────────────────────────────────────────────────── */
  loc: { lat: 16.44, lng: 102.82, zoom: 11, name: 'ขอนแก่น' },

  /* ── 1. Open-Meteo Forecast ─────────────────────────────────────────────
     Provides: temperature_2m, apparent_temperature, relative_humidity_2m,
               wind_speed_10m, uv_index, weather_code (current)
               + hourly temperature_2m for 24 h trend sparkline
  ─────────────────────────────────────────────────────────────────────────── */
  weatherUrl:
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=16.44&longitude=102.82' +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,' +
    'wind_speed_10m,uv_index,weather_code' +
    '&hourly=temperature_2m&forecast_hours=24' +
    '&timezone=Asia%2FBangkok',

  /* ── 2. Open-Meteo Air Quality ──────────────────────────────────────────
     Provides: pm2_5, us_aqi (current)
  ─────────────────────────────────────────────────────────────────────────── */
  airQualityUrl:
    'https://air-quality-api.open-meteo.com/v1/air-quality' +
    '?latitude=16.44&longitude=102.82' +
    '&current=pm2_5,us_aqi' +
    '&timezone=Asia%2FBangkok',

  /* ── 11. Nominatim reverse geocoding ────────────────────────────────────
     Usage: GET /reverse?lat=16.44&lon=102.82&format=json
     Usage policy: max 1 req/s, include User-Agent header
  ─────────────────────────────────────────────────────────────────────────── */
  nominatimUrl: 'https://nominatim.openstreetmap.org/reverse',

  /* ── 12. MapLibre GL glyph font stack ────────────────────────────────────
     Used in MapLibre style.glyphs for map label rendering
  ─────────────────────────────────────────────────────────────────────────── */
  glyphsUrl: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',

  /* ── 13. Supabase (heat-map pin storage) ────────────────────────────────
     TODO: replace empty strings with your project credentials.
     In a Vite/React app use: import.meta.env.VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
     In this vanilla build the values are set here directly (do NOT commit real keys to git).
  ─────────────────────────────────────────────────────────────────────────── */
  supabase: {
    url:     '',   /* TODO: 'https://xxxx.supabase.co' */
    anonKey: ''    /* TODO: your public anon key */
  },

  /* ── Map tile layers ─────────────────────────────────────────────────────
     Each entry describes a MapLibre raster/raster-dem source + display meta.
     MapLibre URL tokens: {z} zoom · {x} tile column · {y} tile row
     WMTS REST tiles (NASA GIBS, EOxCloudless) use {z}/{y}/{x} order (TileMatrix/TileRow/TileCol).
  ─────────────────────────────────────────────────────────────────────────── */
  layers: {

    /* 9 ── OpenStreetMap road map */
    osm: {
      label: 'แผนที่ถนน (OSM)',
      sourceType: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },

    /* 7 ── Esri World Imagery (current best-available satellite) */
    esriSatellite: {
      label: 'ดาวเทียม Esri',
      sourceType: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 19,
      attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics &amp; GIS User Community'
    },

    /* 8 ── Esri World Shaded Relief (3D-look terrain) */
    esriRelief: {
      label: 'ภูมิประเทศ (Esri)',
      sourceType: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 13,
      attribution: 'Tiles © Esri — Source: USGS, ESRI, TANA, DeLorme, NPS'
    },

    /* 6 ── EOxCloudless Sentinel-2 2024 (cloud-free mosaic, WMTS) */
    sentinel2_2024: {
      label: 'Sentinel-2 2024',
      sourceType: 'raster',
      /* WMTS REST: TileMatrix/TileRow/TileCol → {z}/{y}/{x} */
      tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'],
      tileSize: 256,
      maxzoom: 14,
      attribution: 'EOxCloudless 2024 © <a href="https://eox.at">EOX IT Services GmbH</a> (CC BY 4.0)'
    },

    /* 6b ── EOxCloudless Sentinel-2 2016 (historical baseline) */
    sentinel2_2016: {
      label: 'Sentinel-2 2016',
      sourceType: 'raster',
      tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2016_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'],
      tileSize: 256,
      maxzoom: 14,
      attribution: 'EOxCloudless 2016 © <a href="https://eox.at">EOX IT Services GmbH</a> (CC BY 4.0)'
    },

    /* 4 ── NASA GIBS — MODIS Terra Land Surface Temperature Monthly (WMTS)
       TIME is set dynamically by JS to the most recent full month.
       Max zoom is Level 7 for this product.
    */
    modisLST: {
      label: 'MODIS อุณหภูมิพื้นผิว',
      sourceType: 'raster',
      /* {DATE} replaced at runtime with YYYY-MM-DD (first of prior month) */
      tileTemplate: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_L3_Land_Surface_Temp_Monthly_Day/default/{DATE}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.jpg',
      tiles: [], /* populated by initSatelliteMap() after substituting DATE */
      tileSize: 256,
      maxzoom: 7,
      attribution: 'NASA GIBS / MODIS Terra — Land Surface Temperature'
    },

    /* 5 ── NASA GIBS WMTS — MODIS Terra True Color (archive 2000 – present) */
    nasaTrueColor: {
      label: 'NASA True Color',
      sourceType: 'raster',
      tileTemplate: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{DATE}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
      tiles: [],
      tileSize: 256,
      maxzoom: 9,
      attribution: 'NASA GIBS / MODIS Terra True Color Corrected Reflectance'
    },

    /* 3 ── TMD Forecast Tiles (temperature forecast overlay)
       TODO: verify exact layer name/path with TMD API docs.
       Possible paths: /t2m, /rain, /wind — check wxmap.tmd.go.th for catalogue.
    */
    tmdForecast: {
      label: 'พยากรณ์ TMD',
      sourceType: 'raster',
      tiles: ['https://wxmap.tmd.go.th/api/fcst/tiled/{z}/{x}/{y}.png'], /* TODO: confirm layer path */
      tileSize: 256,
      maxzoom: 12,
      attribution: '© กรมอุตุนิยมวิทยา (TMD)'
    },

    /* 10 ── AWS Terrain Tiles — Mapzen Terrarium DEM (raster-dem for 3D terrain)
       Used as MapLibre terrain source, not a visible raster layer.
       encoding: 'terrarium' decodes R,G,B → elevation in metres.
    */
    awsTerrain: {
      label: 'DEM Terrain 3D',
      sourceType: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      encoding: 'terrarium',
      tileSize: 256,
      maxzoom: 15,
      attribution: 'Terrain tiles by Mapzen, hosted on Amazon S3'
    }

  } /* end layers */

}; /* end HSKK_CONFIG */
