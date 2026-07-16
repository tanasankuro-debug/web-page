/* ==========================================================================
   Heat Safe Khon Kaen — Service Worker (sw.js)
   Must live at root / to control the full origin.
   Strategy:
     - Open-Meteo API: network-first, cache fallback (shows "ข้อมูลออฟไลน์" badge)
     - Navigation:     network-first, offline.html fallback
     - Static assets:  cache-first, network fallback + cache update
   ========================================================================== */
'use strict';

var CACHE = 'hskk-v1';
var OFFLINE = '/html/offline.html';

var PRECACHE = [
  '/',
  '/html/offline.html',
  '/css/base.css',
  '/css/layout.css',
  '/assets/favicon.svg'
];

var API_HOSTS = [
  'api.open-meteo.com',
  'air-quality-api.open-meteo.com'
];

/* ── Install: pre-cache offline shell ─────────────────────────────────── */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(PRECACHE);
    }).then(function () { self.skipWaiting(); })
  );
});

/* ── Activate: prune old caches ───────────────────────────────────────── */
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { self.clients.claim(); })
  );
});

/* ── Fetch ────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = req.url;

  /* Only handle GET */
  if (req.method !== 'GET') return;

  /* External APIs (Supabase, CDN etc.) — let browser handle directly */
  if (url.indexOf('supabase.co') !== -1 ||
      url.indexOf('cdn.jsdelivr.net') !== -1 ||
      url.indexOf('fonts.googleapis.com') !== -1 ||
      url.indexOf('fonts.gstatic.com') !== -1) return;

  /* Open-Meteo API: network-first, stale cache as fallback */
  if (API_HOSTS.some(function (h) { return url.indexOf(h) !== -1; })) {
    e.respondWith(
      fetch(req).then(function (res) {
        /* Clone before consuming */
        var clone = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, clone); });
        return res;
      }).catch(function () {
        return caches.match(req);
      })
    );
    return;
  }

  /* Navigation: network-first, offline page fallback */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(function () {
        return caches.match(OFFLINE);
      })
    );
    return;
  }

  /* Static assets: cache-first, network fallback */
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type !== 'opaque') {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, clone); });
        }
        return res;
      });
    })
  );
});
