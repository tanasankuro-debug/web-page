/* ==========================================================================
   Heat Safe Khon Kaen — alert-bar.js
   Global hazard alert bar — injected on every page after site-header.
   Shared by ~18 pages (index, heat, dust, rain, flood, prepare-*, ...),
   so all styling/markup lives HERE, not in any individual page's HTML.

   Fetches: apparent_temperature + precipitation_probability (Open-Meteo)
            pm2_5 (Open-Meteo Air Quality)
   Thresholds (whether an alert fires at all, and its priority): Thai
   standards (กรมคพ. PM2.5 / Heat Index) — UNCHANGED from before this pass.
   This pass only redesigns the *visual* system:
     - severity/type-driven CSS custom properties (data-alert-type /
       data-severity attributes select the color theme — see THEME_VARS)
     - PM2.5 gets a real 5-band AQI color gradient computed from the raw
       µg/m³ reading, independent of the yellow/red trigger thresholds
     - motion: animated gradient sweep, per-type icon idle motion, and a
       periodic shimmer — all CSS keyframes, all disabled under
       prefers-reduced-motion
     - flood (น้ำท่วม) gets its color theme wired up for when a flood data
       source exists, but no flood alert can fire today — there is no
       flood-risk metric fetched anywhere in this file.

   Respects hskk-risk-groups from localStorage (set by risk-profile.js)
   ========================================================================== */
'use strict';

