/* ==========================================================================
   Heat Safe Khon Kaen — pwa.js
   Injects <link rel="manifest"> and registers the service worker.
   Must be included on every page. Safe to call multiple times.
   ========================================================================== */
'use strict';

(function () {

  /* ── Manifest link ───────────────────────────────────────────────────── */
  if (!document.querySelector('link[rel="manifest"]')) {
    var link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
  }

  /* ── Service Worker ───────────────────────────────────────────────────── */
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function (reg) {
        /* Silently check for updates every 15 min */
        setInterval(function () { reg.update(); }, 15 * 60 * 1000);
      })
      .catch(function (err) {
        /* Non-critical — fail silently */
        if (window.location.protocol === 'file:') return;
        console.warn('[HSKK SW]', err);
      });
  });

}());
