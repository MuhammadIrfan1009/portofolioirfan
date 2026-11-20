import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.works-filter-btn');
  const cards = document.querySelectorAll('.section--works .project-card');
  if (filterBtns.length === 0 || cards.length === 0) return;

  let isAnimating = false;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isAnimating) return;

      const filter = btn.getAttribute('data-filter') || 'all';

      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      isAnimating = true;
      let completed = 0;
      const total = cards.length;

      const onDone = () => {
        completed++;
        if (completed >= total) {
          isAnimating = false;
          try { ScrollTrigger.refresh(); } catch (e) {}
        }
      };

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const matches = filter === 'all' || cat === filter;

        if (matches) {
          card.style.display = 'flex';
          if (!isReduced) {
            gsap.fromTo(card,
              { opacity: 0, y: 25, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: 'power3.out',
                overwrite: 'auto',
                onComplete: onDone
              }
            );
          } else {
            card.style.opacity = '1';
            card.style.transform = 'none';
            onDone();
          }
        } else {
          if (!isReduced) {
            gsap.to(card, {
              opacity: 0,
              scale: 0.94,
              duration: 0.25,
              ease: 'power2.in',
              overwrite: 'auto',
              onComplete: () => {
                card.style.display = 'none';
                onDone();
              }
            });
          } else {
            card.style.display = 'none';
            onDone();
          }
        }
      });
    });
  });
}
