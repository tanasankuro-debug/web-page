/* ==========================================================================
   Heat Safe KK — park-vote.js
   Widget แสดงผลโหวตสวนสีเขียว (มุมขวาบน fixed)
   ต้องโหลดหลัง config.js และ supabase CDN
   ========================================================================== */
'use strict';

(function () {

  /* ── park meta ─────────────────────────────────────────────────────────── */
  var PARKS = [
    { key: 'pocket_park',   label: 'Pocket Park',   color: '#4ADE80',
      svg: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="5.5" r="3" fill="rgba(74,222,128,.2)"/><path d="M8 8.5V12"/><path d="M5 13h6"/></svg>' },
    { key: 'green_walkway', label: 'Green Walkway',  color: '#22D3EE',
      svg: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 2C5 2 4 5 5.5 8C7 11 8 12 8 12C8 12 9 11 10.5 8C12 5 11 2 11 2"/><path d="M3 14c1-1 2.5-1 4 0s3 1 4 0 2-1 3 0"/></svg>' },
    { key: 'sponge_park',   label: 'Sponge Park',   color: '#60A5FA',
      svg: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 2C8 2 5 5.5 5 8.5A3 3 0 0 0 11 8.5C11 5.5 8 2 8 2Z" fill="rgba(96,165,250,.2)"/><path d="M6.5 9.5a2 2 0 0 0 3 0" stroke-width="1.2" opacity=".65"/></svg>' },
    { key: 'green_roof',    label: 'Green Roof',    color: '#A3E635',
      svg: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="12" height="6"/><path d="M1 8l7-5 7 5"/><path d="M6.5 8C7 6.5 8 5 8 5s1 1.5 1.5 3" stroke-width="1.3" fill="rgba(163,230,53,.15)"/></svg>' },
    { key: 'sponge_plaza',  label: 'Sponge Plaza',  color: '#FB923C',
      svg: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="2" x2="8" y2="5"/><path d="M5.5 5h5"/><path d="M6 5c-.5 2-1.5 3-1.5 3h7s-1-1-1.5-3"/><path d="M3 13c1-1 2.5-1 4 0s3 1 4 0 2-1 3 0"/></svg>' },
  ];

  /* ── fingerprint (localStorage UUID) ─────────────────────────────────── */
  function getFingerprint() {
    var k = 'pvw_fp';
    var fp = localStorage.getItem(k);
    if (!fp) {
      fp = 'fp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
      try { localStorage.setItem(k, fp); } catch (e) {}
    }
    return fp;
  }

  /* ── supabase client ──────────────────────────────────────────────────── */
  var _sb = null;
  function getSb() {
    if (_sb) return _sb;
    var cfg = window.HSKK_CONFIG && window.HSKK_CONFIG.supabase;
    if (!cfg || !cfg.url || !cfg.anonKey) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    _sb = window.supabase.createClient(cfg.url, cfg.anonKey);
    return _sb;
  }

  /* ── state ────────────────────────────────────────────────────────────── */
  var _open     = false;
  var _votes    = {};   /* { pocket_park: 12, green_walkway: 8, … } */
  var _total    = 0;
  var _hasVoted = false;
  var _loading  = true;
  var _error    = null;

  /* ── check if already voted ───────────────────────────────────────────── */
  function checkVoted() {
    _hasVoted = localStorage.getItem('pvw_voted') === '1';
  }

  /* ── fetch vote totals from Supabase ──────────────────────────────────── */
  function fetchVotes() {
    var sb = getSb();
    if (!sb) { _error = 'ไม่สามารถเชื่อมต่อฐานข้อมูล'; _loading = false; renderCard(); renderHomeStats(); return; }

    _loading = true;
    _error   = null;
    renderCard();
    renderHomeStats();

    sb.from('park_votes')
      .select('park_type')
      .then(function (res) {
        if (res.error) {
          _error   = 'โหลดข้อมูลไม่สำเร็จ';
          _loading = false;
          renderCard();
          renderHomeStats();
          return;
        }

        /* tally */
        var tally = {};
        PARKS.forEach(function (p) { tally[p.key] = 0; });
        (res.data || []).forEach(function (row) {
          if (tally[row.park_type] !== undefined) tally[row.park_type]++;
        });

        _votes   = tally;
        _total   = Object.values(tally).reduce(function (s, n) { return s + n; }, 0);
        _loading = false;
        _error   = null;
        renderCard();
        renderHomeStats();
      })
      .catch(function () {
        _error   = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
        _loading = false;
        renderCard();
        renderHomeStats();
      });
  }

  /* ── render the expanded card content ────────────────────────────────── */
  function renderCard() {
    var card = document.getElementById('pvw-card-inner');
    if (!card) return;

    /* loading */
    if (_loading) {
      var skeletonRows = [0,1,2,3,4].map(function (i) {
        var d  = ['0s','0.1s','0.2s','0.3s','0.4s'][i];
        var bw = [72, 54, 84, 46, 34][i];
        return (
          '<div style="display:flex;align-items:center;gap:.45rem;padding:.36rem 0;' +
          (i > 0 ? 'border-top:1px solid rgba(255,255,255,.035);' : '') + '">' +
          '  <div style="width:10px;height:5px;background:rgba(255,255,255,.05);border-radius:2px;flex-shrink:0;"></div>' +
          '  <div style="width:19px;height:19px;background:rgba(255,255,255,.06);border-radius:5px;flex-shrink:0;animation:pvwShimmer 1.6s ' + d + ' ease-in-out infinite;"></div>' +
          '  <div style="flex:1;display:flex;flex-direction:column;gap:.2rem;">' +
          '    <div style="height:6px;width:' + bw + '%;background:rgba(255,255,255,.07);border-radius:3px;animation:pvwShimmer 1.6s ' + d + ' ease-in-out infinite;"></div>' +
          '    <div style="height:4px;width:100%;background:rgba(255,255,255,.04);border-radius:2px;overflow:hidden;">' +
          '      <div style="height:100%;background:rgba(74,222,128,.22);border-radius:2px;animation:pvwBarLoad 1.6s ' + d + ' ease-in-out infinite;"></div>' +
          '    </div>' +
          '  </div>' +
          '  <div style="width:24px;height:6px;background:rgba(74,222,128,.09);border-radius:3px;flex-shrink:0;animation:pvwShimmer 1.6s ' + d + ' ease-in-out infinite;"></div>' +
          '</div>'
        );
      }).join('');

      card.innerHTML =
        '<div style="padding:.85rem .9rem .7rem;">' +
        '  <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.8rem;">' +
        '    <div style="width:28px;height:28px;flex-shrink:0;border-radius:8px;' +
        '         border:1px solid rgba(74,222,128,.25);display:flex;align-items:center;justify-content:center;' +
        '         animation:pvwIconPulse 1.8s ease-in-out infinite;">' +
        '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">' +
        '        <path d="M6 21C6 21 7 13 14 8C18 5 21 4 21 4C21 4 20 8 17 12C13 17 6 21 6 21Z"' +
        '              fill="rgba(74,222,128,.28)" stroke="#4ADE80" stroke-width="2" stroke-linejoin="round"/>' +
        '        <path d="M6 21L12 14" stroke="#4ADE80" stroke-width="2" stroke-linecap="round"/>' +
        '      </svg>' +
        '    </div>' +
        '    <div style="flex:1;display:flex;flex-direction:column;gap:.3rem;">' +
        '      <div style="height:7px;width:60%;background:rgba(74,222,128,.18);border-radius:4px;animation:pvwShimmer 1.6s ease-in-out infinite;"></div>' +
        '      <div style="height:5px;width:38%;background:rgba(255,255,255,.05);border-radius:3px;animation:pvwShimmer 1.6s .12s ease-in-out infinite;"></div>' +
        '    </div>' +
        '  </div>' +
        skeletonRows +
        '</div>';
      return;
    }

    /* error */
    if (_error) {
      card.innerHTML =
        '<div style="padding:1.25rem;text-align:center;">' +
        '  <div style="font-size:1.2rem;margin-bottom:.35rem;">⚠️</div>' +
        '  <div style="font-size:.78rem;color:#F87171;">' + _error + '</div>' +
        '  <button onclick="pvwRefresh()" style="margin-top:.75rem;background:rgba(255,255,255,.08);' +
        '    border:1px solid rgba(255,255,255,.15);border-radius:6px;color:rgba(255,255,255,.7);' +
        '    font-size:.72rem;padding:.35rem .75rem;cursor:pointer;">ลองใหม่</button>' +
        '</div>';
      return;
    }

    /* empty state */
    if (_total === 0) {
      card.innerHTML =
        '<div style="padding:1.25rem 1rem;text-align:center;">' +
        '  <div style="margin-bottom:.5rem;display:flex;justify-content:center;">' +
        '    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
        '      <path d="M12 22V12"/>' +
        '      <path d="M12 12C12 12 8 10 7 6C10 5 14 6 16 9C17 11 17 13 17 13C17 13 14 12 12 12Z" fill="rgba(74,222,128,.2)"/>' +
        '      <path d="M12 16C12 16 9 15 7 12" opacity=".5" stroke-width="1.3"/>' +
        '    </svg>' +
        '  </div>' +
        '  <div style="font-size:.82rem;color:rgba(255,255,255,.45);">ยังไม่มีการโหวต<br>เป็นคนแรกได้เลย!</div>' +
        '  <a href="vote-park.html" style="display:inline-block;margin-top:.85rem;' +
        '    background:#4ADE80;color:#000;font-size:.78rem;font-weight:700;' +
        '    padding:.45rem 1rem;border-radius:8px;text-decoration:none;">ร่วมโหวต →</a>' +
        '</div>';
      return;
    }

    /* ranked list */
    var sorted = PARKS.slice().sort(function (a, b) {
      return (_votes[b.key] || 0) - (_votes[a.key] || 0);
    });

    var rows = sorted.map(function (p, i) {
      var count = _votes[p.key] || 0;
      var pct   = _total > 0 ? Math.round((count / _total) * 100) : 0;
      var rank  = i + 1;
      return (
        '<div style="padding:.55rem .9rem;' + (i > 0 ? 'border-top:1px solid rgba(255,255,255,.06);' : '') + '">' +
        '  <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;">' +
        '    <span style="font-size:.6rem;color:rgba(255,255,255,.3);width:12px;text-align:right;">' + rank + '</span>' +
        '    <span style="color:' + p.color + ';display:inline-flex;align-items:center;width:18px;height:18px;justify-content:center;flex-shrink:0;">' + p.svg + '</span>' +
        '    <span style="font-size:.8rem;font-weight:700;color:#F1F5F9;flex:1;">' + p.label + '</span>' +
        '    <span style="font-size:.75rem;font-weight:700;color:' + p.color + ';">' + pct + '%</span>' +
        '  </div>' +
        '  <div style="display:flex;align-items:center;gap:.5rem;">' +
        '    <div style="width:12px;flex-shrink:0;"></div>' + /* indent */
        '    <div style="flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;">' +
        '      <div style="height:100%;width:' + pct + '%;background:' + p.color + ';border-radius:3px;' +
        '           transition:width .6s ease;"></div>' +
        '    </div>' +
        '    <span style="font-size:.65rem;color:rgba(255,255,255,.3);width:28px;text-align:right;">' + count + '</span>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    var votedBadge = _hasVoted
      ? '<span style="font-size:.62rem;color:#4ADE80;background:rgba(74,222,128,.12);' +
        'border:1px solid rgba(74,222,128,.25);border-radius:4px;padding:.15rem .45rem;">✓ คุณโหวตแล้ว</span>'
      : '';

    card.innerHTML =
      rows +
      '<div style="padding:.7rem .9rem;border-top:1px solid rgba(255,255,255,.08);' +
      '     display:flex;align-items:center;justify-content:space-between;gap:.5rem;">' +
      '  ' + votedBadge +
      '  <a href="vote-park.html" style="' +
      '    background:' + (_hasVoted ? 'rgba(255,255,255,.06)' : '#4ADE80') + ';' +
      '    color:' + (_hasVoted ? 'rgba(255,255,255,.4)' : '#000') + ';' +
      '    font-size:.75rem;font-weight:700;padding:.4rem .9rem;' +
      '    border-radius:7px;text-decoration:none;display:inline-block;">' +
      '    ' + (_hasVoted ? 'ดูผล' : 'ร่วมโหวต →') +
      '  </a>' +
      '</div>';
  }

  /* ── render home-page live stats block ───────────────────────────────── */
  function renderHomeStats() {
    var block = document.getElementById('pvwStatsBlock');
    if (!block) return;

    if (_loading) {
      block.innerHTML = '<div class="pvwhs-loading">กำลังโหลดผลโหวต...</div>';
      return;
    }
    if (_error) {
      block.innerHTML = '<div class="pvwhs-err">⚠ ' + _error +
        ' <button class="pvwhs-retry" onclick="pvwRefresh()">ลองใหม่</button></div>';
      return;
    }
    if (_total === 0) {
      block.innerHTML = '<div class="pvwhs-empty">ยังไม่มีผลโหวต — เป็นคนแรกได้เลย! 🌱</div>';
      return;
    }

    var sorted = PARKS.slice().sort(function (a, b) {
      return (_votes[b.key] || 0) - (_votes[a.key] || 0);
    });

    var now     = new Date();
    var timeStr = now.getHours().toString().padStart(2,'0') + ':' +
                  now.getMinutes().toString().padStart(2,'0') + ' น.';

    /* header */
    var html =
      '<div class="pvwhs-hd">' +
      '  <div class="pvwhs-hd-left">' +
      '    <div class="pvwhs-title">' +
      '      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">' +
      '        <rect x="1" y="10" width="3" height="5" rx="1"/><rect x="6" y="6" width="3" height="9" rx="1"/><rect x="11" y="2" width="3" height="13" rx="1"/>' +
      '      </svg> ผลโหวตสด' +
      '    </div>' +
      '    <div class="pvwhs-live"><span class="pvwhs-dot"></span>LIVE</div>' +
      '  </div>' +
      '  <div class="pvwhs-total">' +
      '    <span class="pvwhs-total-num" id="pvwhsTotalNum">0</span>' +
      '    <span class="pvwhs-total-lbl">คนร่วมโหวต</span>' +
      '  </div>' +
      '</div>';

    /* rows */
    html += '<div class="pvwhs-rows">';
    sorted.forEach(function (p, i) {
      var count = _votes[p.key] || 0;
      var pct   = _total > 0 ? Math.round((count / _total) * 100) : 0;
      /* box-shadow glow on bar uses color */
      html +=
        '<div class="pvwhs-row">' +
        '  <span class="pvwhs-rank">' + (i + 1) + '</span>' +
        '  <span class="pvwhs-icon" style="color:' + p.color + ';">' + p.svg + '</span>' +
        '  <div class="pvwhs-info">' +
        '    <div class="pvwhs-name-row">' +
        '      <span class="pvwhs-name">' + p.label + '</span>' +
        '      <span class="pvwhs-pct" style="color:' + p.color + ';">' + pct + '%</span>' +
        '    </div>' +
        '    <div class="pvwhs-bar-bg">' +
        '      <div class="pvwhs-bar-fill" style="background:' + p.color +
               ';box-shadow:0 0 8px ' + p.color + '66" data-w="' + pct + '"></div>' +
        '    </div>' +
        '  </div>' +
        '  <span class="pvwhs-count">' + count + '</span>' +
        '</div>';
    });
    html += '</div>';

    /* footer */
    html +=
      '<div class="pvwhs-foot">' +
      '  <span>อัปเดต ' + timeStr + '</span>' +
      '  <button class="pvwhs-foot-btn" onclick="pvwRefresh()" title="รีเฟรชผลโหวต">' +
      '    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
      '      <path d="M13.5 8A5.5 5.5 0 1 1 10 3.13"/><path d="M10 1v3h3"/>' +
      '    </svg> รีเฟรช' +
      '  </button>' +
      '</div>';

    block.innerHTML = html;

    /* count-up animation on total */
    var numEl = document.getElementById('pvwhsTotalNum');
    if (numEl) {
      var t0 = null, endVal = _total, dur = 900;
      function countStep(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        numEl.textContent = Math.round(endVal * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(countStep);
      }
      requestAnimationFrame(countStep);
    }

    /* bar fill animation (needs two frames so CSS transition fires) */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        block.querySelectorAll('.pvwhs-bar-fill').forEach(function (el) {
          el.style.width = el.dataset.w + '%';
        });
      });
    });
  }

  /* ── toggle open / close ──────────────────────────────────────────────── */
  window.pvwToggle = function () {
    _open = !_open;
    var panel = document.getElementById('pvw-panel');
    var btn   = document.getElementById('pvw-btn');
    if (!panel) return;

    if (_open) {
      panel.style.display    = 'flex';
      panel.style.opacity    = '0';
      panel.style.transform  = 'translateX(16px)';
      setTimeout(function () {
        panel.style.transition = 'opacity .22s ease, transform .22s ease';
        panel.style.opacity    = '1';
        panel.style.transform  = 'translateX(0)';
      }, 10);
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (_loading || _error) fetchVotes();
    } else {
      panel.style.opacity   = '0';
      panel.style.transform = 'translateX(16px)';
      setTimeout(function () { panel.style.display = 'none'; }, 220);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  };

  /* ── manual refresh ───────────────────────────────────────────────────── */
  window.pvwRefresh = function () {
    fetchVotes();
  };

  /* ── close on outside click ───────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    if (!_open) return;
    var wrap = document.getElementById('pvw-wrap');
    if (wrap && !wrap.contains(e.target)) {
      _open = false;
      var panel = document.getElementById('pvw-panel');
      var btn   = document.getElementById('pvw-btn');
      if (panel) {
        panel.style.opacity   = '0';
        panel.style.transform = 'translateX(16px)';
        setTimeout(function () { panel.style.display = 'none'; }, 220);
      }
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── init ─────────────────────────────────────────────────────────────── */
  function init() {
    checkVoted();
    fetchVotes();
    /* auto-refresh ทุก 60 วินาที */
    setInterval(function () {
      if (_open) fetchVotes();
    }, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
