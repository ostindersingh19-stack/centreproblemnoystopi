(() => {
  const loadStylesheet = (href, key) => {
    if (document.querySelector(`link[data-site-layer="${key}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.siteLayer = key;
    document.head.appendChild(link);
  };

  const loadRefinementLayers = () => {
    loadStylesheet('css/refined.css', 'refined');
    loadStylesheet('css/pages.css', 'pages');
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

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  };

  const improveForms = () => {
    document.querySelectorAll('.cta-form').forEach(form => {
      const nameInput = form.querySelector('input[type="text"]');
      const phoneInput = form.querySelector('input[type="tel"]');

      if (nameInput) {
        nameInput.autocomplete = nameInput.autocomplete || 'name';
        if (!nameInput.getAttribute('aria-label')) {
          nameInput.setAttribute('aria-label', nameInput.placeholder || 'Ваше имя');
        }
      }

      if (phoneInput) {
        phoneInput.autocomplete = phoneInput.autocomplete || 'tel';
        phoneInput.inputMode = phoneInput.inputMode || 'tel';
        if (!phoneInput.getAttribute('aria-label')) {
          phoneInput.setAttribute('aria-label', phoneInput.placeholder || 'Телефон');
        }
      }
    });
  };

  const improveAccessibilityAndMedia = () => {
    document.querySelectorAll('.socials a').forEach(link => {
      if (link.getAttribute('aria-label')) return;
      const icon = link.querySelector('i');
      if (icon?.classList.contains('fa-telegram')) link.setAttribute('aria-label', 'Telegram');
      if (icon?.classList.contains('fa-vk')) link.setAttribute('aria-label', 'ВКонтакте');
    });

    document.querySelectorAll('.contacts-map iframe').forEach(frame => {
      if (!frame.getAttribute('title')) frame.setAttribute('title', 'Карта с расположением центра');
    });

    const serviceImages = [...document.querySelectorAll('.services .service-image img')];
    const priorityImages = new Set(serviceImages.slice(0, 3));

    document.querySelectorAll('img').forEach(img => {
      if (priorityImages.has(img)) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.decoding = 'async';
      } else if (!img.closest('.logo') && !img.hasAttribute('loading')) {
        img.loading = 'lazy';
        img.decoding = 'async';
      }

      const hideBrokenImage = () => {
        img.hidden = true;
        img.closest('.service-image')?.classList.add('is-image-missing');
      };

      if (img.getAttribute('src')?.endsWith('/.jpg')) {
        hideBrokenImage();
      } else {
        img.addEventListener('error', hideBrokenImage, { once: true });
      }
    });
  };

  loadRefinementLayers();

  const init = () => {
    initAccordionAccessibility();
    initMobileNavigation();
    improveForms();
    improveAccessibilityAndMedia();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
