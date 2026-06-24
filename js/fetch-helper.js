/* ==========================================================================
   Heat Safe Khon Kaen — fetch-helper.js
   Shared fetch utilities: timeout wrapper + generic error UI injector
   ========================================================================== */
'use strict';

/**
 * fetchWithTimeout — wraps fetch with AbortController-based timeout.
 * @param {string}  url
 * @param {object}  options   — fetch init options (optional)
 * @param {number}  timeoutMs — abort after N ms (default 10 000)
 * @returns {Promise<Response>}
 */
function fetchWithTimeout(url, options, timeoutMs) {
  if (timeoutMs === undefined) timeoutMs = 10000;
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, Object.assign({}, options, { signal: ctrl.signal }))
    .then(
      res => { clearTimeout(timer); return res; },
      err => { clearTimeout(timer); throw err; }
    );
}

/**
 * showFetchError — injects an error message + "ลองใหม่" button into container.
 * @param {HTMLElement} container — element to receive error markup
 * @param {Function}    onRetry   — called when retry button is clicked
 */
function showFetchError(container, onRetry) {
  if (!container) return;
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'polite');
  container.innerHTML =
    '<span class="live-error-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 20 20" fill="none" width="20" height="20"' +
          ' stroke="currentColor" stroke-width="1.6"' +
          ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M10 3L2 17h16L10 3z"/>' +
        '<line x1="10" y1="9" x2="10" y2="12.5"/>' +
        '<circle cx="10" cy="14.5" r="0.8" fill="currentColor" stroke="none"/>' +
      '</svg>' +
    '</span>' +
    '<p>โหลดข้อมูลไม่สำเร็จ</p>' +
    '<button type="button" class="btn btn-outline btn-sm">ลองใหม่</button>';

  if (typeof onRetry === 'function') {
    container.querySelector('button').addEventListener('click', onRetry);
  }
}
