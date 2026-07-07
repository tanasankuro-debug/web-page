/* ==========================================================================
   Heat Safe Khon Kaen — news-ticker.js  (index.html only)

   Ticker lives INSIDE #site-header as position:absolute; top:100%
   → follows the header automatically, zero gap, no JS top-calculation.
   Content: apparent temperature + PM2.5 + rain probability only.
   ========================================================================== */
'use strict';

(function () {

  var BAR_ID = 'hskk-news-ticker';
  var cfg    = window.HSKK_CONFIG || {};
  var lat    = (cfg.loc && cfg.loc.lat) || 16.44;
  var lng    = (cfg.loc && cfg.loc.lng) || 102.82;

  /* ── Guard: index page only ───────────────────────────────────────────── */
  function isHomePage() {
    var p = location.pathname;
    return p === '/' || p === '/home' || p === '/main' ||
           /\/index\.html$/.test(p) || /\/html\/?$/.test(p);
  }

  /* ── Severity ─────────────────────────────────────────────────────────── */
  var SEV_CLR = ['rgba(148,163,184,0.85)', '#fde68a', '#fdba74', '#fca5a5'];
  var SEV_PFX = ['', '⚠️ ', '🟠 ', '🔴 '];

  /* ── Build items: temp + PM2.5 + rain ONLY ────────────────────────────── */
  function buildItems(temp, pm25, rain) {
    var items = [];

    /* — Temperature — */
    if (temp != null) {
      if (temp >= 41) {
        items.push({ s:3, t:'อุณหภูมิ '+Math.round(temp)+'°C อันตราย — ห้ามออกแดดโดยเด็ดขาด อยู่ในที่แอร์', href:'/heat' });
      } else if (temp >= 33) {
        items.push({ s:2, t:'อากาศร้อนจัด '+Math.round(temp)+'°C — ดื่มน้ำทุก 20 นาที หลีกเลี่ยงแดดช่วง 11–15 น.', href:'/heat' });
      } else if (temp >= 27) {
        items.push({ s:1, t:'อากาศร้อน '+Math.round(temp)+'°C — แนะนำดื่มน้ำบ่อยๆ สวมหมวกเมื่อออกแดด', href:'/heat' });
      } else {
        items.push({ s:0, t:'อุณหภูมิ '+Math.round(temp)+'°C อากาศสบาย เหมาะสำหรับกิจกรรมกลางแจ้ง', href:'/heat' });
      }
    }

    /* — PM2.5 — */
    if (pm25 != null) {
      if (pm25 >= 75) {
        items.push({ s:3, t:'ฝุ่น PM2.5 อันตราย '+Math.round(pm25)+' µg/m³ — สวม N95 หลีกเลี่ยงออกนอกบ้าน', href:'/dust' });
      } else if (pm25 >= 37) {
        items.push({ s:2, t:'ฝุ่น PM2.5 '+Math.round(pm25)+' µg/m³ — กลุ่มเสี่ยงควรสวม N95 กลางแจ้ง', href:'/dust' });
      } else if (pm25 >= 25) {
        items.push({ s:1, t:'ฝุ่น PM2.5 '+Math.round(pm25)+' µg/m³ ปานกลาง — กลุ่มเสี่ยง (เด็ก/ผู้สูงอายุ) ระวัง', href:'/dust' });
      } else {
        items.push({ s:0, t:'ฝุ่น PM2.5 '+Math.round(pm25)+' µg/m³ อยู่ในเกณฑ์ดี', href:'/dust' });
      }
    }

    /* — Rain — */
    if (rain != null) {
      if (rain >= 70) {
        items.push({ s:2, t:'โอกาสฝน '+Math.round(rain)+'% สูง — พกร่ม ระวังน้ำท่วมขัง', href:'/rain' });
      } else if (rain >= 40) {
        items.push({ s:1, t:'โอกาสฝน '+Math.round(rain)+'% — แนะนำพกร่มติดตัว', href:'/rain' });
      } else {
        items.push({ s:0, t:'โอกาสฝน '+Math.round(rain)+'% ท้องฟ้าโดยรวมแจ่มใส', href:'/rain' });
      }
    }

    return items;
  }

  /* ── Inject style ─────────────────────────────────────────────────────── */
  function injectStyle() {
    if (document.getElementById('hskk-ticker-style')) return;
    var s = document.createElement('style');
    s.id = 'hskk-ticker-style';
    s.textContent =

      /* Let site-header show content below its box */
      '#site-header{overflow:visible!important;}' +

      /* Ticker: absolute inside site-header, flush at its bottom edge */
      '#'+BAR_ID+'{' +
        'position:absolute;' +
        'top:100%;left:0;right:0;' +   /* sticks to bottom of site-header */
        'height:34px;' +
        'display:flex;align-items:center;' +
        'overflow:hidden;' +
        'background:rgba(8,12,24,0.97);' +
        'border-top:1px solid rgba(255,255,255,0.07);' +
        'font-family:"Noto Sans Thai",system-ui,sans-serif;' +
        'font-size:0.8rem;margin:0;' +
        'z-index:0;' +    /* inherit site-header stacking context */
      '}' +

      /* Badge */
      '#hskk-nb{' +
        'flex-shrink:0;display:flex;align-items:center;gap:4px;' +
        'padding:0 10px 0 12px;height:100%;align-self:stretch;' +
        'background:#dc2626;color:#fff;' +
        'font-weight:800;font-size:0.62rem;letter-spacing:0.14em;' +
        'text-transform:uppercase;white-space:nowrap;' +
      '}' +
      '#hskk-nb .bd{' +
        'width:5px;height:5px;border-radius:50%;background:#fff;flex-shrink:0;' +
        'animation:hskk-nb-blink 1s step-start infinite;' +
      '}' +
      '@keyframes hskk-nb-blink{0%,100%{opacity:1}50%{opacity:0}}' +

      /* Track */
      '#hskk-nt{' +
        'flex:1;overflow:hidden;height:100%;' +
        '-webkit-mask-image:linear-gradient(to right,transparent,#000 2%,#000 97%,transparent);' +
        'mask-image:linear-gradient(to right,transparent,#000 2%,#000 97%,transparent);' +
      '}' +

      /* Scrolling belt — content doubled for seamless loop */
      '#hskk-ni{' +
        'display:inline-flex;align-items:center;height:100%;' +
        'white-space:nowrap;will-change:transform;' +
        'animation:hskk-scroll 60s linear infinite;' +
      '}' +
      '#hskk-ni.paused,#hskk-ni:hover{animation-play-state:paused}' +
      '#hskk-ni a,#hskk-ni span.ni{' +
        'padding:0 1.25rem;text-decoration:none;transition:filter 0.15s;' +
      '}' +
      '#hskk-ni a:hover{filter:brightness(1.25);text-decoration:underline}' +
      '.ni-sep{color:rgba(255,255,255,0.2);flex-shrink:0;padding:0 .1rem;}' +
      '@keyframes hskk-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}' +

      '@media(max-width:600px){' +
        '#'+BAR_ID+'{height:28px;font-size:0.73rem}' +
        '#hskk-nb{font-size:0.56rem;padding:0 8px 0 10px}' +
        '#hskk-ni a,#hskk-ni span.ni{padding:0 0.9rem}' +
      '}';

    document.head.appendChild(s);
  }

  function esc(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildHTML(items) {
    var sep = '<span class="ni-sep" aria-hidden="true">◆</span>';
    return items.map(function(it) {
      var color = SEV_CLR[it.s] || SEV_CLR[0];
      var text  = (SEV_PFX[it.s] || '') + esc(it.t);
      if (it.href) return '<a href="'+esc(it.href)+'" style="color:'+color+'">'+text+'</a>'+sep;
      return '<span class="ni" style="color:'+color+'">'+text+'</span>'+sep;
    }).join('');
  }

  /* ── Calibrate speed: ~70 px/s ───────────────────────────────────────── */
  function calibrate() {
    var ni = document.getElementById('hskk-ni');
    if (!ni) return;
    ni.style.animationDuration = Math.max(10, ni.scrollWidth / 2 / 70) + 's';
  }

  /* ── Update --header-h so hero padding compensates the taller header ──── */
  function syncHeaderH(tickerH) {
    var util = document.getElementById('util-bar');
    var hdr  = document.getElementById('site-header');
    if (!util || !hdr) return;
    var h = util.getBoundingClientRect().height +
            hdr.getBoundingClientRect().height +
            (tickerH || 0);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  /* ── Render ticker ────────────────────────────────────────────────────── */
  function render(items) {
    if (document.getElementById(BAR_ID)) return;
    injectStyle();

    var doubled = buildHTML(items) + buildHTML(items);

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.setAttribute('aria-label', 'ข่าวแจ้งเตือนสภาพอากาศขอนแก่น');
    bar.innerHTML =
      '<div id="hskk-nb"><span class="bd"></span>NEWS</div>' +
      '<div id="hskk-nt"><div id="hskk-ni">' + doubled + '</div></div>';

    /* Append INSIDE #site-header — ticker is position:absolute;top:100% */
    var hdr = document.getElementById('site-header');
    if (hdr) {
      hdr.appendChild(bar);
    } else {
      /* fallback: insert after whatever acts as header */
      var h2 = document.querySelector('[id*="header"], header');
      if (h2 && h2.parentNode) h2.parentNode.insertBefore(bar, h2.nextSibling);
      else document.body.insertBefore(bar, document.body.firstChild);
    }

    var tickerH = 34; /* match CSS height */
    syncHeaderH(tickerH);

    window.addEventListener('resize', function() { syncHeaderH(tickerH); }, { passive:true });

    /* Touch pause */
    var ni = bar.querySelector('#hskk-ni');
    if (ni) {
      ni.addEventListener('touchstart', function(){ ni.classList.add('paused'); }, { passive:true });
      ni.addEventListener('touchend',   function(){ ni.classList.remove('paused'); }, { passive:true });
    }

    requestAnimationFrame(calibrate);
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  function init() {
    if (!isHomePage()) return;

    /* Render immediately with loading placeholder */
    render([{ s:0, t:'กำลังโหลดข้อมูลสภาพอากาศขอนแก่น...', href:'/home' }]);

    /* Fetch: temperature + rain + PM2.5 */
    var wxUrl = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude='+lat+'&longitude='+lng+
      '&current=apparent_temperature,precipitation_probability&timezone=Asia%2FBangkok';
    var aqUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality' +
      '?latitude='+lat+'&longitude='+lng+
      '&current=pm2_5&timezone=Asia%2FBangkok';

    var temp = null, rain = null, pm25 = null;
    var wxDone = false, aqDone = false;

    function tryUpdate() {
      if (!wxDone || !aqDone) return;
      var ni = document.getElementById('hskk-ni');
      if (!ni) return;
      var items = buildItems(temp, pm25, rain);
      if (!items.length) return;
      ni.innerHTML = buildHTML(items) + buildHTML(items);
      requestAnimationFrame(function() {
        calibrate();
        ni.style.animationPlayState = 'running';
      });
    }

    fetch(wxUrl)
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d && d.current) {
          temp = d.current.apparent_temperature;
          rain = d.current.precipitation_probability;
        }
      })
      .catch(function(){})
      .then(function(){ wxDone = true; tryUpdate(); });

    fetch(aqUrl)
      .then(function(r){ return r.json(); })
      .then(function(d){
        pm25 = (d && d.current) ? (d.current.pm2_5 || null) : null;
      })
      .catch(function(){})
      .then(function(){ aqDone = true; tryUpdate(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
