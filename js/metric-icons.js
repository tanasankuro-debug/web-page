'use strict';
/* =============================================================================
   Heat Safe Khon Kaen — metric-icons.js
   Custom SVG stat icons for numeric metric cards.
   No emoji. Stroke-based, 24×24 viewBox. Matches weather-icons.js style.

   Public API:
     getMetricIcon(key) → SVG string (aria-labelled)

   Keys: "precip" | "wind" | "gust" | "humidity"
   ============================================================================= */

/* ── SVG wrapper ─────────────────────────────────────────────────────────── */
function _mi(label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    class="mi-icon" role="img" aria-label="${label}" focusable="false"
    fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

/* ── Colour constants ─────────────────────────────────────────────────────── */
const MC = {
  precip:   '#60A5FA',   /* blue-400  — matches rain drops in weather-icons  */
  wind:     '#94A3B8',   /* slate-400 — neutral, calm                        */
  gust:     '#CBD5E1',   /* slate-300 — brighter/more intense than wind      */
  humidity: '#38BDF8',   /* sky-400   — matches humidity in live.js          */
};

/* ── Icon definitions ─────────────────────────────────────────────────────── */
const _MI = {

  /* ── Precip: teardrop + 2 diagonal motion lines above ───────────────────
     Motion lines animate downward (mi-fall). Drop is narrower than humidity. */
  precip: () => _mi('ปริมาณฝน',
    `<line class="mi-fall"      x1="8.5"  y1="2"   x2="8"   y2="5.5"
           stroke="${MC.precip}" stroke-width="1.7"/>
     <line class="mi-fall mi-fall--d2" x1="13.5" y1="1"   x2="13"  y2="4.5"
           stroke="${MC.precip}" stroke-width="1.7"/>
     <path d="M12 6C9.5 9.5 7 13 7 16.5a5 5 0 0 0 10 0C17 13 14.5 9.5 12 6z"
           stroke="${MC.precip}" stroke-width="1.7"/>`
  ),

  /* ── Wind: 3 flowing lines, top one has classic wind curl to the left ────
     All lines animate with a slow left-right drift (mi-drift).              */
  wind: () => _mi('ความเร็วลม',
    `<g class="mi-wind-lines" stroke="${MC.wind}" stroke-width="1.7">
       <path d="M3 8L15.5 8A2.5 2.5 0 0 0 13 5.5"/>
       <line x1="3" y1="13" x2="18.5" y2="13"/>
       <line x1="3" y1="18" x2="14"   y2="18"/>
     </g>`
  ),

  /* ── Gust: 4 lines (denser than wind) + faster drift animation ──────────
     Extra line + tighter spacing signals more force than wind.               */
  gust: () => _mi('ลมกระโชก',
    `<g class="mi-gust-lines" stroke="${MC.gust}" stroke-width="1.7">
       <path d="M2 6.5L14 6.5A2.5 2.5 0 0 0 11.5 4"/>
       <line x1="2" y1="10.5" x2="17"  y2="10.5"/>
       <line x1="2" y1="14.5" x2="13"  y2="14.5"/>
       <line x1="2" y1="18.5" x2="9.5" y2="18.5"/>
     </g>`
  ),

  /* ── Humidity: fuller rounder drop (wider than precip, no motion lines) ──
     Drop gently pulses in scale (mi-pulse-drop).                            */
  humidity: () => _mi('ความชื้น',
    `<path class="mi-drop--hum"
           d="M12 3.5C9 8 5 13 5 17a7 7 0 0 0 14 0C19 13 15 8 12 3.5z"
           stroke="${MC.humidity}" stroke-width="1.7"/>`
  ),
};

/* ── Public API ──────────────────────────────────────────────────────────── */
window.getMetricIcon = function (key) {
  const fn = _MI[key];
  return fn ? fn() : '';
};
