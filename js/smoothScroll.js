import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initSmoothScroll() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) return;

  let currentY = window.scrollY || window.pageYOffset;
  let targetY = currentY;
  let isTicking = false;
  let isAnimating = false;

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }

  function onWheel(e) {
    if (document.querySelector('dialog[open]')) return;

    e.preventDefault();
    const delta = e.deltaY;
    const factor = Math.abs(delta) < 40 ? 1.5 : 1.0;
    targetY = clamp(targetY + delta * factor, 0, maxScroll());

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    const diff = targetY - currentY;
    const ease = 0.095;

    if (Math.abs(diff) > 0.4) {
      currentY += diff * ease;
      window.scrollTo(0, currentY);
      ScrollTrigger.update();
      requestAnimationFrame(update);
    } else {
      currentY = targetY;
      window.scrollTo(0, currentY);
      ScrollTrigger.update();
      isTicking = false;
    }
  }

  function onKey(e) {
    if (document.querySelector('dialog[open]')) return;
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

    let delta = 0;
    if (e.key === 'ArrowDown') delta = 80;
    else if (e.key === 'ArrowUp') delta = -80;
    else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) delta = window.innerHeight * 0.75;
    else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) delta = -window.innerHeight * 0.75;
    else if (e.key === 'Home') delta = -targetY;
    else if (e.key === 'End') delta = maxScroll() - targetY;

    if (delta !== 0) {
      e.preventDefault();
      targetY = clamp(targetY + delta, 0, maxScroll());
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(update);
      }
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);

  window.addEventListener('scroll', () => {
    if (!isTicking && !isAnimating) {
      currentY = window.scrollY || window.pageYOffset;
      targetY = currentY;
    }
  }, { passive: true });

  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - 70;
      targetY = clamp(targetTop, 0, maxScroll());

      isAnimating = true;
      const startY = window.scrollY || window.pageYOffset;
      const dist = targetY - startY;
      const animObj = { progress: 0 };

      gsap.to(animObj, {
        progress: 1,
        duration: 1.05,
        ease: 'power3.inOut',
        onUpdate: () => {
          const nextY = startY + dist * animObj.progress;
          window.scrollTo(0, nextY);
          currentY = nextY;
          ScrollTrigger.update();
        },
        onComplete: () => {
          isAnimating = false;
          currentY = window.scrollY || window.pageYOffset;
          targetY = currentY;
        }
      });
    });
  });
}
