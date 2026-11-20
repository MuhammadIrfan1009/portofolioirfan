export function initCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isFinePointer || isReduced) return;

  document.documentElement.classList.add('has-custom-cursor');

  let cursorContainer = document.querySelector('.atelier-cursor');
  if (!cursorContainer) {
    cursorContainer = document.createElement('div');
    cursorContainer.className = 'atelier-cursor';
    cursorContainer.setAttribute('aria-hidden', 'true');
    cursorContainer.innerHTML = '<div class="atelier-cursor-dot"></div><div class="atelier-cursor-ring"><span class="atelier-cursor-text"></span></div>';
    document.body.appendChild(cursorContainer);
  }

  let certPreview = document.querySelector('.cursor-cert-preview');
  if (!certPreview) {
    certPreview = document.createElement('div');
    certPreview.className = 'cursor-cert-preview';
    certPreview.setAttribute('aria-hidden', 'true');
    certPreview.innerHTML = '<img src="" alt="" loading="eager">';
    document.body.appendChild(certPreview);
  }
  const certImg = certPreview.querySelector('img');

  const dot = cursorContainer.querySelector('.atelier-cursor-dot');
  const ring = cursorContainer.querySelector('.atelier-cursor-ring');
  const label = cursorContainer.querySelector('.atelier-cursor-text');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let certX = -300;
  let certY = -300;
  let targetCertX = -300;
  let targetCertY = -300;
  let isVisible = false;
  let isCertActive = false;
  let lastTarget = null;
  let rafId = null;

  function showCursor() {
    if (!isVisible) {
      isVisible = true;
      cursorContainer.classList.add('is-active');
    }
  }

  function hideCursor() {
    isVisible = false;
    cursorContainer.classList.remove('is-active');
    if (certPreview) certPreview.classList.remove('is-active');
  }

  // V3: Use transform3d for GPU compositing, batch reads/writes
  function updatePositions() {
    if (isVisible) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      if (isCertActive && certPreview) {
        certX += (targetCertX - certX) * 0.2;
        certY += (targetCertY - certY) * 0.2;
        certPreview.style.transform = `translate3d(${certX}px, ${certY}px, 0)`;
      }
    }
    rafId = requestAnimationFrame(updatePositions);
  }

  // V3: Passive mousemove — no throttle needed since updatePositions is rAF-bound
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      ringX = mouseX;
      ringY = mouseY;
      showCursor();
    }

    if (isCertActive) {
      const previewWidth = 270;
      const previewHeight = 185;
      targetCertX = mouseX + 28;
      targetCertY = mouseY - 90;
      if (targetCertX + previewWidth > window.innerWidth - 16) {
        targetCertX = mouseX - previewWidth - 24;
      }
      if (targetCertY < 16) {
        targetCertY = 16;
      } else if (targetCertY + previewHeight > window.innerHeight - 16) {
        targetCertY = window.innerHeight - previewHeight - 16;
      }
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    hideCursor();
  });

  document.addEventListener('mouseenter', () => {
    showCursor();
  });

  function setCursorState(state, text = '') {
    cursorContainer.classList.remove('is-hover-link', 'is-hover-btn', 'is-hover-card', 'is-hover-cert', 'has-label');
    if (label) label.textContent = text;
    if (text) {
      cursorContainer.classList.add('has-label');
    }
    if (state) {
      cursorContainer.classList.add(state);
    }
  }

  // V3: Event delegation — single listener instead of per-element
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target || target === lastTarget) return;
    lastTarget = target;

    const certCard = target.closest('.timeline-entry--has-cert');
    if (certCard) {
      const thumb = certCard.getAttribute('data-cert-thumb') || certCard.getAttribute('data-cert-src');
      if (thumb && certImg && certImg.getAttribute('src') !== thumb) {
        certImg.setAttribute('src', thumb);
      }
      if (certPreview) certPreview.classList.add('is-active');
      isCertActive = true;
      setCursorState('is-hover-card', 'OPEN');
      return;
    } else {
      if (certPreview) certPreview.classList.remove('is-active');
      isCertActive = false;
    }

    const projectCard = target.closest('.project-card');
    if (projectCard) {
      setCursorState('is-hover-card', 'OPEN');
      return;
    }

    const mindCard = target.closest('.mind-card');
    if (mindCard) {
      setCursorState('is-hover-card', 'MIND');
      return;
    }

    const apparatus = target.closest('#atelier-3d-canvas, .entrance-apparatus');
    if (apparatus) {
      setCursorState('is-hover-card', 'ORBIT');
      return;
    }

    const dialogCloseBtn = target.closest('.project-dialog-close, .certificate-dialog-close, .toolkit-dialog-close');
    if (dialogCloseBtn) {
      setCursorState('is-hover-btn', 'CLOSE');
      return;
    }

    const dialogLink = target.closest('.project-dialog-link');
    if (dialogLink) {
      setCursorState('is-hover-link', 'VISIT');
      return;
    }

    // V3: Added .btn--secondary, .btn--cv, .nav-cv-btn, .nav-drawer-cv-btn
    const button = target.closest('button, .btn, .nav-menu-btn, .theme-toggle, .works-filter-btn, .nav-cv-btn');
    if (button) {
      setCursorState('is-hover-btn', '');
      return;
    }

    const link = target.closest('a, .toolkit-tag');
    if (link) {
      setCursorState('is-hover-link', '');
      return;
    }

    setCursorState('');
  }, { passive: true });

  rafId = requestAnimationFrame(updatePositions);
}
