/* ==========================================================================
   Heat Safe Khon Kaen — alert-bar.js
   Global hazard alert bar — injected on every page after site-header.
   Fetches: apparent_temperature + precipitation_probability (Open-Meteo)
            pm2_5 (Open-Meteo Air Quality)
   Thresholds: Thai standards (กรมคพ. PM2.5 / Heat Index) — unchanged.
   Visuals: icon chips reuse the same line-art icons as the header nav
            (heat / pm25 / storm) so the bar reads as part of the same
            system, with a stronger gradient + glow treatment and a
            slow pulse on urgent (danger-tier heat/PM2.5, and rain ≥70%).
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
    rain: '<path d="M13 31A13 13 0 1 1 31 18.5h3a8 8 0 0 1 5 14"/><path d="M11 39l-2 7"/><path d="M22 38l-2 8"/><path d="M38 27l-5 8h6l-5 8"/>'
  };

  function iconSvg(name) {
    return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  /* ── Per-type / per-severity visual treatment ────────────────────────── */
  var THEME = {
    'heat:2': { accent: '#fca5a5', glow: 'rgba(248,113,113,.5)',  bg: 'linear-gradient(120deg,rgba(127,29,29,.97),rgba(153,27,27,.92))',  chip: 'rgba(248,113,113,.18)', urgent: true  },
    'heat:1': { accent: '#fdba74', glow: 'rgba(251,146,60,.35)',  bg: 'linear-gradient(120deg,rgba(67,20,7,.97),rgba(124,45,18,.9))',     chip: 'rgba(251,146,60,.16)',  urgent: false },
    'pm25:2': { accent: '#d8b4fe', glow: 'rgba(192,132,252,.5)',  bg: 'linear-gradient(120deg,rgba(59,7,100,.97),rgba(88,28,135,.92))',   chip: 'rgba(192,132,252,.18)', urgent: true  },
    'pm25:1': { accent: '#e9d5ff', glow: 'rgba(216,180,254,.35)', bg: 'linear-gradient(120deg,rgba(46,16,101,.95),rgba(76,29,149,.88))',  chip: 'rgba(216,180,254,.16)', urgent: false },
    'rain:1': { accent: '#7dd3fc', glow: 'rgba(56,189,248,.5)',   bg: 'linear-gradient(120deg,rgba(7,44,84,.97),rgba(3,74,110,.92))',     chip: 'rgba(56,189,248,.18)',  urgent: true  }
  };

  /* ── Classify into alert (thresholds unchanged) ──────────────────────── */
  function classify(apparent, pm25, rainProb, groups) {
    var vuln = isVulnerable(groups);

    var heatRed = vuln ? 37 : 41;
    var heatYel = vuln ? 32 : 37;
    var pmRed   = vuln ? 37 : 75;
    var pmYel   = vuln ? 25 : 37;

    var alerts = [];

    if (apparent != null) {
      if (apparent >= heatRed)
        alerts.push({ level: 2, type: 'heat', page: 'heat.html', icon: 'heat',
          title: 'ดัชนีความร้อนอันตราย', detail: Math.round(apparent) + '°C — หลีกเลี่ยงออกแดดโดยเด็ดขาด' });
      else if (apparent >= heatYel)
        alerts.push({ level: 1, type: 'heat', page: 'heat.html', icon: 'heat',
          title: 'ความร้อนสูง', detail: Math.round(apparent) + '°C — ดื่มน้ำบ่อย ลดกิจกรรมกลางแจ้ง' });
    }

    if (pm25 != null) {
      if (pm25 >= pmRed)
        alerts.push({ level: 2, type: 'pm25', page: 'dust.html', icon: 'pm25',
          title: 'ฝุ่น PM2.5 อันตราย', detail: Math.round(pm25) + ' µg/m³ — ห้ามออกนอกบ้าน สวม N95' });
      else if (pm25 >= pmYel)
        alerts.push({ level: 1, type: 'pm25', page: 'dust.html', icon: 'pm25',
          title: 'ฝุ่น PM2.5 เกินเกณฑ์', detail: Math.round(pm25) + ' µg/m³ — สวมหน้ากาก N95 กลางแจ้ง' });
    }

    if (rainProb != null && rainProb >= 70)
      alerts.push({ level: 1, type: 'rain', page: 'rain.html', icon: 'rain',
        title: 'โอกาสฝนสูง', detail: Math.round(rainProb) + '% — พกร่ม ระวังน้ำท่วมขัง' });

    /* Return most severe (unchanged priority rule) */
    alerts.sort(function (a, b) { return b.level - a.level; });
    var picked = alerts[0] || null;
    if (picked) {
      var theme = THEME[picked.type + ':' + picked.level] || THEME['rain:1'];
      for (var k in theme) picked[k] = theme[k];
    }
    return picked;
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
      '#hskk-alert-bar{' +
        'display:flex;align-items:center;gap:0.7rem;' +
        'padding:0.55rem 1.1rem;' +
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;' +
        'font-size:0.82rem;line-height:1.35;' +
        'position:sticky;top:0;z-index:1500;' +
        'border-bottom:1px solid rgba(255,255,255,0.12);' +
        'animation:hskk-ab-slide .35s cubic-bezier(.16,1,.3,1);' +
      '}' +
      '@keyframes hskk-ab-slide{from{transform:translateY(-100%)}to{transform:translateY(0)}}' +
      '.hskk-ab-chip{' +
        'flex-shrink:0;width:34px;height:34px;border-radius:10px;' +
        'display:flex;align-items:center;justify-content:center;' +
        'position:relative;' +
      '}' +
      '.hskk-ab-chip svg{width:19px;height:19px;position:relative;z-index:1}' +
      '.hskk-ab-chip::before{' +
        'content:"";position:absolute;inset:0;border-radius:10px;' +
        'background:inherit;opacity:0.9;' +
      '}' +
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
      '.hskk-ab-body{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:baseline;gap:0 0.5rem}' +
      '.hskk-ab-title{' +
        'font-family:\'Barlow Condensed\',\'Noto Sans Thai\',sans-serif;' +
        'font-weight:700;font-size:1rem;letter-spacing:0.02em;' +
        'text-transform:uppercase;color:#fff;white-space:nowrap;' +
      '}' +
      '.hskk-ab-detail{opacity:0.92;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '#hskk-alert-bar a.hskk-ab-link{' +
        'flex:1;min-width:0;display:flex;align-items:center;gap:0.7rem;' +
        'color:inherit;text-decoration:none;' +
      '}' +
      '#hskk-alert-bar a.hskk-ab-link:hover .hskk-ab-detail{text-decoration:underline}' +
      '.hskk-ab-close{' +
        'flex-shrink:0;width:26px;height:26px;margin-left:0.25rem;' +
        'background:rgba(255,255,255,0.1);border:none;cursor:pointer;color:#fff;' +
        'opacity:0.75;display:flex;align-items:center;justify-content:center;' +
        'border-radius:50%;padding:0;transition:opacity 0.15s,background 0.15s;' +
      '}' +
      '.hskk-ab-close:hover{opacity:1;background:rgba(255,255,255,0.2)}' +
      '@media(max-width:640px){' +
        '#hskk-alert-bar{font-size:0.76rem;padding:0.5rem 0.75rem;gap:0.55rem}' +
        '.hskk-ab-chip{width:30px;height:30px}' +
        '.hskk-ab-chip svg{width:16px;height:16px}' +
        '.hskk-ab-title{font-size:0.9rem}' +
        '.hskk-ab-detail{white-space:normal}' +
      '}' +
      '@media(prefers-reduced-motion:reduce){' +
        '#hskk-alert-bar{animation:none}' +
        '.hskk-ab-chip::after{animation:none;display:none}' +
      '}';
    document.head.appendChild(s);
  }

  function render(alert) {
    var dismissKey = alert.level + ':' + alert.type;
    if (localStorage.getItem(DISMISS_KEY) === dismissKey) return;

    injectStyle();

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = alert.urgent ? 'hskk-ab-urgent' : '';
    bar.setAttribute('role', 'alert');
    bar.style.cssText = 'background:' + alert.bg + ';color:' + alert.accent + ';' +
      'box-shadow:0 6px 24px -6px ' + alert.glow + ';';

    bar.innerHTML =
      '<a href="' + resolvePage(alert.page) + '" class="hskk-ab-link">' +
        '<span class="hskk-ab-chip" style="background:' + alert.chip + ';color:' + alert.accent + '">' +
          iconSvg(alert.icon) +
        '</span>' +
        '<span class="hskk-ab-body">' +
          '<span class="hskk-ab-title">' + alert.title + '</span>' +
          '<span class="hskk-ab-detail">' + alert.detail + '</span>' +
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
