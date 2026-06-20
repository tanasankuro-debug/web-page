/* ==========================================================================
   Layer Panel — js/layer-panel.js
   Floating overlay-layer toggle panel for map.html.
   Exposes:    window.LayerRegistry
   Depends on: window.HeatLayer (heat-layer.js, loaded before this)
   ========================================================================== */
'use strict';

/* ── LayerRegistry — thin registry for extensible overlay layers ────────── */
const LayerRegistry = (() => {
  const _reg = {};

  return {
    register(id, config) {
      _reg[id] = { ...config, active: false, loading: false };
    },

    toggle(id) {
      const layer = _reg[id];
      if (!layer) return;
      if (layer.active) {
        layer.disable?.();
        layer.active = false;
      } else {
        layer.enable?.();
        layer.active = true;
      }
      this.updateUI();
    },

    setLayerLoading(id, loading) {
      if (_reg[id]) _reg[id].loading = loading;
      this.updateUI();
    },

    isActive(id) { return _reg[id]?.active ?? false; },

    updateUI() {
      for (const [id, layer] of Object.entries(_reg)) {
        const btn = document.querySelector(`[data-overlay-layer="${id}"]`);
        if (!btn) continue;
        btn.classList.toggle('lp-active',  layer.active);
        btn.classList.toggle('lp-loading', layer.loading);
        btn.setAttribute('aria-pressed', String(layer.active));
      }
      // Time selector is visible only when heat layer is active
      const ts = document.getElementById('lp-time-sel');
      if (ts) ts.style.display = _reg['heat']?.active ? '' : 'none';
    },
  };
})();

window.LayerRegistry = LayerRegistry;

/* ── Floating panel ─────────────────────────────────────────────────────── */
function initLayerPanel() {
  const canvas = document.querySelector('.map-canvas');
  if (!canvas) return;

  const panel = document.createElement('div');
  panel.id = 'lp-panel';
  panel.setAttribute('aria-label', 'เลเยอร์ข้อมูลบนแผนที่');

  panel.innerHTML = `
    <div id="lp-header" tabindex="0" role="button"
         aria-expanded="true" aria-controls="lp-body">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           width="12" height="12" aria-hidden="true">
        <rect x="1"  y="4"    width="22" height="3.5" rx="1.5"/>
        <rect x="1"  y="10.5" width="17" height="3.5" rx="1.5"/>
        <rect x="1"  y="17"   width="12" height="3.5" rx="1.5"/>
      </svg>
      <span>เลเยอร์ข้อมูล</span>
      <button id="lp-collapse-btn" aria-label="ย่อ/ขยาย" tabindex="-1">
        <svg viewBox="0 0 10 6" width="9" height="9" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <path d="M1 1l4 4 4-4"/>
        </svg>
      </button>
    </div>

    <div id="lp-body">
      <div id="lp-layers">

        <!-- Heat layer -->
        <button class="lp-layer-btn" data-overlay-layer="heat" aria-pressed="false">
          <span class="lp-dot" style="background:#fb923c;"></span>
          <span class="lp-label">ความร้อน</span>
          <span class="lp-badge">26 จุด</span>
        </button>

        <!-- Future: AQI -->
        <button class="lp-layer-btn lp-disabled" data-lp-soon aria-disabled="true">
          <span class="lp-dot" style="background:#a78bfa;"></span>
          <span class="lp-label">AQI</span>
          <span class="lp-badge">เร็วๆนี้</span>
        </button>

        <!-- Future: Rain -->
        <button class="lp-layer-btn lp-disabled" data-lp-soon aria-disabled="true">
          <span class="lp-dot" style="background:#60a5fa;"></span>
          <span class="lp-label">ฝน/พยากรณ์</span>
          <span class="lp-badge">เร็วๆนี้</span>
        </button>

      </div>

      <!-- Coming-soon toast (hidden by default) -->
      <div id="lp-soon-toast" aria-live="polite" aria-atomic="true"></div>

      <!-- Time selector — shown only when heat layer is active -->
      <div id="lp-time-sel" style="display:none;" aria-label="เลือกช่วงเวลา">
        <div id="lp-divider"></div>
        <div class="lp-time-lbl">ช่วงเวลา</div>
        <div class="lp-time-row" role="group" aria-label="ช่วงเวลา">
          <button class="lp-time-btn" data-lp-slot="morning">เช้า<span>06:00</span></button>
          <button class="lp-time-btn" data-lp-slot="noon">กลางวัน<span>12:00</span></button>
          <button class="lp-time-btn" data-lp-slot="evening">เย็น<span>18:00</span></button>
          <button class="lp-time-btn lp-time-active" data-lp-slot="now">ตอนนี้<span>Live</span></button>
        </div>
      </div>
    </div>`;

  canvas.appendChild(panel);

  /* ── Collapse / expand ── */
  const collapseBtn = document.getElementById('lp-collapse-btn');
  const lpHeader    = document.getElementById('lp-header');
  const lpBody      = document.getElementById('lp-body');

  function setCollapsed(collapsed) {
    lpBody.style.display = collapsed ? 'none' : '';
    collapseBtn.classList.toggle('lp-collapsed', collapsed);
    lpHeader.setAttribute('aria-expanded', String(!collapsed));
  }

  collapseBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = lpBody.style.display !== 'none';
    setCollapsed(isOpen);
  });
  lpHeader.addEventListener('click', () => {
    const isOpen = lpBody.style.display !== 'none';
    setCollapsed(isOpen);
  });
  lpHeader.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isOpen = lpBody.style.display !== 'none';
      setCollapsed(isOpen);
    }
  });

  // Auto-collapse on very small screens to save space
  if (window.innerWidth <= 480) setCollapsed(true);

  /* ── Layer toggle buttons ── */
  document.querySelectorAll('[data-overlay-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      LayerRegistry.toggle(btn.dataset.overlayLayer);
    });
  });

  /* ── Coming-soon buttons ── */
  let _soonTimer = null;
  document.querySelectorAll('[data-lp-soon]').forEach(btn => {
    btn.addEventListener('click', () => {
      const toast = document.getElementById('lp-soon-toast');
      if (!toast) return;
      toast.textContent = '🚧 กำลังพัฒนา — เร็วๆนี้';
      toast.classList.add('lp-soon-show');
      clearTimeout(_soonTimer);
      _soonTimer = setTimeout(() => {
        toast.classList.remove('lp-soon-show');
      }, 2200);
    });
  });

  /* ── Time slot buttons ── */
  document.querySelectorAll('[data-lp-slot]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-lp-slot]')
        .forEach(b => b.classList.remove('lp-time-active'));
      btn.classList.add('lp-time-active');
      window.HeatLayer?.setTimeSlot(btn.dataset.lpSlot);
    });
  });

  /* ── Register overlay layers ── */
  LayerRegistry.register('heat', {
    enable:  () => window.HeatLayer?.enable(),
    disable: () => window.HeatLayer?.disable(),
  });
}

document.addEventListener('DOMContentLoaded', initLayerPanel);
