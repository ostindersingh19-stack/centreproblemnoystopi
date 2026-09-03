(() => {
  const loadRefinementLayer = () => {
    if (document.querySelector('link[data-refinement-layer]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/refined.css';
    link.dataset.refinementLayer = 'true';
    document.head.appendChild(link);
  };

  const initAccordionAccessibility = () => {
    document.querySelectorAll('.accordion').forEach((accordion, index) => {
      const button = accordion.querySelector('.accordion-btn');
      const content = accordion.querySelector('.accordion-content');
      if (!button || !content) return;

      const contentId = content.id || `accordion-panel-${index + 1}`;
      content.id = contentId;
      button.type = 'button';
      button.setAttribute('aria-controls', contentId);

      const syncState = () => {
        button.setAttribute('aria-expanded', String(accordion.classList.contains('active')));
      };

      syncState();
      button.addEventListener('click', () => requestAnimationFrame(syncState));
    });
  };

  const initMobileNavigation = () => {
    const nav = document.querySelector('.nav');
    const headerTop = document.querySelector('.header-top');
    if (!nav || !headerTop || document.querySelector('.menu-toggle')) return;

    nav.id = nav.id || 'site-navigation';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="menu-toggle-icon" aria-hidden="true">☰</span><span>Меню</span>';
    headerTop.insertAdjacentElement('afterend', toggle);

    const closeMenu = (returnFocus = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const shouldOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', shouldOpen);
      toggle.setAttribute('aria-expanded', String(shouldOpen));
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
    });
  };

  const improveAccessibility = () => {
    document.querySelectorAll('.socials a').forEach(link => {
      if (link.getAttribute('aria-label')) return;
      const icon = link.querySelector('i');
      if (icon?.classList.contains('fa-telegram')) link.setAttribute('aria-label', 'Telegram');
      if (icon?.classList.contains('fa-vk')) link.setAttribute('aria-label', 'ВКонтакте');
    });

    document.querySelectorAll('img:not([loading])').forEach(img => {
      if (!img.closest('.logo')) {
        img.loading = 'lazy';
        img.decoding = 'async';
      }
    });
  };

  loadRefinementLayer();

  const init = () => {
    initAccordionAccessibility();
    initMobileNavigation();
    improveAccessibility();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
