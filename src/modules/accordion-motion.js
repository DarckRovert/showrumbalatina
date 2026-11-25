export function initAccordionAndMotion() {
  // 1. Acordeón FAQ: botón Expandir todo / Contraer todo sincronizado con eventos toggle
  const accordion = document.getElementById('faq-accordion');
  const toggleBtn = document.querySelector('[data-faq-toggle]');

  if (accordion && toggleBtn) {
    const getItems = () => Array.from(accordion.querySelectorAll('details.faq-item'));

    toggleBtn.addEventListener('click', () => {
      const expand = toggleBtn.getAttribute('aria-expanded') !== 'true';
      getItems().forEach((d) => {
        d.open = expand;
      });
      toggleBtn.setAttribute('aria-expanded', String(expand));
    });

    accordion.addEventListener(
      'toggle',
      (e) => {
        if (!e.target.matches?.('details.faq-item')) return;
        const items = getItems();
        const allOpen = items.length > 0 && items.every((d) => d.open);
        toggleBtn.setAttribute('aria-expanded', String(allOpen));
      },
      { capture: true }
    );
  }

  // 2. Fallback de animaciones de entrada al hacer scroll cuando no existe CSS scroll-driven
  const supportsScrollReveal = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  const allowsMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  if (!supportsScrollReveal && allowsMotion) {
    const items = Array.from(document.querySelectorAll('.reveal-item'));
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-js-pending');
            entry.target.classList.add('reveal-js-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.92) {
        el.classList.add('reveal-js-pending');
        observer.observe(el);
      }
    });
  }
}