(function () {

  var BAR_ID      = 'hskk-alert-bar';
  var DISMISS_KEY = 'hskk-alert-dismissed';

  /* ── Read stored risk groups ──────────────────────────────────────────── */
  function getRiskGroups() {
    try {
      var v = localStorage.getItem('hskk-risk-groups');
      return v ? JSON.parse(v) : ['general'];
    } catch (e) { return ['general']; }
  }

  function isVulnerable(groups) {
    var vuln = ['elderly', 'child', 'respiratory', 'cardiac', 'pregnant'];
    return groups.some(function (g) { return vuln.indexOf(g) !== -1; });
  }

  /* ── Icon line-art (matches header nav-icon--heat / --pm25 / --storm) ──── */
  var ICONS = {
    heat: '<path d="M24 7V4M24 27V30M37 17H34M11 17H14M31 10L33 8M17 10L15 8M31 24L33 26M17 24L15 26"/><circle cx="24" cy="17" r="7"/><path d="M8 37c3-4 5-4 8 0s5 4 8 0 5-4 8 0 5 4 8 0"/><path d="M8 44c3-4 5-4 8 0s5 4 8 0 5-4 8 0 5 4 8 0"/>',
    pm25: '<path d="M6 20h18a5.5 5.5 0 1 0-5-7.5"/><path d="M5 29h24a6 6 0 0 0 0-12h-2"/><path d="M5 37h20"/><path d="M5 44h13"/><circle cx="35" cy="37" r="2" fill="currentColor" stroke="none"/><circle cx="30" cy="44" r="2" fill="currentColor" stroke="none"/><circle cx="42" cy="43" r="2" fill="currentColor" stroke="none"/><circle cx="43" cy="33" r="2" fill="currentColor" stroke="none"/>',
    rain: '<path d="M13 31A13 13 0 1 1 31 18.5h3a8 8 0 0 1 5 14"/><path d="M11 39l-2 7"/><path d="M22 38l-2 8"/><path d="M38 27l-5 8h6l-5 8"/>',
    flood: '<path d="M8 24l16-12 16 12"/><path d="M14 23v9"/><path d="M34 23v9"/><path d="M20 32h8"/><path d="M5 40c3-4 5.5-4 8 0s5 4 8 0 5.5-4 8 0 5 4 8 0"/>'
  };

  function iconSvg(name) {
    return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  /* ── Color theme, centralized as CSS custom properties per
     [data-alert-type][data-severity] combo. Edit ONLY here to re-theme. ──
     --ab-c1 / --ab-c2 : gradient stops (animated between them)
     --ab-accent       : icon / title / value color
     --ab-glow         : box-shadow + icon-pulse glow color               */
  var THEME_CSS =
    /* ── ความร้อน (heat): ส้ม → แดง, ยิ่งรุนแรงยิ่งเข้ม ───────────────── */
    '#hskk-alert-bar[data-alert-type="heat"][data-severity="high"]{' +
      '--ab-c1:#FF6B35;--ab-c2:#E63946;--ab-accent:#FFE4D6;--ab-glow:rgba(255,107,53,.45);' +
    '}' +
    '#hskk-alert-bar[data-alert-type="heat"][data-severity="extreme"]{' +
      '--ab-c1:#E63946;--ab-c2:#7A1425;--ab-accent:#FFD2D2;--ab-glow:rgba(230,57,70,.55);' +
    '}' +
    /* ── ฝุ่น PM2.5: ไล่เฉดตามแถบ AQI จริง (เขียว→เหลือง→ส้ม→แดง→ม่วง) ── */
    '#hskk-alert-bar[data-alert-type="pm25"][data-severity="moderate"]{' +
      '--ab-c1:#FACC15;--ab-c2:#EAB308;--ab-accent:#FEF9C3;--ab-glow:rgba(250,204,21,.4);' +
    '}' +
    '#hskk-alert-bar[data-alert-type="pm25"][data-severity="unhealthy-sensitive"]{' +
      '--ab-c1:#FB923C;--ab-c2:#EA580C;--ab-accent:#FFE8D4;--ab-glow:rgba(251,146,60,.45);' +
    '}' +
    '#hskk-alert-bar[data-alert-type="pm25"][data-severity="unhealthy"]{' +
      '--ab-c1:#EF4444;--ab-c2:#B91C1C;--ab-accent:#FFD9D9;--ab-glow:rgba(239,68,68,.5);' +
    '}' +
    '#hskk-alert-bar[data-alert-type="pm25"][data-severity="hazardous"]{' +
      '--ab-c1:#A855F7;--ab-c2:#6B21A8;--ab-accent:#F1E2FF;--ab-glow:rgba(168,85,247,.55);' +
    '}' +
    /* ── ฝน/พายุ: ฟ้า → เทาเข้ม ───────────────────────────────────────── */
    '#hskk-alert-bar[data-alert-type="rain"][data-severity="high"]{' +
      '--ab-c1:#4A90D9;--ab-c2:#2C3E50;--ab-accent:#DCEBFF;--ab-glow:rgba(74,144,217,.45);' +
    '}' +
    /* ── น้ำท่วม: ฟ้าเข้ม → น้ำเงินเข้ม (ธีมพร้อมใช้ — ยังไม่มีแหล่งข้อมูล
       ระดับน้ำท่วมที่ fetch จริงในไฟล์นี้ จึงยังไม่มีเงื่อนไขใดเรียก type
       นี้ได้ในตอนนี้) ─────────────────────────────────────────────────── */
    '#hskk-alert-bar[data-alert-type="flood"][data-severity="high"]{' +
      '--ab-c1:#0077B6;--ab-c2:#023E8A;--ab-accent:#D6ECFF;--ab-glow:rgba(0,119,182,.5);' +
    '}';

  /* ── PM2.5 AQI color band (visual only — does NOT change whether/when
     the alert fires; that's still governed by pmRed/pmYel below) ──────── */
  function pm25Band(pm25) {
    if (pm25 >= 150.5) return 'hazardous';
    if (pm25 >= 55.5)  return 'unhealthy';
    if (pm25 >= 35.5)  return 'unhealthy-sensitive';
    return 'moderate';
  }

  /* ── Classify into alert (trigger thresholds unchanged) ──────────────── */
  function classify(apparent, pm25, rainProb, groups) {
    var vuln = isVulnerable(groups);

    var heatRed = vuln ? 37 : 41;
    var heatYel = vuln ? 32 : 37;
    var pmRed   = vuln ? 37 : 75;
    var pmYel   = vuln ? 25 : 37;

    var alerts = [];

    if (apparent != null) {
      if (apparent >= heatRed)
        alerts.push({ level: 2, type: 'heat', severity: 'extreme', page: 'heat.html', icon: 'heat',
          title: 'ดัชนีความร้อนอันตราย', value: Math.round(apparent) + '°C',
          advice: 'หลีกเลี่ยงออกแดดโดยเด็ดขาด' });
      else if (apparent >= heatYel)
        alerts.push({ level: 1, type: 'heat', severity: 'high', page: 'heat.html', icon: 'heat',
          title: 'ความร้อนสูง', value: Math.round(apparent) + '°C',
          advice: 'ดื่มน้ำบ่อย ลดกิจกรรมกลางแจ้ง' });
    }

    if (pm25 != null) {
      if (pm25 >= pmRed)
        alerts.push({ level: 2, type: 'pm25', severity: pm25Band(pm25), page: 'dust.html', icon: 'pm25',
          title: 'ฝุ่น PM2.5 อันตราย', value: Math.round(pm25) + ' µg/m³',
          advice: 'ห้ามออกนอกบ้าน สวม N95' });
      else if (pm25 >= pmYel)
        alerts.push({ level: 1, type: 'pm25', severity: pm25Band(pm25), page: 'dust.html', icon: 'pm25',
          title: 'ฝุ่น PM2.5 เกินเกณฑ์', value: Math.round(pm25) + ' µg/m³',
          advice: 'สวมหน้ากาก N95 กลางแจ้ง' });
    }

    if (rainProb != null && rainProb >= 70)
      alerts.push({ level: 1, type: 'rain', severity: 'high', page: 'rain.html', icon: 'rain',
        title: 'โอกาสฝนสูง', value: Math.round(rainProb) + '%',
        advice: 'พกร่ม ระวังน้ำท่วมขัง' });

    /* Return most severe (unchanged priority rule: heat/PM2.5 level-2
       always outranks rain's level-1) */
    alerts.sort(function (a, b) { return b.level - a.level; });
    return alerts[0] || null;
  }

  /* ── Which types/severities get the extra "urgent" motion (icon pulse +
     glow ring) — danger-tier heat/PM2.5, and rain (called out explicitly
     as something that should stay noticeable even though its `level` is
     always 1 for priority-sorting purposes) ───────────────────────────── */
  function isUrgent(alert) {
    if (alert.type === 'rain') return true;
    if (alert.type === 'heat') return alert.severity === 'extreme';
    if (alert.type === 'pm25') return alert.severity === 'unhealthy' || alert.severity === 'hazardous';
    return false;
  }

  /* ── Resolve absolute href (Vercel clean URLs: /heat not /html/heat.html) */
  function resolvePage(page) {
    return '/' + page.replace(/\.html$/, '');
  }

  /* ── Inject once ─────────────────────────────────────────────────────── */
  function injectStyle() {
    if (document.getElementById('hskk-ab-style')) return;
    var s = document.createElement('style');
    s.id = 'hskk-ab-style';
    s.textContent =
      THEME_CSS +
      '#hskk-alert-bar{' +
        'display:flex;align-items:center;gap:0.7rem;' +
        'padding:0.6rem 1.1rem;' +
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;' +
        'font-size:0.82rem;line-height:1.35;color:var(--ab-accent);' +
        'position:sticky;top:0;z-index:1500;overflow:hidden;' +
        'border-bottom:1px solid rgba(255,255,255,0.12);' +
        'background-image:linear-gradient(120deg,var(--ab-c1),var(--ab-c2),var(--ab-c1));' +
        'background-size:220% 220%;' +
        'box-shadow:0 6px 24px -6px var(--ab-glow);' +
        'animation:' +
          'hskk-ab-slide .35s cubic-bezier(.16,1,.3,1),' +
          'hskk-ab-gradient 7s ease infinite;' +
      '}' +
      /* entrance slide-down */
      '@keyframes hskk-ab-slide{from{transform:translateY(-100%)}to{transform:translateY(0)}}' +
      /* slow drifting gradient — the "motion graphic" background */
      '@keyframes hskk-ab-gradient{' +
        '0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}' +
      '}' +
      /* periodic light sweep across the whole bar (fires briefly once per cycle) */
      '#hskk-alert-bar::before{' +
        'content:"";position:absolute;inset:0;pointer-events:none;' +
        'background:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.16) 50%,transparent 60%);' +
        'transform:translateX(-150%);' +
        'animation:hskk-ab-shimmer 5s ease-in-out infinite;' +
      '}' +
      '@keyframes hskk-ab-shimmer{0%,88%{transform:translateX(-150%)}100%{transform:translateX(150%)}}' +

      '.hskk-ab-chip{' +
        'flex-shrink:0;width:34px;height:34px;border-radius:10px;' +
        'display:flex;align-items:center;justify-content:center;' +
        'position:relative;background:rgba(255,255,255,0.14);color:var(--ab-accent);' +
      '}' +
      '.hskk-ab-chip svg{width:19px;height:19px;position:relative;z-index:1}' +
      /* per-type idle icon motion */
      '[data-alert-type="heat"] .hskk-ab-chip svg{animation:hskk-ab-icon-heat 1.7s ease-in-out infinite}' +
      '@keyframes hskk-ab-icon-heat{' +
        '0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 currentColor)}' +
        '50%{transform:scale(1.14);filter:drop-shadow(0 0 5px currentColor)}' +
      '}' +
      '[data-alert-type="rain"] .hskk-ab-chip svg{animation:hskk-ab-icon-rain 2.4s ease-in-out infinite;transform-origin:50% 15%}' +
      '@keyframes hskk-ab-icon-rain{' +
        '0%,100%{transform:rotate(0deg)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}' +
      '}' +
      /* floating dust motes for PM2.5 — small dots drifting up past the icon */
      '.hskk-ab-mote{' +
        'position:absolute;border-radius:50%;background:currentColor;' +
        'width:3px;height:3px;left:50%;bottom:4px;opacity:0;' +
        'animation:hskk-ab-float 3.2s ease-in infinite;' +
      '}' +
      '.hskk-ab-mote:nth-child(2){left:32%;width:2px;height:2px;animation-delay:.6s;animation-duration:2.6s}' +
      '.hskk-ab-mote:nth-child(3){left:68%;width:2.5px;height:2.5px;animation-delay:1.4s;animation-duration:3.6s}' +
      '@keyframes hskk-ab-float{' +
        '0%{transform:translateY(0) translateX(0);opacity:0}' +
        '15%{opacity:.85}' +
        '100%{transform:translateY(-22px) translateX(3px);opacity:0}' +
      '}' +
      /* urgent-only glow ring around the icon chip */
      '#hskk-alert-bar.hskk-ab-urgent .hskk-ab-chip::after{' +
        'content:"";position:absolute;inset:-4px;border-radius:13px;' +
        'border:1.5px solid currentColor;opacity:0.55;' +
        'animation:hskk-ab-pulse 1.8s ease-out infinite;' +
      '}' +
      '@keyframes hskk-ab-pulse{' +
        '0%{transform:scale(0.85);opacity:0.6}' +
        '70%{transform:scale(1.28);opacity:0}' +
        '100%{transform:scale(1.28);opacity:0}' +
      '}' +

      '.hskk-ab-body{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:baseline;column-gap:0.55rem;row-gap:0.1rem;position:relative}' +
      '.hskk-ab-title{' +
        'font-family:\'Barlow Condensed\',\'Noto Sans Thai\',sans-serif;' +
        'font-weight:600;font-size:0.86rem;letter-spacing:0.02em;' +
        'text-transform:uppercase;opacity:0.85;white-space:nowrap;' +
      '}' +
      /* the headline number — biggest, boldest element in the bar */
      '.hskk-ab-value{' +
        'font-family:\'Barlow Condensed\',\'Noto Sans Thai\',sans-serif;' +
        'font-weight:800;font-size:1.35rem;line-height:1;letter-spacing:0.01em;' +
        'white-space:nowrap;color:#fff;' +
      '}' +
      '.hskk-ab-advice{' +
        'flex-basis:100%;opacity:0.82;font-size:0.78rem;' +
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' +
      '}' +
      '#hskk-alert-bar a.hskk-ab-link{' +
        'flex:1;min-width:0;display:flex;align-items:center;gap:0.7rem;position:relative;z-index:1;' +
        'color:inherit;text-decoration:none;' +
      '}' +
      '#hskk-alert-bar a.hskk-ab-link:hover .hskk-ab-advice{text-decoration:underline}' +
      '.hskk-ab-close{' +
        'flex-shrink:0;width:26px;height:26px;margin-left:0.25rem;position:relative;z-index:1;' +
        'background:rgba(255,255,255,0.14);border:none;cursor:pointer;color:#fff;' +
        'opacity:0.8;display:flex;align-items:center;justify-content:center;' +
        'border-radius:50%;padding:0;transition:opacity 0.15s,background 0.15s,transform 0.15s;' +
      '}' +
      '.hskk-ab-close:hover{opacity:1;background:rgba(255,255,255,0.26);transform:scale(1.08)}' +

      '@media(max-width:640px){' +
        '#hskk-alert-bar{font-size:0.76rem;padding:0.5rem 0.75rem;gap:0.55rem}' +
        '.hskk-ab-chip{width:30px;height:30px}' +
        '.hskk-ab-chip svg{width:16px;height:16px}' +
        '.hskk-ab-title{font-size:0.74rem}' +
        '.hskk-ab-value{font-size:1.1rem}' +
      '}' +
      '@media(max-width:480px){' +
        '.hskk-ab-advice{display:none}' +
      '}' +
      '@media(prefers-reduced-motion:reduce){' +
        '#hskk-alert-bar{animation:hskk-ab-slide .35s cubic-bezier(.16,1,.3,1) forwards;background-position:0% 50%}' +
        '#hskk-alert-bar::before{display:none}' +
        '.hskk-ab-chip svg{animation:none!important}' +
        '.hskk-ab-mote{display:none}' +
        '.hskk-ab-chip::after{animation:none;display:none}' +
      '}';
    document.head.appendChild(s);
  }

  function render(alert) {
    var dismissKey = alert.level + ':' + alert.type;
    if (localStorage.getItem(DISMISS_KEY) === dismissKey) return;

    injectStyle();

    var urgent = isUrgent(alert);
    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = urgent ? 'hskk-ab-urgent' : '';
    bar.setAttribute('role', 'alert');
    bar.setAttribute('data-alert-type', alert.type);
    bar.setAttribute('data-severity', alert.severity);

    var motes = alert.type === 'pm25'
      ? '<span class="hskk-ab-mote"></span><span class="hskk-ab-mote"></span><span class="hskk-ab-mote"></span>'
      : '';

    bar.innerHTML =
      '<a href="' + resolvePage(alert.page) + '" class="hskk-ab-link">' +
        '<span class="hskk-ab-chip">' + iconSvg(alert.icon) + motes + '</span>' +
        '<span class="hskk-ab-body">' +
          '<span class="hskk-ab-title">' + alert.title + '</span>' +
          '<span class="hskk-ab-value">' + alert.value + '</span>' +
          '<span class="hskk-ab-advice">' + alert.advice + '</span>' +
        '</span>' +
      '</a>' +
      '<button class="hskk-ab-close" id="hskk-ab-x" aria-label="ปิดการแจ้งเตือน">' +
        '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor"' +
            ' stroke-width="2.3" stroke-linecap="round" aria-hidden="true">' +
          '<line x1="1" y1="1" x2="11" y2="11"/>' +
          '<line x1="11" y1="1" x2="1" y2="11"/>' +
        '</svg>' +
      '</button>';

    /* Insert right after site-header */
    var header = document.getElementById('site-header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(bar, header.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    document.getElementById('hskk-ab-x').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      localStorage.setItem(DISMISS_KEY, dismissKey);
      bar.style.transition = 'opacity 0.2s, transform 0.2s';
      bar.style.opacity = '0';
      bar.style.transform = 'translateY(-100%)';
      setTimeout(function () { if (bar.parentNode) bar.remove(); }, 220);
    });
  }

  /* ── Fetch + show ─────────────────────────────────────────────────────── */
  function init() {
    var cfg = (window.HSKK_CONFIG) || {};
    var lat = (cfg.loc && cfg.loc.lat) || 16.44;
    var lng = (cfg.loc && cfg.loc.lng) || 102.82;

    var wxUrl =
      'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng +
      '&current=apparent_temperature,precipitation_probability&timezone=Asia%2FBangkok';
    var aqUrl =
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + lng +
      '&current=pm2_5&timezone=Asia%2FBangkok';

    var apparent = null, pm25 = null, rain = 0;
    var wxDone = false, aqDone = false;

    function tryShow() {
      if (!wxDone || !aqDone) return;
      var groups = getRiskGroups();
      var alert  = classify(apparent, pm25, rain, groups);
      if (alert) render(alert);
    }

    fetch(wxUrl)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.current) {
          apparent = d.current.apparent_temperature;
          rain     = d.current.precipitation_probability || 0;
        }
        wxDone = true; tryShow();
      })
      .catch(function () { wxDone = true; tryShow(); });

    fetch(aqUrl)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        pm25 = (d && d.current) ? (d.current.pm2_5 || 0) : null;
        aqDone = true; tryShow();
      })
      .catch(function () { aqDone = true; tryShow(); });
  }

  /* ── Public: risk-profile.js calls this when groups change ──────────── */
  window.HSKK_refreshAlertBar = function () {
    var existing = document.getElementById(BAR_ID);
    if (existing) existing.remove();
    localStorage.removeItem(DISMISS_KEY);
    init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
