(() => {
  const refinedStyles = document.createElement('link');
  refinedStyles.rel = 'stylesheet';
  refinedStyles.href = 'css/refined.css';
  document.head.appendChild(refinedStyles);

  const nav = document.querySelector('.nav');
  const headerTop = document.querySelector('.header-top');

  if (nav && headerTop && !document.querySelector('.menu-toggle')) {
    nav.id = nav.id || 'site-navigation';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span aria-hidden="true">☰</span><span>Меню</span>';

    headerTop.insertAdjacentElement('afterend', toggle);

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const willOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  document.querySelectorAll('.socials a').forEach(link => {
    if (link.getAttribute('aria-label')) return;
    const icon = link.querySelector('i');
    if (icon?.classList.contains('fa-telegram')) link.setAttribute('aria-label', 'Telegram');
    if (icon?.classList.contains('fa-vk')) link.setAttribute('aria-label', 'ВКонтакте');
  });

  document.querySelectorAll('img:not([loading])').forEach(img => {
    if (!img.closest('.logo') && !img.closest('.promo')) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  });
})();
