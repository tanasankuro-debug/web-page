/* ==========================================================================
   Heat Safe Khon Kaen — utility-bar.js
   Accessibility bar: font-scale (A−/A+), high-contrast toggle,
   emergency hotlines, social links.
   Self-injects HTML before #site-header on DOMContentLoaded.
   Preferences persisted via localStorage.
   ========================================================================== */
'use strict';

/* ── Apply stored preferences immediately (before first paint) ─────────── */
(function () {
  const scale = parseFloat(localStorage.getItem('hskk-font-scale') || '1');
  if (scale !== 1) {
    document.documentElement.style.setProperty('--font-scale', scale);
  }
  if (localStorage.getItem('hskk-contrast') === '1') {
    document.documentElement.classList.add('high-contrast');
  }
})();

/* ── Inject utility bar HTML and wire up interactions ─────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  const isContrast = document.documentElement.classList.contains('high-contrast');

  const bar = document.createElement('div');
  bar.id = 'util-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'แถบเครื่องมือช่วยเหลือ');

  bar.innerHTML =
    '<div class="util-inner">' +

      /* ── Left: accessibility ── */
      '<div class="util-a11y">' +
        '<span class="util-a11y-label" aria-hidden="true">ข้อความ</span>' +
        '<button id="util-font-dec" class="util-font-btn"' +
          ' aria-label="ลดขนาดตัวอักษร" title="ลดขนาดตัวอักษร">A−</button>' +
        '<button id="util-font-inc" class="util-font-btn"' +
          ' aria-label="เพิ่มขนาดตัวอักษร" title="เพิ่มขนาดตัวอักษร">A+</button>' +
        '<div class="util-vsep" aria-hidden="true"></div>' +
        '<button id="util-contrast" class="util-contrast-btn"' +
          ' aria-label="สลับโหมดคอนทราสต์สูง"' +
          ' aria-pressed="' + isContrast + '"' +
          ' title="โหมดคอนทราสต์สูง">' +
          '<svg viewBox="0 0 16 16" width="11" height="11" fill="none"' +
              ' stroke="currentColor" stroke-width="1.6"' +
              ' stroke-linecap="round" aria-hidden="true">' +
            '<circle cx="8" cy="8" r="5.5"/>' +
            '<path d="M8 2.5v11" stroke-width="1.3"/>' +
            '<path d="M8 2.5a5.5 5.5 0 0 1 0 11Z" fill="currentColor" stroke="none"/>' +
          '</svg>' +
          '<span class="util-contrast-label">คอนทราสต์</span>' +
        '</button>' +
      '</div>' +

      /* ── Right: hotlines + social ── */
      '<div class="util-right">' +

        '<div class="util-hotlines" aria-label="สายด่วนฉุกเฉิน">' +

          '<a href="tel:1669" aria-label="สายด่วน 1669 การแพทย์ฉุกเฉิน">' +
            '<svg viewBox="0 0 16 16" width="10" height="10" fill="none"' +
                ' stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"' +
                ' aria-hidden="true">' +
              '<path d="M14 11.5a1.5 1.5 0 0 1-.47 1.09 2.4 2.4 0 0 1-1.63.91' +
                ' c-1.72.07-4.2-.96-6.35-3.09C3.4 8.27 2.37 5.79 2.44 4.1' +
                ' a2.4 2.4 0 0 1 .9-1.63A1.5 1.5 0 0 1 4.43 2h.07c.4.05.75.27.97.6' +
                ' l1.5 2.1c.24.34.28.8.1 1.17L6.2 7.25a.4.4 0 0 0 .06.44' +
                ' l2.05 2.05c.11.12.29.15.44.06l1.38-.87' +
                ' c.37-.18.83-.14 1.17.1l2.1 1.5c.33.22.55.57.6.97Z"/>' +
            '</svg>' +
            '<span class="util-hotline-num">1669</span>' +
            '<span class="util-hotline-name">เวชกิจ</span>' +
          '</a>' +

          '<span class="util-hdot" aria-hidden="true">·</span>' +

          '<a href="tel:1784" aria-label="สายด่วน 1784 สาธารณภัย ปภ.">' +
            '<svg viewBox="0 0 16 16" width="10" height="10" fill="none"' +
                ' stroke="#fb923c" stroke-width="1.5" stroke-linecap="round"' +
                ' stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M8 2L2 13h12L8 2z"/>' +
              '<line x1="8" y1="7.5" x2="8" y2="9.5"/>' +
              '<circle cx="8" cy="11" r="0.55" fill="#fb923c" stroke="none"/>' +
            '</svg>' +
            '<span class="util-hotline-num">1784</span>' +
            '<span class="util-hotline-name">ปภ.</span>' +
          '</a>' +

          '<span class="util-hdot" aria-hidden="true">·</span>' +

          '<a href="tel:1182" aria-label="สายด่วน 1182 กรมอุตุนิยมวิทยา">' +
            '<svg viewBox="0 0 16 16" width="10" height="10" fill="none"' +
                ' stroke="#60a5fa" stroke-width="1.4" stroke-linecap="round"' +
                ' aria-hidden="true">' +
              '<circle cx="8" cy="8" r="2.5"/>' +
              '<path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2' +
                      'M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4' +
                      'M11.2 4.8l-1.4 1.4M4.8 11.2l-1.4 1.4"/>' +
            '</svg>' +
            '<span class="util-hotline-num">1182</span>' +
            '<span class="util-hotline-name">อุตุฯ</span>' +
          '</a>' +

        '</div>' +

        '<div class="util-social" aria-label="โซเชียลมีเดีย">' +

          '<a href="https://lin.ee/U4KAC3H" target="_blank" rel="noopener noreferrer"' +
              ' aria-label="LINE Official Account — Heat Safe Khon Kaen"' +
              ' class="util-social-btn" title="LINE OA">' +
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"' +
                ' aria-hidden="true">' +
              '<path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125' +
                ' h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386' +
                ' c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386' +
                ' c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61V9.86h1.755z' +
                ' m-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031' +
                ' -.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629' +
                ' -.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595' +
                ' .06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108' +
                ' c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z' +
                ' m-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108' +
                ' c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771z' +
                ' m-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108' +
                ' c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756' +
                ' c.348 0 .629.283.629.63 0 .344-.282.629-.629.629' +
                ' M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314' +
                ' c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59' +
                ' .12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645' +
                ' 1.291-.539 6.916-4.07 9.436-6.975C23.176 14.498 24 12.548 24 10.314"/>' +
            '</svg>' +
          '</a>' +

          /* Replace href="#" with actual Facebook URL when available */
          '<a href="#" target="_blank" rel="noopener noreferrer"' +
              ' aria-label="Facebook — Heat Safe Khon Kaen"' +
              ' class="util-social-btn" title="Facebook">' +
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"' +
                ' aria-hidden="true">' +
              '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12' +
                ' c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43' +
                ' c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953' +
                ' H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796' +
                ' v8.385C19.612 23.027 24 18.062 24 12.073z"/>' +
            '</svg>' +
          '</a>' +

        '</div>' +

      '</div>' +
    '</div>';

  document.body.insertBefore(bar, header);

  /* ── Font scale ─────────────────────────────────────────────────────────── */
  const SCALE_STEPS = [0.85, 0.9, 1.0, 1.1, 1.2];

  function getScale() {
    const v = document.documentElement.style.getPropertyValue('--font-scale').trim();
    return v ? parseFloat(v) : 1;
  }

  function applyScale(scale) {
    document.documentElement.style.setProperty('--font-scale', scale);
    localStorage.setItem('hskk-font-scale', scale);
  }

  document.getElementById('util-font-dec').addEventListener('click', function () {
    const cur = getScale();
    const next = SCALE_STEPS.slice().reverse().find(function (s) { return s < cur - 0.01; });
    if (next !== undefined) applyScale(next);
  });

  document.getElementById('util-font-inc').addEventListener('click', function () {
    const cur = getScale();
    const next = SCALE_STEPS.find(function (s) { return s > cur + 0.01; });
    if (next !== undefined) applyScale(next);
  });

  /* ── High contrast ──────────────────────────────────────────────────────── */
  var contrastBtn = document.getElementById('util-contrast');

  function applyContrast(on) {
    document.documentElement.classList.toggle('high-contrast', on);
    contrastBtn.setAttribute('aria-pressed', String(on));
    localStorage.setItem('hskk-contrast', on ? '1' : '0');
  }

  contrastBtn.addEventListener('click', function () {
    applyContrast(!document.documentElement.classList.contains('high-contrast'));
  });
});
