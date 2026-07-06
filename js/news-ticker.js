/* ==========================================================================
   Heat Safe Khon Kaen — weather-advisory (news-ticker.js)
   แสดงสภาพอากาศวันนี้ + เตือนความร้อน
   – render ทันทีที่ DOM พร้อม (ไม่รอ API)
   – อัปเดตข้อมูลอุณหภูมิ/สภาพอากาศหลัง fetch เสร็จ
   ========================================================================== */
'use strict';

(function () {

  var BAR_ID = 'hskk-news-ticker';
  var cfg    = window.HSKK_CONFIG || {};
  var lat    = (cfg.loc && cfg.loc.lat) || 16.44;
  var lng    = (cfg.loc && cfg.loc.lng) || 102.82;

  /* ── สภาพอากาศ (WMO code) ─────────────────────────────────────────────── */
  var WX_MAP = [
    [0,  '☀️',  'แจ่มใส'],
    [1,  '🌤️', 'แจ่มใสเป็นส่วนใหญ่'],
    [2,  '⛅',  'มีเมฆบางส่วน'],
    [3,  '☁️',  'ครึ้ม'],
    [45, '🌫️', 'หมอก'],
    [51, '🌦️', 'ฝนปรอย'],
    [61, '🌧️', 'มีฝน'],
    [80, '⛈️',  'ฝนฟ้าคะนอง'],
    [95, '⛈️',  'พายุฝน'],
  ];
  function wxInfo(code) {
    var r = { icon: '🌤️', text: '' };
    if (code == null) return r;
    for (var i = 0; i < WX_MAP.length; i++) {
      if (code >= WX_MAP[i][0]) r = { icon: WX_MAP[i][1], text: WX_MAP[i][2] };
    }
    return r;
  }

  /* ── ระดับความร้อน ────────────────────────────────────────────────────── */
  var LEVELS = [
    { id:0, maxTemp:27,       maxPM:25,       label:'อากาศปกติ', badgeBg:'#15803d', barBg:'rgba(4,28,14,0.97)',
      advice:'วันนี้อากาศสบาย เหมาะสำหรับกิจกรรมกลางแจ้ง ดื่มน้ำให้เพียงพอ' },
    { id:1, maxTemp:33,       maxPM:37,       label:'อากาศร้อน', badgeBg:'#a16207', barBg:'rgba(26,14,0,0.97)',
      advice:'วันนี้อากาศร้อน ควรดื่มน้ำมากๆ สวมหมวกและเสื้อสีอ่อนเมื่อออกแดด' },
    { id:2, maxTemp:41,       maxPM:75,       label:'ร้อนจัด',   badgeBg:'#b45309', barBg:'rgba(34,10,0,0.98)',
      advice:'วันนี้ร้อนจัด ลดกิจกรรมกลางแจ้ง ดื่มน้ำทุก 20 นาที หลีกเลี่ยงแดดช่วง 11.00–15.00 น.' },
    { id:3, maxTemp:Infinity, maxPM:Infinity, label:'⚠ อันตราย', badgeBg:'#991b1b', barBg:'rgba(55,0,0,0.99)',
      advice:null },
  ];

  var DANGER_ACTIONS = [
    { icon:'🏠', text:'อยู่ในห้องแอร์/พัดลม' },
    { icon:'💧', text:'ดื่มน้ำทุก 15 นาที'   },
    { icon:'🧊', text:'เช็ดตัวด้วยน้ำเย็น'   },
    { icon:'👴', text:'ดูแลเด็กและผู้สูงอายุ' },
    { icon:'📞', text:'โทร 1669 ฉุกเฉิน', link:'tel:1669', urgent:true },
  ];

  function classify(temp, pm25) {
    var tId = 0, pId = 0;
    for (var j = 0; j < LEVELS.length; j++) { if (temp == null || temp < LEVELS[j].maxTemp) { tId = j; break; } tId = j; }
    for (var k = 0; k < LEVELS.length; k++) { if (pm25 == null || pm25 < LEVELS[k].maxPM)  { pId = k; break; } pId = k; }
    return LEVELS[Math.max(tId, pId)];
  }

  /* ── CSS ──────────────────────────────────────────────────────────────── */
  function injectStyle() {
    if (document.getElementById('hskk-ticker-style')) return;
    var s = document.createElement('style');
    s.id = 'hskk-ticker-style';
    s.textContent =
      '#'+BAR_ID+'{position:sticky;top:var(--header-h,100px);z-index:1200;overflow:hidden;font-family:"Noto Sans Thai",system-ui,sans-serif;}' +
      '#'+BAR_ID+'.lvl-compact{display:flex;align-items:center;height:32px;font-size:0.74rem;}' +
      '#'+BAR_ID+'.lvl-danger{display:flex;flex-direction:column;align-items:stretch;border-bottom:2px solid rgba(239,68,68,0.5);}' +
      '.hskk-row{display:flex;align-items:center;min-height:34px;}' +
      '#'+BAR_ID+'.lvl-compact .hskk-row{flex:1;height:100%;}' +
      '#hskk-badge{flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:0 11px 0 13px;align-self:stretch;color:#fff;font-weight:700;font-size:0.64rem;letter-spacing:0.05em;white-space:nowrap;}' +
      '.lvl-danger #hskk-badge{font-size:0.7rem;animation:hskk-blink 1s step-start infinite;}' +
      '#hskk-stats{flex-shrink:0;display:flex;align-items:center;gap:5px;padding:0 10px;font-size:0.7rem;color:rgba(255,255,255,0.72);border-right:1px solid rgba(255,255,255,0.1);white-space:nowrap;}' +
      '#hskk-stats .t{color:#fff;font-size:0.84rem;font-weight:700;}' +
      '#hskk-stats .sep{opacity:0.3;}' +
      '#hskk-advice{flex:1;padding:0 12px;color:rgba(255,228,196,0.94);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
      '.lvl-danger #hskk-advice{white-space:normal;font-weight:600;font-size:0.76rem;}' +
      '#hskk-actions{display:flex;align-items:center;gap:5px;flex-wrap:wrap;padding:5px 12px 7px;}' +
      '.hc{display:inline-flex;align-items:center;gap:3px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);border-radius:20px;padding:3px 11px;font-size:0.7rem;color:#fff;white-space:nowrap;text-decoration:none;transition:background 0.15s;}' +
      'a.hc:hover{background:rgba(255,255,255,0.2);}' +
      '.hc-sos{background:rgba(239,68,68,0.22);border-color:rgba(239,68,68,0.45);color:#fca5a5;font-weight:700;}' +
      'a.hc-sos:hover{background:rgba(239,68,68,0.38);}' +
      '@keyframes hskk-blink{0%,100%{opacity:1}50%{opacity:0.2}}' +
      '@media(max-width:600px){' +
        '#'+BAR_ID+'.lvl-compact{height:28px;font-size:0.68rem}' +
        '#hskk-badge{font-size:0.57rem;padding:0 8px 0 10px}' +
        '#hskk-stats{font-size:0.64rem;padding:0 8px}' +
        '#hskk-stats .t{font-size:0.76rem}' +
        '#hskk-advice{padding:0 8px;font-size:0.65rem}' +
        '.hskk-row{min-height:28px}' +
        '.hc{font-size:0.63rem;padding:2px 8px}' +
        '#hskk-actions{padding:4px 9px 6px;gap:4px}' +
      '}';
    document.head.appendChild(s);
  }

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  /* ── สร้าง HTML ───────────────────────────────────────────────────────── */
  function buildStatsHTML(temp, pm25, wxCode) {
    var wx   = wxInfo(wxCode);
    var tStr = temp != null ? '<span class="t">'+Math.round(temp)+'°C</span>' : '<span class="t">—</span>';
    var pStr = pm25 != null ? '<span class="sep">|</span>PM2.5 <span class="t">'+Math.round(pm25)+'</span>' : '';
    return wx.icon+(wx.text?'<span>'+esc(wx.text)+'</span>':'')+
           '<span class="sep">|</span>🌡️ '+tStr+pStr;
  }

  function buildActionsHTML() {
    return DANGER_ACTIONS.map(function(a){
      var cls = 'hc'+(a.urgent?' hc-sos':'');
      return a.link
        ? '<a href="'+esc(a.link)+'" class="'+cls+'">'+a.icon+' '+esc(a.text)+'</a>'
        : '<span class="'+cls+'">'+a.icon+' '+esc(a.text)+'</span>';
    }).join('');
  }

  /* ── แสดงบาร์ ─────────────────────────────────────────────────────────── */
  function createBar(temp, pm25, wxCode) {
    var lvl      = classify(temp, pm25);
    var isDanger = lvl.id >= 3;

    var bar = document.createElement('div');
    bar.id        = BAR_ID;
    bar.className = isDanger ? 'lvl-danger' : 'lvl-compact';
    bar.style.background = lvl.barBg;
    bar.setAttribute('aria-label', 'สภาพอากาศและคำแนะนำวันนี้');

    var adviceText = isDanger
      ? 'ห้ามออกแดดโดยเด็ดขาด — ปฏิบัติทันที'
      : esc(lvl.advice);

    bar.innerHTML =
      '<div class="hskk-row">' +
        '<div id="hskk-badge" style="background:'+esc(lvl.badgeBg)+'">'+esc(lvl.label)+'</div>' +
        '<div id="hskk-stats">'+buildStatsHTML(temp, pm25, wxCode)+'</div>' +
        '<div id="hskk-advice">'+adviceText+'</div>' +
      '</div>' +
      (isDanger ? '<div id="hskk-actions">'+buildActionsHTML()+'</div>' : '');

    return bar;
  }

  function insertBar(bar) {
    var header = document.getElementById('site-header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(bar, header.nextSibling);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
    /* อัปเดต --header-h ให้ anchor scroll ถูกต้อง */
    requestAnimationFrame(function () {
      var h   = bar.getBoundingClientRect().height || 32;
      var cur = parseFloat(document.documentElement.style.getPropertyValue('--header-h') || '100');
      document.documentElement.style.setProperty('--header-h', (cur + h) + 'px');
    });
  }

  /* ── อัปเดตบาร์ที่มีอยู่แล้ว (ไม่ต้อง re-insert) ───────────────────── */
  function updateBar(temp, pm25, wxCode) {
    var bar = document.getElementById(BAR_ID);
    if (!bar) return;

    var lvl      = classify(temp, pm25);
    var isDanger = lvl.id >= 3;

    /* อัปเดต level style */
    bar.className = isDanger ? 'lvl-danger' : 'lvl-compact';
    bar.style.background = lvl.barBg;

    /* อัปเดต badge */
    var badge = document.getElementById('hskk-badge');
    if (badge) { badge.textContent = lvl.label; badge.style.background = lvl.badgeBg; }

    /* อัปเดต stats */
    var stats = document.getElementById('hskk-stats');
    if (stats) stats.innerHTML = buildStatsHTML(temp, pm25, wxCode);

    /* อัปเดต advice */
    var advice = document.getElementById('hskk-advice');
    if (advice) {
      advice.innerHTML = isDanger
        ? 'ห้ามออกแดดโดยเด็ดขาด — ปฏิบัติทันที'
        : esc(lvl.advice);
    }

    /* เพิ่ม actions ถ้า danger */
    if (isDanger && !document.getElementById('hskk-actions')) {
      var actions = document.createElement('div');
      actions.id = 'hskk-actions';
      actions.innerHTML = buildActionsHTML();
      bar.appendChild(actions);
    }
  }

  /* ── fetch API ────────────────────────────────────────────────────────── */
  function fetchWeather() {
    var wxUrl = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude='+lat+'&longitude='+lng+
      '&current=apparent_temperature,weather_code&timezone=Asia%2FBangkok';
    var aqUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality' +
      '?latitude='+lat+'&longitude='+lng+
      '&current=pm2_5&timezone=Asia%2FBangkok';

    var apparent = null, wxCode = null, pm25 = null;
    var wxDone = false, aqDone = false;

    function tryUpdate() {
      if (!wxDone || !aqDone) return;
      updateBar(apparent, pm25, wxCode);
    }

    fetch(wxUrl)
      .then(function(r){ return r.json(); })
      .then(function(d){ if(d && d.current){ apparent = d.current.apparent_temperature; wxCode = d.current.weather_code; } })
      .catch(function(){})
      .then(function(){ wxDone = true; tryUpdate(); });  /* .then แทน .finally */

    fetch(aqUrl)
      .then(function(r){ return r.json(); })
      .then(function(d){ pm25 = d && d.current ? (d.current.pm2_5 || null) : null; })
      .catch(function(){})
      .then(function(){ aqDone = true; tryUpdate(); });
  }

  /* ── init: render ทันที → fetch → update ─────────────────────────────── */
  function init() {
    injectStyle();

    /* แสดงบาร์ทันที (ไม่รอ API) */
    if (!document.getElementById(BAR_ID)) {
      insertBar(createBar(null, null, null));
    }

    /* ดึงข้อมูลจริง แล้วอัปเดต */
    fetchWeather();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
