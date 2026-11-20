import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initMotion() {
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) {
    document.body.classList.add('reduced-motion');
    const shutter = document.getElementById('atelier-shutter');
    if (shutter) shutter.style.display = 'none';
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (err) {
    return;
  }

  document.body.classList.add('motion-ready');

  initCinematicOpening();
  initBlueprintParallax();
  initKineticWatermarks();
  initSectionTransitions();
  initSectionStorytelling();
  initInteractiveCardPhysics();
  initMagneticElements();
}

function initCinematicOpening() {
  const entrance = document.querySelector('.section--entrance');
  const shutter = document.getElementById('atelier-shutter');
  if (!entrance || !shutter) return;

  const isMobile = window.matchMedia('(max-width: 899px)').matches;
  const topPanel = shutter.querySelector('.shutter-panel--top');
  const bottomPanel = shutter.querySelector('.shutter-panel--bottom');
  const centerLine = shutter.querySelector('.shutter-center-line');
  const calibration = shutter.querySelector('.shutter-calibration');
  const brandMark = shutter.querySelector('.shutter-brand-mark');
  const brandTitle = shutter.querySelector('.shutter-brand-title');
  const brandSub = shutter.querySelector('.shutter-brand-sub');
  const progressBar = shutter.querySelector('.shutter-progress-bar');
  const counterEl = shutter.querySelector('.shutter-counter');

  const progressCounter = { val: 0 };

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      shutter.style.display = 'none';
    }
  });

  // Failsafe: guarantee shutter never locks screen if page/tab is backgrounded
  setTimeout(() => {
    if (shutter && shutter.style.display !== 'none') {
      shutter.style.display = 'none';
    }
  }, 2200);

  if (calibration) {
    tl.fromTo(brandMark,
      { opacity: 0, scale: 0.6, rotate: -45 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2)' },
      0.05
    );

    tl.fromTo([brandTitle, brandSub],
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
      0.15
    );

    if (progressBar && counterEl) {
      tl.to(progressBar, { width: '100%', duration: 0.6, ease: 'power2.inOut' }, 0.2);
      tl.to(progressCounter, {
        val: 100,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          const num = Math.round(progressCounter.val);
          counterEl.textContent = `${num < 10 ? '0' + num : num}%`;
        }
      }, 0.2);
    }

    tl.to(calibration, { opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in' }, 0.8);
  }

  if (centerLine) {
    tl.to(centerLine, { scaleX: 1, duration: 0.35, ease: 'expo.inOut' }, 0.85);
    tl.to(centerLine, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 1.15);
  }

  if (topPanel && bottomPanel) {
    tl.to(topPanel, { yPercent: -100, duration: isMobile ? 0.65 : 0.8, ease: 'power4.inOut' }, 0.95);
    tl.to(bottomPanel, { yPercent: 100, duration: isMobile ? 0.65 : 0.8, ease: 'power4.inOut' }, 0.95);
  }

  const grid = entrance.querySelector('.blueprint-grid');
  if (grid) {
    tl.to(grid, { opacity: 0.14, duration: 0.8, ease: 'power2.out' }, 1.1);
  }

  const avatar = entrance.querySelector('.entrance-avatar');
  if (avatar) {
    avatar.classList.add('hero-reveal--avatar');
    tl.to(avatar, { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.5)' }, 1.2);
  }

  const telemetry = entrance.querySelector('.entrance-telemetry');
  if (telemetry) {
    tl.fromTo(telemetry,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      1.25
    );
  }

  const indexLabel = entrance.querySelector('.section-index-label');
  if (indexLabel) {
    indexLabel.classList.add('hero-reveal--eyebrow');
    tl.to(indexLabel, { opacity: 1, y: 0, duration: 0.4 }, 1.3);
  }

  const name = entrance.querySelector('.entrance-name');
  if (name) {
    name.classList.add('hero-reveal--name');
    tl.to(name, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.85,
      ease: 'power4.out'
    }, 1.35);
  }

  const gpa = entrance.querySelector('.entrance-gpa');
  if (gpa) {
    gpa.classList.add('hero-reveal');
    tl.to(gpa, { opacity: 1, y: 0, duration: 0.4 }, 1.5);
  }

  const tagline = entrance.querySelector('.entrance-tagline');
  if (tagline) {
    tagline.classList.add('hero-reveal');
    tl.to(tagline, { opacity: 1, y: 0, duration: 0.45 }, 1.6);
  }

  const actions = entrance.querySelector('.entrance-actions');
  if (actions) {
    tl.fromTo(actions,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      1.7
    );
  }

  const copperTrack = entrance.querySelector('.copper-accent-line .copper-track');
  const copperFlare = entrance.querySelector('.copper-accent-line .copper-flare');

  if (copperTrack) {
    tl.to(copperTrack, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 1.7);
  }

  if (copperFlare) {
    tl.fromTo(copperFlare,
      { attr: { cx: 0 }, opacity: 0 },
      { opacity: 1, duration: 0.12 },
      1.7
    );
    tl.to(copperFlare, {
      attr: { cx: 1200 },
      duration: 0.75,
      ease: 'power2.inOut'
    }, 1.75);
    tl.to(copperFlare, { opacity: 0, duration: 0.15 }, 2.3);
  }
}

