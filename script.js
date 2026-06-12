/* ==========================================================================
   Heat Safe Khon Kaen — script.js
   Vanilla JS: smooth scroll, scroll-spy, reveal, toggle, hamburger,
               sticky header, back-to-top, temperature widget
   ========================================================================== */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

/* =========================================================================
   1. SMOOTH SCROLL
   Native scroll-behavior: smooth is set in CSS; this handler adds a small
   guard for browsers that don't honour it and manages nav-close on mobile.
   ========================================================================= */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      closeMobileMenu();

      if (prefersReducedMotion) {
        target.scrollIntoView();
        target.focus({ preventScroll: true });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* =========================================================================
   2. STICKY HEADER — add .scrolled class once user leaves the hero
   ========================================================================= */
function initStickyHeader() {
  const header = $('#site-header');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* =========================================================================
   3. MOBILE HAMBURGER
   ========================================================================= */
let menuOpen = false;

function closeMobileMenu() {
  if (!menuOpen) return;
  const nav = $('#main-nav');
  const btn = $('#hamburger');
  if (nav) nav.classList.remove('open');
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  menuOpen = false;
}

function initHamburger() {
  const btn = $('#hamburger');
  const nav = $('#main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    btn.classList.toggle('open', menuOpen);
    nav.classList.toggle('open', menuOpen);
    btn.setAttribute('aria-expanded', String(menuOpen));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (menuOpen && !nav.contains(e.target) && !btn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMobileMenu();
  });
}

/* =========================================================================
   4. SCROLL REVEAL (IntersectionObserver)
   Elements with class .reveal fade+slide in as they enter the viewport.
   ========================================================================= */
function initScrollReveal() {
  if (prefersReducedMotion) {
    // Make all reveal elements visible immediately
    $$('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* =========================================================================
   5. SCROLL SPY
   Watches sections and highlights the matching link in the sticky nav
   and in the TOC section.
   ========================================================================= */
function initScrollSpy() {
  const sections = $$('section[id]').filter(s =>
    ['intro','live','comparison','heat-dome','uhi','research','satellite-map','impacts','solutions'].includes(s.id)
  );

  if (!sections.length) return;

  function setActive(id) {
    // Sticky nav links
    $$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    // TOC links
    $$('.toc-link').forEach(link => {
      link.classList.toggle('active', link.dataset.target === id);
    });
  }

  // rootMargin: shrink viewport so "active" fires near the top-centre of screen
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* =========================================================================
   6. COMPARISON TOGGLE (Heat Dome vs UHI)
   Switches the visible panel and updates ARIA tab state.
   ========================================================================= */
function initComparisonToggle() {
  const buttons = $$('.toggle-btn');
  const panels  = $$('.toggle-panel');

  if (!buttons.length || !panels.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = `panel-${btn.dataset.panel}`;

      // Update tab buttons
      buttons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      // Update panels
      panels.forEach(panel => {
        const isTarget = panel.id === targetId;
        panel.classList.toggle('active', isTarget);
        if (isTarget) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });
  });
}

/* =========================================================================
   7. BACK TO TOP BUTTON
   Shows after scrolling 600px, scrolls to top on click.
   ========================================================================= */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const show = window.scrollY > 600;
        btn.hidden = !show;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Return focus to the top landmark
    const skipLink = $('.skip-link');
    if (skipLink) skipLink.focus();
  });
}

/* =========================================================================
   8. TEMPERATURE SCALE WIDGET
   Slider maps 25–50 °C to a thermal risk level with color + Thai label.
   ========================================================================= */
const RISK_LEVELS = [
  {
    min: 25, max: 29,
    level: 'safe',
    label: 'ปลอดภัย',
    desc: 'อุณหภูมิอยู่ในระดับปกติสำหรับภูมิภาคนี้ สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ แต่ควรดื่มน้ำให้เพียงพอ'
  },
  {
    min: 30, max: 33,
    level: 'warn',
    label: 'ระวัง',
    desc: 'เริ่มรู้สึกไม่สบาย ควรดื่มน้ำสม่ำเสมอและหลีกเลี่ยงการออกกำลังกายหนักกลางแจ้งในช่วงเที่ยง'
  },
  {
    min: 34, max: 37,
    level: 'danger',
    label: 'อันตราย',
    desc: 'ความเสี่ยงสูงต่อความเครียดจากความร้อน แรงงานกลางแจ้งและผู้สูงอายุควรหยุดพักในที่ร่มบ่อยครั้ง'
  },
  {
    min: 38, max: 41,
    level: 'critical',
    label: 'อันตรายมาก',
    desc: 'ควรหลีกเลี่ยงการอยู่กลางแจ้ง อันตรายต่อกลุ่มเสี่ยงทุกคน เปิดเครื่องปรับอากาศหรือไปอยู่ในที่เย็น'
  },
  {
    min: 42, max: 50,
    level: 'extreme',
    label: 'อันตรายรุนแรง',
    desc: 'อันตรายรุนแรงต่อทุกคน! หลีกเลี่ยงการอยู่กลางแจ้งโดยเด็ดขาด ดูแลผู้สูงอายุและเด็กอย่างใกล้ชิด โทรขอความช่วยเหลือหากมีอาการผิดปกติ'
  }
];

function getRiskLevel(temp) {
  return RISK_LEVELS.find(r => temp >= r.min && temp <= r.max) || RISK_LEVELS[RISK_LEVELS.length - 1];
}

function initTempWidget() {
  const slider    = $('#temp-slider');
  const indicator = $('#temp-indicator');
  const valEl     = $('#temp-val');
  const riskEl    = $('#temp-risk');
  const descEl    = $('#temp-desc');

  if (!slider || !indicator || !valEl || !riskEl || !descEl) return;

  function update() {
    const temp = parseInt(slider.value, 10);
    const min  = parseInt(slider.min, 10);
    const max  = parseInt(slider.max, 10);
    const pct  = ((temp - min) / (max - min)) * 100;

    const risk = getRiskLevel(temp);

    // Move indicator along the gradient track
    indicator.style.left = `${pct}%`;

    // Update display text
    valEl.textContent  = `${temp}°C`;
    riskEl.textContent = risk.label;
    descEl.textContent = risk.desc;

    // Update data-level for CSS color theming
    valEl.dataset.level  = risk.level;
    riskEl.dataset.level = risk.level;

    // Update accessible value text
    slider.setAttribute('aria-valuenow', temp);
    slider.setAttribute('aria-valuetext', `${temp} องศา — ${risk.label}`);
  }

  slider.addEventListener('input', update);
  slider.addEventListener('change', update); // handles keyboard + mouse-up

  // Run once on load to sync display with initial value
  update();
}

/* =========================================================================
   LIVE KHON KAEN DATA
   Fetches Open-Meteo Forecast + Air Quality APIs in parallel (no key needed).
   Coordinates: 16.44°N 102.82°E  Timezone: Asia/Bangkok
   ========================================================================= */

// Pull URLs from config.js; fall back to inline literals if config is absent
const _cfg = (typeof window !== 'undefined' && window.HSKK_CONFIG) || {};

const LIVE_WEATHER_URL = _cfg.weatherUrl ||
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=16.44&longitude=102.82' +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,weather_code' +
  '&hourly=temperature_2m&forecast_hours=24' +
  '&timezone=Asia%2FBangkok';

const LIVE_AQ_URL = _cfg.airQualityUrl ||
  'https://air-quality-api.open-meteo.com/v1/air-quality' +
  '?latitude=16.44&longitude=102.82' +
  '&current=pm2_5,us_aqi' +
  '&timezone=Asia%2FBangkok';

const LIVE_REFRESH_MS = 10 * 60 * 1000; // 10 minutes

/* ── Threshold helpers ───────────────────────────────────────────────────── */

function tempColor(t) {
  if (t == null) return '#64748B';
  if (t < 25)   return '#1E3A8A';
  if (t < 30)   return '#22D3EE';
  if (t < 34)   return '#FACC15';
  if (t < 37)   return '#FB923C';
  return              '#EF4444';
}

function thresholdInfo(value, ranges) {
  // ranges: [{max, label, color}] ordered low→high; last entry has no max
  for (const r of ranges) {
    if (r.max == null || value <= r.max) return r;
  }
  return ranges[ranges.length - 1];
}

const UV_RANGES = [
  { max: 2,  label: 'ต่ำ',     color: '#22C55E' },
  { max: 5,  label: 'ปานกลาง', color: '#FACC15' },
  { max: 7,  label: 'สูง',     color: '#FB923C' },
  { max: 10, label: 'สูงมาก',  color: '#EF4444' },
  { max: null, label: 'อันตราย', color: '#B91C1C' }
];

const PM25_RANGES = [
  { max: 25,  label: 'ดีมาก',                  color: '#22C55E' },
  { max: 37,  label: 'ดี',                      color: '#86EFAC' },
  { max: 50,  label: 'ปานกลาง',                 color: '#FACC15' },
  { max: 90,  label: 'เริ่มมีผลต่อสุขภาพ',       color: '#FB923C' },
  { max: null, label: 'มีผลต่อสุขภาพ',          color: '#EF4444' }
];

/* Neutral blue-ish color for humidity/wind (not thermal) */
const HUMIDITY_COLOR = '#38BDF8';
const WIND_COLOR     = '#94A3B8';

/* ── Count-up animation ──────────────────────────────────────────────────── */
function animateCountUp(el, toValue, decimals, duration) {
  if (prefersReducedMotion || toValue == null || isNaN(toValue)) return;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = toValue * eased;
    el.textContent = decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = decimals > 0 ? toValue.toFixed(decimals) : String(Math.round(toValue));
  }
  requestAnimationFrame(step);
}

/* ── Card update helper ──────────────────────────────────────────────────── */
function setCard(idSuffix, value, unit, subText, color) {
  const valEl  = document.getElementById(`lc-${idSuffix}-val`);
  const subEl  = document.getElementById(`lc-${idSuffix}-sub`);
  const barEl  = document.getElementById(`lc-${idSuffix}-bar`);
  const cardEl = document.getElementById(`lc-${idSuffix}`);

  if (valEl) {
    if (value != null) {
      const num = parseFloat(value);
      const decimals = String(value).includes('.') ? String(value).split('.')[1].length : 0;
      if (!prefersReducedMotion && !isNaN(num)) {
        animateCountUp(valEl, num, decimals, 600);
      } else {
        valEl.textContent = value;
      }
    } else {
      valEl.textContent = '—';
    }
  }
  if (subEl)  { subEl.textContent  = subText || ''; }
  if (barEl)  { barEl.style.background = color; }
  if (cardEl) {
    const ddEl = cardEl.querySelector('.live-card-val');
    if (ddEl) ddEl.style.color = color;
  }
}

/* ── Sparkline ───────────────────────────────────────────────────────────── */
function renderSparkline(times, temps) {
  const svg = document.getElementById('sparkline');
  const xLabels = document.getElementById('sparkline-x');
  if (!svg || !times || !temps || temps.length < 2) return;

  const W = 600, H = 90, PAD = { t: 10, r: 8, b: 14, l: 8 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const validTemps = temps.map(Number).filter(isFinite);
  const minT = Math.min(...validTemps);
  const maxT = Math.max(...validTemps);
  const rangeT = maxT - minT || 1;

  // Map data → SVG coords
  const pts = temps.map((t, i) => ({
    x: PAD.l + (i / (temps.length - 1)) * innerW,
    y: PAD.t + innerH - ((Number(t) - minT) / rangeT) * innerH,
    t: Number(t)
  }));

  const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Area fill polygon (close below the line)
  const areaPoints =
    `${PAD.l},${PAD.t + innerH} ` +
    polyPoints +
    ` ${PAD.l + innerW},${PAD.t + innerH}`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="spkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#22D3EE"/>
        <stop offset="35%"  stop-color="#FACC15"/>
        <stop offset="65%"  stop-color="#FB923C"/>
        <stop offset="100%" stop-color="#EF4444"/>
      </linearGradient>
      <linearGradient id="spkAreaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#22D3EE" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#EF4444" stop-opacity="0.08"/>
      </linearGradient>
    </defs>
    <polygon points="${areaPoints}" fill="url(#spkAreaGrad)"/>
    <polyline
      points="${polyPoints}"
      fill="none"
      stroke="url(#spkGrad)"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    ${pts.filter((_,i) => i === 0 || i === pts.length-1 || i % 6 === 0).map(p =>
      `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3"
               fill="${tempColor(p.t)}" stroke="#0B0F1A" stroke-width="1.5"/>`
    ).join('')}
  `;

  // X-axis hour labels (show ~5 labels)
  if (xLabels && times.length) {
    const step = Math.floor((times.length - 1) / 4);
    const labelIdxs = [0, step, step*2, step*3, times.length - 1];
    xLabels.innerHTML = labelIdxs.map(i => {
      const d = new Date(times[i]);
      const hh = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' });
      return `<span>${hh}</span>`;
    }).join('');
  }
}

/* ── Render the full panel ───────────────────────────────────────────────── */
function renderLivePanel(weather, airQuality) {
  const panel     = document.getElementById('live-panel');
  const tsEl      = document.getElementById('live-timestamp');
  if (!panel) return;

  const cur = weather?.current   || {};
  const aq  = airQuality?.current || {};
  const hourly = weather?.hourly  || {};

  // Temperature
  const temp   = cur.temperature_2m     != null ? Number(cur.temperature_2m)    : null;
  const feels  = cur.apparent_temperature != null ? Number(cur.apparent_temperature) : null;
  const humid  = cur.relative_humidity_2m != null ? Number(cur.relative_humidity_2m) : null;
  const wind   = cur.wind_speed_10m      != null ? Math.round(Number(cur.wind_speed_10m)) : null;
  const uv     = cur.uv_index            != null ? Number(cur.uv_index)           : null;
  const pm25   = aq.pm2_5               != null ? Number(aq.pm2_5)               : null;

  const uvInfo   = uv    != null ? thresholdInfo(uv,    UV_RANGES)   : { label: 'ไม่มีข้อมูล', color: '#64748B' };
  const pm25Info = pm25  != null ? thresholdInfo(pm25,  PM25_RANGES) : { label: 'ไม่มีข้อมูล', color: '#64748B' };

  // Temperature card
  setCard('temp',
    temp != null  ? temp.toFixed(1) : null,
    '°C', 'ขอนแก่น', tempColor(temp));

  // Feels like card
  setCard('feels',
    feels != null ? feels.toFixed(1) : null,
    '°C', 'ดัชนีความร้อน', tempColor(feels));

  // Humidity card
  setCard('humidity',
    humid != null ? Math.round(humid) : null,
    '%', 'ความชื้นสัมพัทธ์', HUMIDITY_COLOR);

  // Wind card
  setCard('wind',
    wind != null ? wind : null,
    'km/h', 'ความเร็วลม', WIND_COLOR);

  // UV card
  setCard('uv',
    uv != null ? uv.toFixed(1) : null,
    '', uvInfo.label, uvInfo.color);

  // PM2.5 card
  setCard('pm25',
    pm25 != null ? String(Math.round(pm25)) : null,
    'µg/m³', pm25Info.label, pm25Info.color);

  // Sparkline
  if (hourly.time?.length && hourly.temperature_2m?.length) {
    if (!prefersReducedMotion) {
      renderSparkline(hourly.time, hourly.temperature_2m);
    } else {
      // Reduced motion: text summary instead
      const first = hourly.temperature_2m[0];
      const last  = hourly.temperature_2m[hourly.temperature_2m.length - 1];
      const spk   = document.getElementById('sparkline');
      if (spk) {
        spk.innerHTML = `<text x="300" y="50" text-anchor="middle"
          font-family="Noto Sans Thai,sans-serif" font-size="14" fill="#94A3B8">
          ช่วง 24 ชม.: ${Number(first).toFixed(1)}°C → ${Number(last).toFixed(1)}°C
        </text>`;
      }
    }
  }

  // Timestamp
  if (tsEl) {
    const now = new Date();
    tsEl.textContent = 'อัปเดตล่าสุด: ' + now.toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: false
    }) + ' น.';
  }

  panel.hidden = false;
}

/* ── Fetch both endpoints in parallel ────────────────────────────────────── */
async function fetchLiveData() {
  const loadingEl = document.getElementById('live-loading');
  const errorEl   = document.getElementById('live-error');
  const panelEl   = document.getElementById('live-panel');

  if (loadingEl) loadingEl.hidden = false;
  if (errorEl)   errorEl.hidden   = true;
  if (panelEl)   panelEl.hidden   = true;

  console.log('[live data] Fetching:', LIVE_WEATHER_URL, LIVE_AQ_URL);

  const [wResult, aqResult] = await Promise.allSettled([
    fetch(LIVE_WEATHER_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (d.error) throw new Error(d.reason || 'Open-Meteo forecast error'); return d; }),

    fetch(LIVE_AQ_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => { if (d.error) throw new Error(d.reason || 'Open-Meteo air quality error'); return d; })
  ]);

  if (wResult.status  === 'rejected') console.error('[live data] forecast failed:', wResult.reason);
  if (aqResult.status === 'rejected') console.error('[live data] air quality failed:', aqResult.reason);

  const weather    = wResult.status  === 'fulfilled' ? wResult.value  : null;
  const airQuality = aqResult.status === 'fulfilled' ? aqResult.value : null;

  console.log('[live data] weather:', weather, 'air quality:', airQuality);

  if (loadingEl) loadingEl.hidden = true;

  if (!weather && !airQuality) {
    if (errorEl) errorEl.hidden = false;
    return;
  }

  renderLivePanel(weather, airQuality);
}

function initLiveData() {
  fetchLiveData();

  // Retry button
  const retryBtn = document.getElementById('live-retry');
  if (retryBtn) retryBtn.addEventListener('click', fetchLiveData);

  // Auto-refresh every 10 minutes
  setInterval(fetchLiveData, LIVE_REFRESH_MS);
}

/* =========================================================================
   SATELLITE MAP
   MapLibre GL JS · sources & layer definitions from config.js (HSKK_CONFIG).
   ========================================================================= */

/* Return YYYY-MM-DD for the first day of the previous month — used as the
   TIME parameter for NASA GIBS WMTS (products ship ~1 month after capture). */
function prevMonthDate() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/* Expand a layer's tileTemplate (has {DATE} placeholder) once at startup. */
function resolveTiles(layerDef) {
  if (layerDef.tileTemplate) {
    return [layerDef.tileTemplate.replace('{DATE}', prevMonthDate())];
  }
  return layerDef.tiles || [];
}

function initSatelliteMap() {
  if (typeof maplibregl === 'undefined') {
    console.warn('[satellite map] MapLibre GL JS not loaded.');
    return;
  }

  const cfg = window.HSKK_CONFIG;
  if (!cfg) { console.warn('[satellite map] config.js not loaded.'); return; }

  const loc    = cfg.loc;
  const layers = cfg.layers;

  /* Build MapLibre sources + layer list from config */
  const sources = {};
  const mapLayers = [];

  /* Define the display order; only raster layers go into the map */
  const LAYER_ORDER = [
    'osm', 'esriRelief', 'esriSatellite',
    'sentinel2_2016', 'sentinel2_2024',
    'nasaTrueColor', 'modisLST', 'tmdForecast'
  ];

  LAYER_ORDER.forEach(id => {
    const def = layers[id];
    if (!def || def.sourceType !== 'raster') return;

    const tiles = resolveTiles(def);
    sources[id] = {
      type: 'raster',
      tiles,
      tileSize: def.tileSize || 256,
      maxzoom:  def.maxzoom  || 18,
      attribution: def.attribution || ''
    };

    mapLayers.push({
      id,
      type: 'raster',
      source: id,
      layout: { visibility: id === 'sentinel2_2024' ? 'visible' : 'none' }
    });
  });

  /* Also register terrain DEM source (not a visible layer — used for 3D) */
  if (layers.awsTerrain) {
    sources['aws-terrain'] = {
      type:     'raster-dem',
      tiles:    layers.awsTerrain.tiles,
      tileSize: layers.awsTerrain.tileSize || 256,
      encoding: layers.awsTerrain.encoding || 'terrarium',
      attribution: layers.awsTerrain.attribution || ''
    };
  }

  /* Initialise map */
  const map = new maplibregl.Map({
    container: 'satellite-map-el',
    style: {
      version: 8,
      glyphs: cfg.glyphsUrl || 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources,
      layers: mapLayers
    },
    center:    [loc.lng, loc.lat],
    zoom:      loc.zoom,
    maxZoom:   18,
    minZoom:   5,
    attributionControl: { compact: true }
  });

  /* Navigation controls (zoom +/−, compass) */
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), 'top-right');

  /* Khon Kaen centre marker */
  new maplibregl.Marker({ color: '#EF4444', scale: 1.1 })
    .setLngLat([loc.lng, loc.lat])
    .setPopup(
      new maplibregl.Popup({ offset: 28, closeButton: false })
        .setHTML('<strong>ขอนแก่น</strong><br>16.44°N 102.82°E')
    )
    .addTo(map);

  /* ── Layer switcher buttons ─────────────────────────────────────────── */
  const layerBtns  = $$('[data-map-layer]');
  const labelEl    = document.getElementById('map-layer-label');

  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.mapLayer;
      const layerDef = layers[target];

      LAYER_ORDER.forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', id === target ? 'visible' : 'none');
        }
      });

      layerBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });

      if (labelEl && layerDef) labelEl.textContent = layerDef.label || target;
    });
  });
}

/* =========================================================================
   SUPABASE CLIENT HELPER
   Only initialised when url + anonKey are populated in config.js.
   The @supabase/supabase-js CDN script in index.html must be uncommented first.
   ========================================================================= */
function initSupabase() {
  const sbCfg = window.HSKK_CONFIG?.supabase;
  if (!sbCfg?.url || !sbCfg?.anonKey) return null; // not configured yet
  if (typeof supabase === 'undefined') {
    console.warn('[supabase] CDN script not loaded — uncomment it in index.html');
    return null;
  }
  return supabase.createClient(sbCfg.url, sbCfg.anonKey);
}

// Exposed on window so other scripts can use the same singleton
window.hskk_supabase = null;

/* =========================================================================
   INIT — run all features on DOMContentLoaded
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initScrollSpy();
  initComparisonToggle();
  initBackToTop();
  initTempWidget();
  initLiveData();
  initSatelliteMap();
  window.hskk_supabase = initSupabase();
});
