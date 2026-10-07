/* Bui Cuong — Portfolio Lab · interactions
   Vanilla JS. TypeScript source available in script.ts */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* Footer year ---------------------------------------------------------- */
  $$('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* Header hairline on scroll -------------------------------------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav ------------------------------------------------------------ */
  const toggle = document.querySelector('.nav-toggle');
  const closeMenu = () => {
    if (!header) return;
    header.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && header) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* Smooth scrolling (anchors + data-scroll buttons) ---------------------- */
  $$('a[href^="#"], [data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.scroll || el.getAttribute('href');
      if (!target || target === '#') return;
      const node = document.querySelector(target);
      if (!node) return;
      e.preventDefault();
      node.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', target);
      closeMenu();

      // keep segmented control state in sync
      if (el.classList.contains('segment-item')) {
        $$('.segment-item').forEach((s) => s.classList.remove('is-active'));
        el.classList.add('is-active');
      }
    });
  });

  /* Reveal on scroll ------------------------------------------------------- */
  const revealEls = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* Scroll-spy for nav links ------------------------------------------------ */
  const navLinks = $$('.nav-link');
  const spyTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle(
              'is-current',
              link.getAttribute('href') === `#${entry.target.id}`
            )
          );
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    spyTargets.forEach((t) => spy.observe(t));
  }
})();