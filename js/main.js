/* ==========================================================================
   Heat Safe Khon Kaen — main.js
   Entry point: initialises all features on DOMContentLoaded
   Load order in index.html:
     config.js → js/utils.js → js/nav.js → js/widgets.js → js/live.js → js/map.js → js/main.js
   ========================================================================== */
'use strict';

function initSupabase() {
  const sbCfg = window.HSKK_CONFIG?.supabase;
  if (!sbCfg?.url || !sbCfg?.anonKey) return null;
  if (typeof supabase === 'undefined') {
    console.warn('[supabase] CDN script not loaded — uncomment it in index.html');
    return null;
  }
  return supabase.createClient(sbCfg.url, sbCfg.anonKey);
}

window.hskk_supabase = null;

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initScrollSpy();
  initComparisonToggle();
  initBackToTop();
  initTempWidget();
  initLiveData();
  initSatelliteMap();
  window.hskk_supabase = initSupabase();
});
