'use strict';
/* ============================================================================
   Heat Safe Khon Kaen — weather-icons.js
   Custom SVG weather icons. No emoji, no image files.

   Public API:
     getWeatherIcon(wmoCode, isDay) → SVG string (aria-labelled)
     wmoLabel(code)                 → Thai label string
     wmoRisk(code)                  → 'low' | 'medium' | 'high' | 'danger'

   WMO code mapping:
     0        clear
     1–2      partly cloudy
     3        overcast / cloudy
     45, 48   fog
     51–55    drizzle
     61–65    rain (63–65 = heavy)
     71–77    snow
     80–82    showers
     85–86    snow showers
     95–99    thunderstorm
   ============================================================================ */

/* ── Unique ID counter (prevents mask ID collisions across icons on same page) */
let _wid = 0;
const uid = () => 'wm' + (++_wid);

/* ── Colour palette ──────────────────────────────────────────────────────────
   Tuned for dark-navy backgrounds (--bg: #060916 in base.css).             */
const C = {
  sun:   '#FFD43B',           /* sun disc */
  ray:   '#FFBA00',           /* sun rays (slightly deeper for contrast) */
  cDay:  'rgba(203,213,225,0.90)', /* day cloud */
  cBack: 'rgba(148,163,184,0.60)', /* secondary / back cloud */
  cDark: 'rgba(90,106,124,0.94)',  /* storm cloud */
  cNight:'rgba(148,163,184,0.82)', /* night cloud */
  rain:  '#60A5FA',           /* rain drops */
  bolt:  '#FDE047',           /* lightning */
  moon:  '#E2E8F0',           /* crescent moon */
  star:  '#CBD5E1',           /* stars */
  fog:   'rgba(148,163,184,0.48)', /* fog lines */
  snow:  'rgba(186,230,253,0.88)', /* snowflakes */
};

/* ════════════════════════════════════════════════════════════════════════════
   SHAPE HELPERS
   All shapes are sized for a 64×64 viewBox.
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Cloud (main): bottom at y≈48, top peak at y≈18, x span 8–56 ─────────── */
function cldMain(fill, cls) {
  return `<g class="${cls}" fill="${fill}">
    <rect x="10" y="38" width="44" height="10" rx="5"/>
    <ellipse cx="22" cy="36" rx="10" ry="9"/>
    <ellipse cx="33" cy="29" rx="13" ry="11"/>
    <ellipse cx="44" cy="36" rx="9"  ry="8"/>
  </g>`;
}

/* ── Cloud (right-shifted): pairs with sun/moon at upper-left ─────────────── */
function cldRight(fill, cls) {
  return `<g class="${cls}" fill="${fill}">
    <rect x="16" y="40" width="40" height="9" rx="4.5"/>
    <ellipse cx="26" cy="38" rx="9"  ry="8"/>
    <ellipse cx="37" cy="31" rx="12" ry="10"/>
    <ellipse cx="47" cy="38" rx="8"  ry="7"/>
  </g>`;
}

/* ── Cloud (back layer for overcast): sits higher, rendered first ─────────── */
function cldBack(fill) {
  return `<g class="wi-cloud-back" fill="${fill}">
    <rect x="16" y="26" width="38" height="8" rx="4"/>
    <ellipse cx="24" cy="24" rx="9"  ry="8"/>
    <ellipse cx="34" cy="18" rx="11" ry="9"/>
    <ellipse cx="44" cy="24" rx="8"  ry="7"/>
  </g>`;
}

/* ── Sun: rotating rays + centre disc ────────────────────────────────────── */
function sunEl(cx, cy, dr, ri, ro, n = 8) {
  let rays = '';
  for (let i = 0; i < n; i++) {
    const a = (i * 360 / n - 90) * Math.PI / 180;
    const cos = Math.cos(a), sin = Math.sin(a);
    rays += `<line x1="${+(cx + ri*cos).toFixed(2)}" y1="${+(cy + ri*sin).toFixed(2)}"
                   x2="${+(cx + ro*cos).toFixed(2)}" y2="${+(cy + ro*sin).toFixed(2)}"/>`;
  }
  return `<g class="wi-sun-rays" stroke="${C.ray}" stroke-width="2.5"
       stroke-linecap="round" style="transform-origin:${cx}px ${cy}px">
    ${rays}
  </g>
  <circle class="wi-sun-disc" cx="${cx}" cy="${cy}" r="${dr}" fill="${C.sun}"/>`;
}

