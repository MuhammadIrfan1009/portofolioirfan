import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScrollInteraction() {
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scroll-progress');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.nav-drawer-link');
  const sectionIds = ['entrance', 'mind', 'toolkit', 'works', 'people', 'connection'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  let activeSectionId = null;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateActiveLink(id) {
    if (!id || id === activeSectionId) return;
    activeSectionId = id;

    // Update desktop links
    desktopLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Update drawer links
    drawerLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Sync URL hash without triggering scroll jump
    if (window.location.hash !== `#${id}`) {
      history.replaceState(null, '', `#${id}`);
    }
  }

  // Try GSAP + ScrollTrigger
  let gsapInitialized = false;
  try {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Scroll progress bar
    if (progressBar) {
      ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const pct = (self.progress * 100).toFixed(2);
          if (isReduced) {
            progressBar.style.width = `${pct}%`;
          } else {
            gsap.to(progressBar, {
              width: `${pct}%`,
              duration: 0.05,
              ease: 'none',
              overwrite: 'auto'
            });
          }
        }
      });
    }

    // 2. Navbar scrolled state
    if (header) {
      ScrollTrigger.create({
        start: 'top -20px',
        onEnter: () => header.classList.add('site-header--scrolled'),
        onLeaveBack: () => header.classList.remove('site-header--scrolled')
      });
    }

    // 3. Active section tracking
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => updateActiveLink(section.id),
        onEnterBack: () => updateActiveLink(section.id)
      });
    });

    gsapInitialized = true;
  } catch (err) {
    console.warn('GSAP ScrollTrigger initialization failed, using standard fallback:', err);
  }

  // Functional fallback if GSAP is unavailable
  if (!gsapInitialized) {
    function onScrollFallback() {
      const scrollY = window.scrollY || window.pageYOffset;

      // Header scrolled state
      if (header) {
        header.classList.toggle('site-header--scrolled', scrollY > 20);
      }

      // Progress bar
      if (progressBar) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        progressBar.style.width = `${pct.toFixed(2)}%`;
      }
    }

    window.addEventListener('scroll', onScrollFallback, { passive: true });
    onScrollFallback();

    // IntersectionObserver for section tracking fallback
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Synchronize browser Back and Forward navigation
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && sectionIds.includes(hash)) {
      updateActiveLink(hash);
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Set initial active section on page load if hash present
  const initialHash = window.location.hash.replace(/^#/, '');
  if (initialHash && sectionIds.includes(initialHash)) {
    updateActiveLink(initialHash);
  } else if (sections.length > 0) {
    updateActiveLink(sections[0].id);
  }
}

