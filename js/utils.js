/* ==========================================================================
   Heat Safe Khon Kaen — utils.js
   Shared helpers loaded first; exposes globals used by all other scripts
   ========================================================================== */
'use strict';

/* var (not const) so other script files can read window.prefersReducedMotion */
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* function declarations are automatically global in non-module scripts */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
