/* ==========================================================================
   Heat Safe Khon Kaen — nav.js
   Smooth scroll, sticky header, hamburger, scroll reveal,
   scroll spy, comparison toggle, back-to-top
   ========================================================================== */
'use strict';

/* ── Smooth Scroll ────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      closeMobileMenu();

      if (prefersReducedMotion) {
        target.scrollIntoView();
        target.focus({ preventScroll: true });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Sticky Header ───────────────────────────────────────────────────────── */
function initStickyHeader() {
  const header = $('#site-header');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Hamburger ───────────────────────────────────────────────────────────── */
var menuOpen = false;

function closeMobileMenu() {
  if (!menuOpen) return;
  const nav = $('#main-nav');
  const btn = $('#hamburger');
  if (nav) nav.classList.remove('open');
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  menuOpen = false;
}

function initHamburger() {
  const btn = $('#hamburger');
  const nav = $('#main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    btn.classList.toggle('open', menuOpen);
    nav.classList.toggle('open', menuOpen);
    btn.setAttribute('aria-expanded', String(menuOpen));
  });

  document.addEventListener('click', e => {
    if (menuOpen && !nav.contains(e.target) && !btn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMobileMenu();
  });
}

/* ── Scroll Reveal ───────────────────────────────────────────────────────── */
function initScrollReveal() {
  if (prefersReducedMotion) {
    $$('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => observer.observe(el));
}

/* ── Scroll Spy ──────────────────────────────────────────────────────────── */
function initScrollSpy() {
  const sections = $$('section[id]').filter(s =>
    ['intro','live','comparison','heat-dome','uhi','research','satellite-map','impacts','solutions'].includes(s.id)
  );

  if (!sections.length) return;

  function setActive(id) {
    $$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    $$('.toc-link').forEach(link => {
      link.classList.toggle('active', link.dataset.target === id);
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ── Comparison Toggle ───────────────────────────────────────────────────── */
function initComparisonToggle() {
  const buttons = $$('.toggle-btn');
  const panels  = $$('.toggle-panel');

  if (!buttons.length || !panels.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = `panel-${btn.dataset.panel}`;

      buttons.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach(panel => {
        const isTarget = panel.id === targetId;
        panel.classList.toggle('active', isTarget);
        if (isTarget) { panel.removeAttribute('hidden'); }
        else          { panel.setAttribute('hidden', ''); }
      });
    });
  });
}

/* ── Back to Top ─────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.hidden = window.scrollY <= 600;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const skipLink = $('.skip-link');
    if (skipLink) skipLink.focus();
  });
}
