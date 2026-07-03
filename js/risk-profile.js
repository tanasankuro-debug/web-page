/* ==========================================================================
   Heat Safe Khon Kaen — risk-profile.js
   Personal risk group selector. Shows a floating settings button on all pages.
   Stores selection in localStorage key "hskk-risk-groups" (array of strings).
   Dispatches CustomEvent "hskk:risk-profile-changed" when saved.
   Calls window.HSKK_refreshAlertBar() if available.
   ========================================================================== */
'use strict';

(function () {

  var LS_KEY    = 'hskk-risk-groups';
  var BTN_ID    = 'hskk-rp-btn';
  var MODAL_ID  = 'hskk-rp-modal';
  var STYLE_ID  = 'hskk-rp-style';

  var GROUPS = [
    { id: 'elderly',     emoji: '🧓', label: 'ผู้สูงอายุ',              sub: 'อายุ 60 ปีขึ้นไป' },
    { id: 'child',       emoji: '👶', label: 'เด็กเล็ก',                 sub: 'อายุต่ำกว่า 5 ปี' },
    { id: 'respiratory', emoji: '🫁', label: 'โรคทางเดินหายใจ',          sub: 'หอบหืด, COPD, ภูมิแพ้' },
    { id: 'cardiac',     emoji: '❤️', label: 'โรคหัวใจ / ความดัน',       sub: 'หัวใจ, ความดันโลหิต' },
    { id: 'outdoor',     emoji: '🌞', label: 'ทำงานกลางแจ้ง',            sub: 'เกษตร, ก่อสร้าง, วิน' },
    { id: 'pregnant',    emoji: '🤰', label: 'ตั้งครรภ์',                sub: 'ทุกไตรมาส' },
    { id: 'general',     emoji: '🙂', label: 'ทั่วไป / ไม่มีโรคประจำตัว', sub: 'ร่างกายแข็งแรง' }
  ];

  /* ── Read / write localStorage ───────────────────────────────────────── */
  function load() {
    try {
      var v = localStorage.getItem(LS_KEY);
      return v ? JSON.parse(v) : ['general'];
    } catch (e) { return ['general']; }
  }

  function save(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  /* ── Inject CSS ──────────────────────────────────────────────────────── */
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      /* Floating button */
      '#hskk-rp-btn{',
        'position:fixed;bottom:1.5rem;right:1rem;z-index:1400;',
        'width:42px;height:42px;border-radius:50%;',
        'background:rgba(20,28,46,0.92);',
        'border:1px solid rgba(34,211,238,0.35);',
        'color:#22d3ee;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 2px 12px rgba(0,0,0,0.45);',
        'transition:background 0.18s,border-color 0.18s,transform 0.15s;',
        'backdrop-filter:blur(8px);',
      '}',
      '#hskk-rp-btn:hover{',
        'background:rgba(34,211,238,0.12);',
        'border-color:rgba(34,211,238,0.6);',
        'transform:scale(1.08);',
      '}',
      '#hskk-rp-btn.has-profile{',
        'border-color:rgba(251,146,60,0.55);color:#fb923c;',
      '}',

      /* Modal overlay */
      '#hskk-rp-modal{',
        'display:none;',
        'position:fixed;inset:0;z-index:9000;',
        'background:rgba(0,0,0,0.72);',
        'align-items:flex-end;justify-content:center;',
        'padding:0;',
        'backdrop-filter:blur(3px);',
      '}',
      '#hskk-rp-modal.open{display:flex}',

      /* Card */
      '.hskk-rp-card{',
        'background:#141C2E;border-radius:20px 20px 0 0;',
        'padding:1.4rem 1.25rem 2rem;',
        'width:100%;max-width:480px;',
        'max-height:92svh;overflow-y:auto;',
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;',
        'color:#f5f5f4;',
        'box-shadow:0 -4px 32px rgba(0,0,0,0.6);',
        'border:1px solid rgba(34,211,238,0.1);',
        'border-bottom:none;',
      '}',
      '.hskk-rp-handle{',
        'width:36px;height:4px;border-radius:4px;',
        'background:rgba(255,255,255,0.15);',
        'margin:0 auto 1.2rem;',
      '}',
      '.hskk-rp-title{',
        'font-size:1rem;font-weight:700;',
        'margin:0 0 0.25rem;color:#f5f5f4;',
      '}',
      '.hskk-rp-sub{',
        'font-size:0.75rem;color:rgba(255,255,255,0.45);',
        'margin:0 0 1.1rem;line-height:1.5;',
      '}',

      /* Group list */
      '.hskk-rp-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.45rem}',
      '.hskk-rp-item label{',
        'display:flex;align-items:center;gap:0.65rem;',
        'padding:0.65rem 0.75rem;',
        'border-radius:10px;cursor:pointer;',
        'border:1px solid rgba(255,255,255,0.07);',
        'background:rgba(255,255,255,0.03);',
        'transition:background 0.15s,border-color 0.15s;',
      '}',
      '.hskk-rp-item input[type=checkbox]{display:none}',
      '.hskk-rp-box{',
        'width:18px;height:18px;flex-shrink:0;',
        'border-radius:5px;border:2px solid rgba(255,255,255,0.25);',
        'background:transparent;',
        'display:flex;align-items:center;justify-content:center;',
        'transition:background 0.15s,border-color 0.15s;',
      '}',
      '.hskk-rp-item input:checked ~ .hskk-rp-inner .hskk-rp-box{',
        'background:#22d3ee;border-color:#22d3ee;',
      '}',
      '.hskk-rp-item input:checked ~ .hskk-rp-inner .hskk-rp-box::after{',
        'content:"✓";font-size:11px;color:#0b0f1a;font-weight:900;',
      '}',
      '.hskk-rp-item input:checked ~ .hskk-rp-inner{',
        'border-color:rgba(34,211,238,0.35);',
        'background:rgba(34,211,238,0.06);',
      '}',
      '.hskk-rp-inner{',
        'display:flex;align-items:center;gap:0.65rem;',
        'flex:1;',
        'padding:0.65rem 0.75rem;',
        'border-radius:10px;',
        'border:1px solid rgba(255,255,255,0.07);',
        'background:rgba(255,255,255,0.03);',
        'transition:background 0.15s,border-color 0.15s;',
        'cursor:pointer;',
      '}',
      '.hskk-rp-emoji{font-size:1.3rem;flex-shrink:0}',
      '.hskk-rp-info{flex:1}',
      '.hskk-rp-lbl{font-size:0.83rem;font-weight:600;display:block}',
      '.hskk-rp-desc{font-size:0.7rem;color:rgba(255,255,255,0.42);display:block;margin-top:1px}',

      /* Buttons */
      '.hskk-rp-actions{display:flex;gap:0.6rem;margin-top:1.1rem}',
      '.hskk-rp-save{',
        'flex:1;padding:0.7rem;border:none;border-radius:10px;',
        'background:#22d3ee;color:#0b0f1a;',
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;',
        'font-size:0.83rem;font-weight:700;cursor:pointer;',
        'transition:background 0.15s;',
      '}',
      '.hskk-rp-save:hover{background:#06b6d4}',
      '.hskk-rp-clear{',
        'padding:0.7rem 1rem;border-radius:10px;',
        'border:1px solid rgba(255,255,255,0.15);',
        'background:transparent;color:rgba(255,255,255,0.4);',
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;',
        'font-size:0.78rem;cursor:pointer;',
        'transition:border-color 0.15s,color 0.15s;',
      '}',
      '.hskk-rp-clear:hover{border-color:rgba(255,255,255,0.3);color:rgba(255,255,255,0.6)}',
      '.hskk-rp-note{',
        'font-size:0.68rem;color:rgba(255,255,255,0.28);',
        'text-align:center;margin-top:0.75rem;line-height:1.5;',
      '}',

      /* Toast */
      '#hskk-rp-toast{',
        'position:fixed;bottom:5rem;left:50%;transform:translateX(-50%) translateY(20px);',
        'z-index:9500;',
        'background:#1e2d45;',
        'border:1px solid rgba(34,211,238,0.3);',
        'border-radius:12px;',
        'padding:0.75rem 1.1rem;',
        'font-family:\'Noto Sans Thai\',system-ui,sans-serif;',
        'font-size:0.78rem;color:#f5f5f4;',
        'box-shadow:0 4px 24px rgba(0,0,0,0.5);',
        'max-width:calc(100vw - 2rem);width:max-content;',
        'opacity:0;pointer-events:none;',
        'transition:opacity 0.22s,transform 0.22s;',
      '}',
      '#hskk-rp-toast.show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}',
      '.hskk-toast-row{display:flex;align-items:center;gap:0.5rem}',
      '.hskk-toast-icon{font-size:1rem;flex-shrink:0}',
      '.hskk-toast-msg{line-height:1.5}',
      '.hskk-toast-title{font-weight:700;color:#22d3ee}',
      '.hskk-toast-sub{font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:2px}',

      /* Desktop: center dialog */
      '@media(min-width:480px){',
        '#hskk-rp-modal{align-items:center;padding:1rem}',
        '.hskk-rp-card{border-radius:16px;border:1px solid rgba(34,211,238,0.12);max-height:80svh}',
      '}',

      /* Bottom-nav safe area */
      '@media(max-width:479px){',
        '.hskk-rp-card{padding-bottom:calc(2rem + env(safe-area-inset-bottom,0px))}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Build modal HTML ────────────────────────────────────────────────── */
  function buildModal(current) {
    var items = GROUPS.map(function (g) {
      var checked = current.indexOf(g.id) !== -1 ? ' checked' : '';
      return '<li class="hskk-rp-item">' +
        '<input type="checkbox" id="rp-' + g.id + '" name="rp" value="' + g.id + '"' + checked + '>' +
        '<label for="rp-' + g.id + '" class="hskk-rp-inner">' +
          '<span class="hskk-rp-box"></span>' +
          '<span class="hskk-rp-emoji">' + g.emoji + '</span>' +
          '<span class="hskk-rp-info">' +
            '<span class="hskk-rp-lbl">' + g.label + '</span>' +
            '<span class="hskk-rp-desc">' + g.sub + '</span>' +
          '</span>' +
        '</label>' +
      '</li>';
    }).join('');

    return '<div role="dialog" aria-modal="true" aria-labelledby="hskk-rp-h" class="hskk-rp-card">' +
      '<div class="hskk-rp-handle" aria-hidden="true"></div>' +
      '<h2 id="hskk-rp-h" class="hskk-rp-title">ข้อมูลสุขภาพของฉัน</h2>' +
      '<p class="hskk-rp-sub">เลือกกลุ่มที่ตรงกับคุณเพื่อรับคำเตือนที่เหมาะสมยิ่งขึ้น (เลือกได้หลายข้อ)</p>' +
      '<ul class="hskk-rp-list">' + items + '</ul>' +
      '<div class="hskk-rp-actions">' +
        '<button class="hskk-rp-save" id="hskk-rp-save">บันทึก</button>' +
        '<button class="hskk-rp-clear" id="hskk-rp-clear">รีเซ็ต</button>' +
      '</div>' +
      '<p class="hskk-rp-note">ข้อมูลเก็บไว้ในเครื่องเท่านั้น ไม่มีการส่งออก</p>' +
    '</div>';
  }

  /* ── Open / close ────────────────────────────────────────────────────── */
  function openModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    var current = load();
    modal.innerHTML = buildModal(current);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    /* Checkbox → mutual exclusion with "general" */
    modal.querySelectorAll('input[name=rp]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (cb.value === 'general' && cb.checked) {
          modal.querySelectorAll('input[name=rp]').forEach(function (o) {
            if (o.value !== 'general') o.checked = false;
          });
        } else if (cb.checked) {
          var gen = modal.querySelector('#rp-general');
          if (gen) gen.checked = false;
        }
      });
    });

    document.getElementById('hskk-rp-save').addEventListener('click', function () {
      var checked = Array.from(modal.querySelectorAll('input[name=rp]:checked'))
        .map(function (cb) { return cb.value; });
      if (!checked.length) checked = ['general'];
      save(checked);
      updateBtn(checked);
      closeModal();
      showToast(checked);
      if (typeof window.HSKK_refreshAlertBar === 'function') window.HSKK_refreshAlertBar();
      try { document.dispatchEvent(new CustomEvent('hskk:risk-profile-changed', { detail: checked })); } catch (e) {}
    });

    document.getElementById('hskk-rp-clear').addEventListener('click', function () {
      modal.querySelectorAll('input[name=rp]').forEach(function (cb) { cb.checked = false; });
      var gen = modal.querySelector('#rp-general');
      if (gen) gen.checked = true;
    });

    /* Focus first element */
    var first = modal.querySelector('input[type=checkbox]');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* ── Update float button badge ───────────────────────────────────────── */
  function updateBtn(groups) {
    var btn = document.getElementById(BTN_ID);
    if (!btn) return;
    var hasProfile = groups && !(groups.length === 1 && groups[0] === 'general');
    btn.classList.toggle('has-profile', !!hasProfile);
    btn.setAttribute('title', hasProfile
      ? 'โปรไฟล์: ' + groups.map(function (g) {
          var found = GROUPS.filter(function (x) { return x.id === g; })[0];
          return found ? found.label : g;
        }).join(', ')
      : 'ตั้งค่าโปรไฟล์สุขภาพ');
  }

  /* ── Toast notification ─────────────────────────────────────────────── */
  var _toastTimer = null;

  function showToast(groups) {
    var isVuln = ['elderly','child','respiratory','cardiac','pregnant']
      .some(function (g) { return groups.indexOf(g) !== -1; });

    /* Build label string */
    var names = groups.map(function (g) {
      var found = GROUPS.filter(function (x) { return x.id === g; })[0];
      return found ? (found.emoji + ' ' + found.label) : g;
    }).join('  ');

    /* Threshold summary */
    var thresholds = isVuln
      ? 'แจ้งเตือนเร็วขึ้น: ความร้อน ≥32°C · PM2.5 ≥25 µg/m³'
      : 'เกณฑ์มาตรฐาน: ความร้อน ≥37°C · PM2.5 ≥37 µg/m³';

    /* Ensure toast element exists */
    var toast = document.getElementById('hskk-rp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hskk-rp-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.innerHTML =
      '<div class="hskk-toast-row">' +
        '<span class="hskk-toast-icon">✅</span>' +
        '<div class="hskk-toast-msg">' +
          '<div class="hskk-toast-title">บันทึกโปรไฟล์แล้ว</div>' +
          '<div class="hskk-toast-sub">' + names + '</div>' +
          '<div class="hskk-toast-sub">' + thresholds + '</div>' +
        '</div>' +
      '</div>';

    /* Show */
    clearTimeout(_toastTimer);
    toast.classList.add('show');
    _toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ── Inject UI ───────────────────────────────────────────────────────── */
  function init() {
    injectStyle();

    /* Floating button */
    var btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.setAttribute('aria-label', 'ตั้งค่าโปรไฟล์สุขภาพ');
    btn.setAttribute('title', 'ตั้งค่าโปรไฟล์สุขภาพ');
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
          ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="8" r="4"/>' +
        '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' +
      '</svg>';
    btn.addEventListener('click', openModal);
    document.body.appendChild(btn);

    /* Modal shell */
    var modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-hidden', 'true');
    /* Close on backdrop click */
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.body.appendChild(modal);

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    /* Sync button state */
    updateBtn(load());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
