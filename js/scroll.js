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
  let hashTimer = null;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateActiveLink(id) {
    if (!id || id === activeSectionId) return;
    activeSectionId = id;

    desktopLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    drawerLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', match);
      if (match) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (hashTimer) clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      if (window.location.hash !== `#${id}`) {
        try {
          history.replaceState(null, '', `#${id}`);
        } catch (err) {}
      }
    }, 150);
  }

  let gsapInitialized = false;
  try {
    gsap.registerPlugin(ScrollTrigger);

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

    if (header) {
      ScrollTrigger.create({
        start: 'top -20px',
        onEnter: () => header.classList.add('site-header--scrolled'),
        onLeaveBack: () => header.classList.remove('site-header--scrolled')
      });
    }

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
  }

  if (!gsapInitialized) {
    function onScrollFallback() {
      const scrollY = window.scrollY || window.pageYOffset;

      if (header) {
        header.classList.toggle('site-header--scrolled', scrollY > 20);
      }

      if (progressBar) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        progressBar.style.width = `${pct.toFixed(2)}%`;
      }
    }

    window.addEventListener('scroll', onScrollFallback, { passive: true });
    onScrollFallback();

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

  const initialHash = window.location.hash.replace(/^#/, '');
  if (initialHash && sectionIds.includes(initialHash)) {
    updateActiveLink(initialHash);
  } else if (sections.length > 0) {
    updateActiveLink(sections[0].id);
  }
}