/* ── Crescent moon (SVG mask cuts a circle from the moon disc) ──────────── */
function moonEl(cx, cy, r) {
  const id  = uid();
  const ox  = +(r * 0.50).toFixed(1);   /* horizontal offset of cutout */
  const oy  = +(r * -0.12).toFixed(1);  /* slight upward offset */
  const cr  = +(r * 0.82).toFixed(1);   /* cutout radius */
  return `<defs><mask id="${id}">
    <rect width="64" height="64" fill="white"/>
    <circle cx="${cx+ox}" cy="${cy+oy}" r="${cr}" fill="black"/>
  </mask></defs>
  <circle class="wi-moon" cx="${cx}" cy="${cy}" r="${r}"
          fill="${C.moon}" mask="url(#${id})"/>`;
}

/* ── Stars: array of [x, y, r, animDelay] ──────────────────────────────── */
function starsEl(pts) {
  return pts.map(([x,y,r,d]) =>
    `<circle class="wi-star" cx="${x}" cy="${y}" r="${r}"
       fill="${C.star}" style="animation-delay:${d}s"/>`
  ).join('');
}

/* ── Rain drops: array of [x, y, animDelay] ─────────────────────────────── */
function rainEl(pts) {
  return pts.map(([x,y,d]) =>
    `<line class="wi-rain-drop"
       x1="${x}" y1="${y}" x2="${x-2.5}" y2="${y+9}"
       stroke="${C.rain}" stroke-width="2.2" stroke-linecap="round"
       style="animation-delay:${d}s"/>`
  ).join('');
}

