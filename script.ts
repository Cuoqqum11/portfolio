/* Bui Cuong — Portfolio Lab · interactions (TypeScript source)
   Compile: npx tsc script.ts --target ES2017 --lib ES2017,DOM
   (outputs script.js, which index.html already references) */
(() => {
  const prefersReduced: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = <T extends Element>(sel: string, root: ParentNode = document): T[] =>
    Array.from(root.querySelectorAll<T>(sel));

  /* Footer year */
  $$<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* Header hairline on scroll */
  const header = document.querySelector<HTMLElement>('.site-header');
  const onScroll = (): void => {header?.classList.toggle('is-scrolled', window.scrollY > 8)};
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const closeMenu = (): void => {
    header?.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const open = header?.classList.toggle('nav-open') ?? false;
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Smooth scrolling */
  $$<HTMLElement>('a[href^="#"], [data-scroll]').forEach((el) => {
    el.addEventListener('click', (e: Event) => {
      const target: string | null =
        el.dataset.scroll ?? el.getAttribute('href');
      if (!target || target === '#') return;
      const node = document.querySelector<HTMLElement>(target);
      if (!node) return;
      e.preventDefault();
      node.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', target);
      closeMenu();

      if (el.classList.contains('segment-item')) {
        $$<HTMLElement>('.segment-item').forEach((s) => s.classList.remove('is-active'));
        el.classList.add('is-active');
      }
    });
  });

  /* Reveal on scroll */
  const revealEls = $$<HTMLElement>('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* Scroll-spy */
  const navLinks = $$<HTMLAnchorElement>('.nav-link');
  const spyTargets = navLinks
    .map((link) => document.querySelector<HTMLElement>(link.getAttribute('href') ?? ''))
    .filter((t): t is HTMLElement => t !== null);

  if ('IntersectionObserver' in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    spyTargets.forEach((t) => spy.observe(t));
  }
})();