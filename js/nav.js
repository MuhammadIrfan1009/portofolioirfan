export function initNavigation() {
  const menuBtn = document.getElementById('nav-menu-btn');
  const dialog = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('nav-drawer-close');
  const drawerLinks = document.querySelectorAll('.nav-drawer-link');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const brandLink = document.querySelector('.nav-brand');

  if (!menuBtn || !dialog) return;

  let closeReason = 'dismiss';
  let pendingNavigationTarget = null;

  menuBtn.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'true');
    dialog.showModal();
  });

  dialog.addEventListener('cancel', () => {
    closeReason = 'dismiss';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeReason = 'dismiss';
      dialog.close();
    });
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeReason = 'dismiss';
        dialog.close();
      }
    }
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      event.preventDefault();
      pendingNavigationTarget = href;
      closeReason = 'navigate';
      dialog.close();
    });
  });

  dialog.addEventListener('close', () => {
    menuBtn.setAttribute('aria-expanded', 'false');

    const reason = closeReason;
    const target = pendingNavigationTarget;

    closeReason = 'dismiss';
    pendingNavigationTarget = null;

    requestAnimationFrame(() => {
      if (reason === 'navigate' && target) {
        const targetId = target.replace(/^#/, '');
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        history.pushState(null, '', target);
        targetEl.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' });
        targetEl.focus({ preventScroll: true });
        return;
      }

      menuBtn.focus();
    });
  });

  function handleSmoothNav(event, link) {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    const targetId = href.replace(/^#/, '');
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    history.pushState(null, '', href);
    targetEl.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' });
    targetEl.focus({ preventScroll: true });
  }

  desktopLinks.forEach((link) => {
    link.addEventListener('click', (e) => handleSmoothNav(e, link));
  });

  if (brandLink) {
    brandLink.addEventListener('click', (e) => handleSmoothNav(e, brandLink));
  }

  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      const targetEl = document.getElementById(hash.substring(1));
      if (targetEl) {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetEl.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' });
        targetEl.focus({ preventScroll: true });
      }
    }
  });
}
