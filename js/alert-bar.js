/* ==========================================================================
   Heat Safe Khon Kaen — alert-bar.js
   Global hazard alert bar — injected on every page after site-header.
   Fetches: apparent_temperature + precipitation_probability (Open-Meteo)
            pm2_5 (Open-Meteo Air Quality)
   Thresholds: Thai standards (กรมคพ. PM2.5 / Heat Index)
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

  /* ── Classify into alert ─────────────────────────────────────────────── */
  function classify(apparent, pm25, rainProb, groups) {
    var vuln = isVulnerable(groups);

    /* Thresholds (วัดจากดัชนีความร้อน + กรมคพ.) */
    var heatRed = vuln ? 37 : 41;
    var heatYel = vuln ? 32 : 37;
    var pmRed   = vuln ? 37 : 75;
    var pmYel   = vuln ? 25 : 37;

    var alerts = [];

    if (apparent != null) {
      if (apparent >= heatRed)
        alerts.push({ level: 2, type: 'heat', page: 'heat.html',
          msg: '🔴 ดัชนีความร้อนอันตราย ' + Math.round(apparent) + '°C — หลีกเลี่ยงออกแดดโดยเด็ดขาด',
          color: '#fca5a5', bg: 'rgba(127,29,29,0.97)' });
      else if (apparent >= heatYel)
        alerts.push({ level: 1, type: 'heat', page: 'heat.html',
          msg: '🟠 ความร้อนสูง ' + Math.round(apparent) + '°C — ดื่มน้ำบ่อย ลดกิจกรรมกลางแจ้ง',
          color: '#fdba74', bg: 'rgba(67,20,7,0.97)' });
    }

    if (pm25 != null) {
      if (pm25 >= pmRed)
        alerts.push({ level: 2, type: 'pm25', page: 'dust.html',
          msg: '🔴 ฝุ่น PM2.5 อันตราย ' + Math.round(pm25) + ' µg/m³ — ห้ามออกนอกบ้าน สวม N95',
          color: '#fca5a5', bg: 'rgba(127,29,29,0.97)' });
      else if (pm25 >= pmYel)
        alerts.push({ level: 1, type: 'pm25', page: 'dust.html',
          msg: '🟠 ฝุ่น PM2.5 เกินเกณฑ์ ' + Math.round(pm25) + ' µg/m³ — สวมหน้ากาก N95 กลางแจ้ง',
          color: '#fdba74', bg: 'rgba(67,20,7,0.97)' });
    }

    if (rainProb != null && rainProb >= 70)
      alerts.push({ level: 1, type: 'rain', page: 'rain.html',
        msg: '🔵 โอกาสฝน ' + Math.round(rainProb) + '% — พกร่ม ระวังน้ำท่วมขัง',
        color: '#93c5fd', bg: 'rgba(12,37,85,0.97)' });

    /* Return most severe */
    alerts.sort(function (a, b) { return b.level - a.level; });
    return alerts[0] || null;
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
        'display:flex;align-items:center;gap:0.5rem;' +
        'padding:0.38rem 1rem;' +
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;' +
        'font-size:0.78rem;line-height:1.4;' +
        'position:sticky;top:0;z-index:1500;' +
      '}' +
      '#hskk-alert-bar a.hskk-ab-link{' +
        'flex:1;color:inherit;text-decoration:none;' +
      '}' +
      '#hskk-alert-bar a.hskk-ab-link:hover{text-decoration:underline}' +
      '.hskk-ab-close{' +
        'flex-shrink:0;width:22px;height:22px;margin-left:auto;' +
        'background:none;border:none;cursor:pointer;color:inherit;' +
        'opacity:0.6;display:flex;align-items:center;justify-content:center;' +
        'border-radius:4px;padding:0;transition:opacity 0.15s;' +
      '}' +
      '.hskk-ab-close:hover{opacity:1}' +
      '@media(max-width:600px){' +
        '#hskk-alert-bar{font-size:0.72rem;padding:0.38rem 0.75rem}' +
      '}';
    document.head.appendChild(s);
  }

  function render(alert) {
    var dismissKey = alert.level + ':' + alert.type;
    if (localStorage.getItem(DISMISS_KEY) === dismissKey) return;

    injectStyle();

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.setAttribute('role', 'alert');
    bar.style.cssText = 'background:' + alert.bg + ';color:' + alert.color + ';';

    bar.innerHTML =
      '<a href="' + resolvePage(alert.page) + '" class="hskk-ab-link">' + alert.msg + '</a>' +
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
      bar.style.transition = 'opacity 0.2s';
      bar.style.opacity = '0';
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