function initBlueprintParallax() {
  const grid = document.querySelector('.section--entrance .blueprint-grid');
  if (!grid) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  ScrollTrigger.create({
    trigger: '.section--entrance',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.5,
    onUpdate: (self) => {
      gsap.set(grid, { opacity: 0.14 - self.progress * 0.1 });
    }
  });

  if (canHover) {
    const entrance = document.querySelector('.section--entrance');
    const handleMove = (e) => {
      const rect = entrance.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(grid, {
        x: xPct * 24,
        y: yPct * 16,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };
    entrance.addEventListener('mousemove', handleMove, { passive: true });
    entrance.addEventListener('mouseleave', () => {
      gsap.to(grid, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    });
  }
}

function initKineticWatermarks() {
  const watermarks = [
    { selector: '.section--mind .section-watermark span', xPct: -15 },
    { selector: '.section--toolkit .section-watermark span', xPct: 15 },
    { selector: '.section--works .section-watermark span', xPct: -18 },
    { selector: '.section--people .section-watermark span', xPct: 16 },
    { selector: '.section--connection .section-watermark span', xPct: -14 }
  ];

  watermarks.forEach(({ selector, xPct }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const parentSection = el.closest('.section');
    if (!parentSection) return;

    ScrollTrigger.create({
      trigger: parentSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const offset = (self.progress - 0.5) * xPct;
        gsap.set(el, { xPercent: offset });
      }
    });
  });
}

function initSectionTransitions() {
  const entrance = document.querySelector('.section--entrance');
  const entranceInner = entrance ? entrance.querySelector('.section-inner') : null;
  const canvas3d = document.getElementById('atelier-3d-canvas');
  if (entrance && entranceInner) {
    ScrollTrigger.create({
      trigger: entrance,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(entranceInner, {
          y: p * 40,
          opacity: Math.max(0, 1 - p * 1.25),
          scale: 1 - p * 0.03
        });
        if (canvas3d) {
          gsap.set(canvas3d, {
            scale: 1 - p * 0.08,
            opacity: Math.max(0, 1 - p * 1.3)
          });
        }
      }
    });
  }

  const sections = document.querySelectorAll('.section:not(.section--entrance)');
  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 92%',
      end: 'top 30%',
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(sec, {
          borderTopColor: `rgba(193, 139, 97, ${p * 0.85})`,
          boxShadow: `0 -2px 24px rgba(193, 139, 97, ${p * 0.16})`
        });
      }
    });
  });
}

