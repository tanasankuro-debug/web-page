/* skeleton.js — Page loading overlay injection & removal
   Heat Safe Khon Kaen */
(function () {
  'use strict';

  var OVERLAY_ID = 'page-sk-overlay';

  var overlayHTML =
    '<div class="pso-inner">' +
      '<div class="pso-logo">' +
        '<div class="pso-logo-icon">🌡️</div>' +
        '<div class="pso-logo-text">' +
          '<span class="pso-logo-heat">Heat Safe</span>' +
          '<span class="pso-logo-city">Khon Kaen</span>' +
        '</div>' +
      '</div>' +
      '<div class="pso-bar"><div class="pso-bar-inner"></div></div>' +
    '</div>';

  /* ── Inject overlay as first child of <body> ─────────────── */
  function injectOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    var el = document.createElement('div');
    el.id = OVERLAY_ID;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'กำลังโหลด');
    el.innerHTML = overlayHTML;
    var body = document.body;
    body.insertBefore(el, body.firstChild);
  }

  if (document.body) {
    injectOverlay();
  } else {
    /* Watch for <body> creation (script runs in <head>) */
    var obs = new MutationObserver(function (_, observer) {
      if (document.body) {
        observer.disconnect();
        injectOverlay();
      }
    });
    obs.observe(document.documentElement, { childList: true });
    /* Safety fallback */
    setTimeout(injectOverlay, 0);
  }

  /* ── Hide overlay when fonts + DOM are ready ─────────────── */
  function hideSkeleton() {
    var el = document.getElementById(OVERLAY_ID);
    if (!el || el._out) return;
    el._out = true;
    el.classList.add('pso-out');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (document.fonts && document.fonts.ready) {
        var t = setTimeout(hideSkeleton, 1500);
        document.fonts.ready
          .then(function () { clearTimeout(t); setTimeout(hideSkeleton, 60); })
          .catch(function () { clearTimeout(t); hideSkeleton(); });
      } else {
        setTimeout(hideSkeleton, 300);
      }
    });
  } else {
    setTimeout(hideSkeleton, 60);
  }
})();
