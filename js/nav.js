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

  // Open drawer via showModal()
  menuBtn.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'true');
    dialog.showModal();
  });

  // Escape key handler: set reason only, native cancellation proceeds
  dialog.addEventListener('cancel', () => {
    closeReason = 'dismiss';
  });

  // Explicit close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeReason = 'dismiss';
      dialog.close();
    });
  }

  // Backdrop click dismissal
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

  // Internal mobile drawer link navigation
  drawerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      // Preserve modified and auxiliary clicks (Ctrl, Meta, Shift, Alt, middle-click)
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      event.preventDefault();
      pendingNavigationTarget = href;
      closeReason = 'navigate';
      dialog.close();
    });
  });

  // Centralized close lifecycle
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

      // Dismissal path: return focus to trigger
      menuBtn.focus();
    });
  });

  // Desktop navigation links and brand link
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

  // Handle browser back/forward (popstate)
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