/* ── Lightning bolt (zigzag) ────────────────────────────────────────────── */
function boltEl(x, y) {
  return `<path class="wi-lightning"
    d="M${x},${y} L${x-4},${y+10} L${x+1},${y+10} L${x-4},${y+20}"
    fill="none" stroke="${C.bolt}" stroke-width="2.8"
    stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* ── Fog lines: array of [x1, x2, y] ───────────────────────────────────── */
function fogEl(lines) {
  return `<g class="wi-fog-lines" stroke="${C.fog}" stroke-linecap="round" stroke-width="2.5">
    ${lines.map(([x1,x2,y]) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`).join('')}
  </g>`;
}

/* ── Snowflakes: array of [x, y, r, animDelay] ─────────────────────────── */
function snowEl(pts) {
  return `<g fill="${C.snow}">
    ${pts.map(([x,y,r,d]) =>
      `<circle class="wi-snow-flake" cx="${x}" cy="${y}" r="${r}"
         style="animation-delay:${d}s"/>`
    ).join('')}
  </g>`;
}

/* ── SVG wrapper ─────────────────────────────────────────────────────────── */
function S(label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
    class="wi-icon" role="img" aria-label="${label}" focusable="false">${body}</svg>`;
}

/* ════════════════════════════════════════════════════════════════════════════
   ICON DEFINITIONS
   Rain drop y-positions start just below the cloud bottom (≈y50 for cldMain,
   ≈y51 for cldRight). CSS animation translates them down 10px while fading.
   ════════════════════════════════════════════════════════════════════════════ */

const ICONS = {

  /* ── Clear sky ─────────────────────────────────────────────────── */
  'clear-day': () => S('แดดจัด ท้องฟ้าแจ่มใส',
    sunEl(32, 32, 11, 15, 22)
  ),

  'clear-night': () => S('กลางคืนท้องฟ้าโปร่ง',
    moonEl(30, 32, 14) +
    starsEl([[12,12,1.5,0],[50,10,1.2,0.55],[55,24,1.0,0.9]])
  ),

  /* ── Partly cloudy ─────────────────────────────────────────────── */
  'partly-cloudy-day': () => S('มีเมฆบางส่วน',
    sunEl(21, 21, 9, 12, 18) +
    cldRight(C.cDay, 'wi-cloud')
  ),

  'partly-cloudy-night': () => S('กลางคืน มีเมฆบางส่วน',
    moonEl(21, 21, 11) +
    cldRight(C.cNight, 'wi-cloud')
  ),

  /* ── Overcast / cloudy ─────────────────────────────────────────── */
  'cloudy': () => S('มีเมฆมาก ท้องฟ้าครึ้ม',
    cldBack(C.cBack) +
    cldMain(C.cDay, 'wi-cloud')
  ),

  /* ── Fog ────────────────────────────────────────────────────────── */
  'fog': () => S('หมอก ทัศนวิสัยต่ำ',
    cldMain(C.cBack, 'wi-cloud') +
    fogEl([[8,42,52],[10,46,57],[12,40,62]])
  ),

  /* ── Drizzle (light showers, 3 drops) ──────────────────────────── */
  'drizzle': () => S('ฝนปรอยเบา',
    cldMain(C.cDay, 'wi-cloud') +
    rainEl([[18,50,0],[30,50,0.22],[42,50,0.10]])
  ),

  /* ── Rain (moderate, 4 drops) ───────────────────────────────────── */
  'rain': () => S('ฝนตก',
    cldMain(C.cDay, 'wi-cloud') +
    rainEl([[16,50,0],[24,50,0.15],[33,50,0.30],[42,50,0.08]])
  ),

  /* ── Heavy rain (5 drops, darker cloud) ────────────────────────── */
  'heavy-rain': () => S('ฝนตกหนัก',
    cldMain(C.cDark, 'wi-cloud') +
    rainEl([[14,50,0],[21,50,0.10],[28,50,0.25],[36,50,0.05],[44,50,0.20]])
  ),

  /* ── Showers day (sun + cloud + rain) ──────────────────────────── */
  'showers-day': () => S('ฝนกระโชก',
    sunEl(18, 18, 7, 10, 14) +
    cldRight(C.cDay, 'wi-cloud') +
    rainEl([[20,51,0],[29,51,0.18],[38,51,0.08],[47,51,0.28]])
  ),

  /* ── Showers night (moon + cloud + rain) ───────────────────────── */
  'showers-night': () => S('ฝนกระโชกกลางคืน',
    moonEl(18, 18, 10) +
    cldRight(C.cNight, 'wi-cloud') +
    rainEl([[20,51,0],[29,51,0.18],[38,51,0.08],[47,51,0.28]])
  ),

  /* ── Thunderstorm (dark cloud + lightning) ──────────────────────── */
  'thunderstorm': () => S('พายุฝนฟ้าคะนอง',
    cldMain(C.cDark, 'wi-cloud') +
    boltEl(33, 48)
  ),

  /* ── Snow (3 snowflake dots) ────────────────────────────────────── */
  'snow': () => S('หิมะ',
    cldMain(C.cDay, 'wi-cloud') +
    snowEl([[18,54,2.2,0],[32,58,2.0,0.30],[46,54,2.2,0.60]])
  ),
};

/* ════════════════════════════════════════════════════════════════════════════
   WMO CODE → ICON KEY
   ════════════════════════════════════════════════════════════════════════════ */
function wmoKey(code, isDay) {
  const c = +code;
  if (c === 0)                    return isDay ? 'clear-day'           : 'clear-night';
  if (c <= 2)                     return isDay ? 'partly-cloudy-day'   : 'partly-cloudy-night';
  if (c === 3)                    return 'cloudy';
  if (c === 45 || c === 48)       return 'fog';
  if (c >= 51 && c <= 55)         return 'drizzle';
  if (c >= 61 && c <= 63)         return 'rain';
  if (c >= 64 && c <= 65)         return 'heavy-rain';
  if (c >= 71 && c <= 77)         return 'snow';
  if (c >= 80 && c <= 82)         return isDay ? 'showers-day' : 'showers-night';
  if (c >= 85 && c <= 86)         return 'snow';
  if (c >= 95 && c <= 99)         return 'thunderstorm';
  return isDay ? 'clear-day' : 'clear-night';
}

/* ════════════════════════════════════════════════════════════════════════════
   PUBLIC API
   ════════════════════════════════════════════════════════════════════════════ */

window.getWeatherIcon = function (code, isDay) {
  const fn = ICONS[wmoKey(code, isDay !== false)];
  return (fn ?? ICONS['clear-day'])();
};

const _LABELS = {
  0:'ท้องฟ้าแจ่มใส', 1:'เมฆบางส่วน', 2:'มีเมฆ', 3:'มีเมฆมาก',
  45:'หมอก', 48:'หมอกน้ำแข็ง',
  51:'ฝนปรอยเบา', 53:'ฝนปรอย', 55:'ฝนปรอยหนัก',
  61:'ฝนเบา', 63:'ฝนปานกลาง', 65:'ฝนหนัก',
  71:'หิมะเบา', 73:'หิมะ', 75:'หิมะหนัก', 77:'หิมะเกล็ด',
  80:'ฝนกระโชก', 81:'ฝนกระโชกหนัก', 82:'ฝนกระโชกรุนแรง',
  85:'หิมะกระโชก', 86:'หิมะกระโชกหนัก',
  95:'พายุฝนฟ้าคะนอง', 96:'พายุรุนแรง + ลูกเห็บ', 99:'พายุรุนแรงมาก',
};
window.wmoLabel = code => _LABELS[+code] ?? 'ไม่มีข้อมูล';

window.wmoRisk = function (code) {
  const c = +code;
  if (c === 0 || c <= 3 || c === 45 || c === 48)        return 'low';
  if ((c >= 51 && c <= 53) || c === 71 || c === 73)     return 'low';
  if ((c >= 54 && c <= 63) || (c >= 80 && c <= 81))     return 'medium';
  if (c === 65 || c === 75 || c >= 85 && c <= 86)        return 'high';
  if (c === 82 || c >= 95)                               return 'danger';
  return 'low';
};