function animateSectionHeader(section) {
  const indexLabel = section.querySelector('.section-index-label');
  const title = section.querySelector('.section-title');
  const subtitle = section.querySelector('.section-subtitle');

  let ruler = section.querySelector('.section-title-ruler');
  if (!ruler && title) {
    ruler = document.createElement('div');
    ruler.className = 'section-title-ruler';
    ruler.setAttribute('aria-hidden', 'true');
    title.insertAdjacentElement('afterend', ruler);
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (indexLabel) {
    tl.fromTo(indexLabel,
      { opacity: 0, y: -10, letterSpacing: '0.22em' },
      { opacity: 1, y: 0, letterSpacing: 'var(--tracking-widest)', duration: 0.55 },
      0
    );
  }

  if (title) {
    tl.fromTo(title,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
      0.06
    );
  }

  if (ruler) {
    tl.fromTo(ruler,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.75, ease: 'power3.inOut' },
      0.14
    );
  }

  if (subtitle) {
    tl.fromTo(subtitle,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55 },
      0.22
    );
  }

  return tl;
}

function initSectionStorytelling() {
  const mind = document.querySelector('.section--mind');
  if (mind) {
    const cards = mind.querySelectorAll('.mind-card');
    const bio = mind.querySelector('.mind-bio');
    let revealed = false;

    const revealMind = () => {
      if (revealed) return;
      revealed = true;
      animateSectionHeader(mind);

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      if (bio) {
        gsap.to(bio, { opacity: 1, y: 0, duration: 0.75, delay: 0.35, ease: 'power3.out', overwrite: 'auto' });
      }
    };

    ScrollTrigger.create({
      trigger: mind,
      start: 'top 85%',
      once: true,
      onEnter: revealMind,
      onRefresh: (self) => {
        if (self.progress > 0) revealMind();
      }
    });
  }

  const toolkit = document.querySelector('.section--toolkit');
  if (toolkit) {
    let revealed = false;

    const revealToolkit = () => {
      if (revealed) return;
      revealed = true;
      animateSectionHeader(toolkit);

      const domains = toolkit.querySelectorAll('.toolkit-domain');
      domains.forEach((domain, idx) => {
        gsap.to(domain, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: 0.08 * idx,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        const tags = domain.querySelectorAll('.toolkit-tag');
        if (tags.length > 0) {
          gsap.to(tags, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.02,
            delay: 0.15 + 0.08 * idx,
            ease: 'back.out(1.6)',
            overwrite: 'auto'
          });
        }
      });
    };

    ScrollTrigger.create({
      trigger: toolkit,
      start: 'top 85%',
      once: true,
      onEnter: revealToolkit,
      onRefresh: (self) => {
        if (self.progress > 0) revealToolkit();
      }
    });
  }

  const works = document.querySelector('.section--works');
  if (works) {
    let headerRevealed = false;
    const revealWorksHeader = () => {
      if (headerRevealed) return;
      headerRevealed = true;
      animateSectionHeader(works);
    };

    ScrollTrigger.create({
      trigger: works,
      start: 'top 85%',
      once: true,
      onEnter: revealWorksHeader,
      onRefresh: (self) => {
        if (self.progress > 0) revealWorksHeader();
      }
    });

    const featured = works.querySelector('.project-card--featured');
    if (featured) {
      let featuredRevealed = false;
      const revealFeatured = () => {
        if (featuredRevealed) return;
        featuredRevealed = true;
        gsap.to(featured, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: 0.08,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      };

      ScrollTrigger.create({
        trigger: featured,
        start: 'top 88%',
        once: true,
        onEnter: revealFeatured,
        onRefresh: (self) => {
          if (self.progress > 0) revealFeatured();
        }
      });
    }

    const standardCards = works.querySelectorAll('.project-card:not(.project-card--featured)');
    standardCards.forEach((card, idx) => {
      let cardRevealed = false;
      const revealCard = () => {
        if (cardRevealed) return;
        cardRevealed = true;
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: (idx % 2) * 0.1,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      };

      ScrollTrigger.create({
        trigger: card,
        start: 'top 92%',
        once: true,
        onEnter: revealCard,
        onRefresh: (self) => {
          if (self.progress > 0) revealCard();
        }
      });
    });
  }

  const people = document.querySelector('.section--people');
  if (people) {
    let headerRevealed = false;
    const revealPeopleHeader = () => {
      if (headerRevealed) return;
      headerRevealed = true;
      animateSectionHeader(people);
    };

    ScrollTrigger.create({
      trigger: people,
      start: 'top 85%',
      once: true,
      onEnter: revealPeopleHeader,
      onRefresh: (self) => {
        if (self.progress > 0) revealPeopleHeader();
      }
    });

    const rows = people.querySelectorAll('.ledger-row');
    rows.forEach((row, idx) => {
      let rowRevealed = false;
      const revealRow = () => {
        if (rowRevealed) return;
        rowRevealed = true;
        gsap.to(row, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: (idx % 3) * 0.06,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      };

      ScrollTrigger.create({
        trigger: row,
        start: 'top 92%',
        once: true,
        onEnter: revealRow,
        onRefresh: (self) => {
          if (self.progress > 0) revealRow();
        }
      });
    });

    const academicDossier = people.querySelector('.academic-dossier');
    if (academicDossier) {
      let dossierRevealed = false;
      const revealDossier = () => {
        if (dossierRevealed) return;
        dossierRevealed = true;

        const featuredCard = academicDossier.querySelector('.academic-card--featured');
        if (featuredCard) {
          gsap.to(featuredCard, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          const numLarge = featuredCard.querySelector('.academic-num-large');
          if (numLarge) {
            const counter = { val: 0 };
            gsap.to(counter, {
              val: 3.93,
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => {
                numLarge.textContent = counter.val.toFixed(2).replace('.', ',');
              }
            });
          }
        }

        const secondaryCards = academicDossier.querySelectorAll('.academic-card--secondary');
        if (secondaryCards.length > 0) {
          gsap.to(secondaryCards, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            delay: 0.15,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      };

      ScrollTrigger.create({
        trigger: academicDossier,
        start: 'top 88%',
        once: true,
        onEnter: revealDossier,
        onRefresh: (self) => {
          if (self.progress > 0) revealDossier();
        }
      });
    }
  }

  const connection = document.querySelector('.section--connection');
  if (connection) {
    let revealed = false;
    const revealConnection = () => {
      if (revealed) return;
      revealed = true;
      animateSectionHeader(connection);

      const leftBlock = connection.querySelector('.connection-left');
      if (leftBlock) {
        gsap.to(leftBlock, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }

      const rightBlock = connection.querySelector('.connection-channels');
      if (rightBlock) {
        gsap.to(rightBlock, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.2,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    };

    ScrollTrigger.create({
      trigger: connection,
      start: 'top 85%',
      once: true,
      onEnter: revealConnection,
      onRefresh: (self) => {
        if (self.progress > 0) revealConnection();
      }
    });
  }

  // Universal safety check: guarantee all content is visible if network or layout shifted
  setTimeout(() => {
    ScrollTrigger.refresh();
    const hidden = document.querySelectorAll(
      '.mind-card, .toolkit-tag, .project-card, .ledger-row, .academic-card, .academic-dossier-header'
    );
    hidden.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.opacity === '0') {
        gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.35, overwrite: 'auto' });
      }
    });
  }, 1200);
}

function initInteractiveCardPhysics() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const mindCards = Array.from(document.querySelectorAll('.mind-card'));
  mindCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotationX: -yPct * 8,
        rotationY: xPct * 8,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const img = card.querySelector('.project-image');

    const handleTilt = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const xPct = (clientX - rect.left) / rect.width - 0.5;
      const yPct = (clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotationX: -yPct * 6,
        rotationY: xPct * 6,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      if (img) {
        gsap.to(img, {
          x: -xPct * 12,
          y: -yPct * 12,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const resetTilt = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      if (img) {
        gsap.to(img, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    card.addEventListener('mousemove', (e) => handleTilt(e.clientX, e.clientY), { passive: true });
    card.addEventListener('mouseleave', resetTilt);
  });
}

function initMagneticElements() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const magneticBtns = document.querySelectorAll('.btn--primary, .btn--secondary, .btn--telemetry-copy, .btn--connection-cv, .nav-cv-btn, .theme-toggle, .nav-menu-btn, .social-link, .nav-monogram, .footer-back-to-top');
  magneticBtns.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
      const y = (e.clientY - (rect.top + rect.height / 2)) * 0.28;

      gsap.to(el, {
        x: x,
        y: y,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.45)',
        overwrite: 'auto'
      });
    });
  });
}
