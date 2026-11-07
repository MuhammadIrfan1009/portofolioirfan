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
    console.warn('Motion: GSAP initialization failed', err);
    return;
  }

  // Signal motion readiness
  document.body.classList.add('motion-ready');

  initCinematicOpening();
  initBlueprintParallax();
  initSectionStorytelling();
}

function initCinematicOpening() {
  const entrance = document.querySelector('.section--entrance');
  const shutter = document.getElementById('atelier-shutter');
  if (!entrance) return;

  const isMobile = window.matchMedia('(max-width: 899px)').matches;
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      if (shutter) {
        shutter.style.display = 'none';
      }
    }
  });

  const topPanel = document.querySelector('.shutter-panel--top');
  const bottomPanel = document.querySelector('.shutter-panel--bottom');
  const calibration = document.querySelector('.shutter-calibration');
  const calibStatus = document.querySelector('.shutter-mono-status');

  // Step 1: Calibration readout pulse (0.0s - 0.5s)
  if (calibration) {
    tl.fromTo(calibration, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.35 }, 0);
    if (calibStatus) {
      tl.to(calibStatus, { opacity: 0.4, duration: 0.15, repeat: 1, yoyo: true }, 0.2);
    }
    tl.to(calibration, { opacity: 0, scale: 1.02, duration: 0.3, ease: 'power2.in' }, 0.5);
  }

  // Step 2: Architectural shutter panel wipe (0.6s - 1.3s)
  if (topPanel && bottomPanel) {
    tl.to(topPanel, { yPercent: -100, duration: isMobile ? 0.65 : 0.8, ease: 'power4.inOut' }, 0.6);
    tl.to(bottomPanel, { yPercent: 100, duration: isMobile ? 0.65 : 0.8, ease: 'power4.inOut' }, 0.6);
  }

  // Step 3: Blueprint grid construction (0.9s)
  const grid = entrance.querySelector('.blueprint-grid');
  if (grid) {
    tl.to(grid, { opacity: 0.12, duration: 0.7, ease: 'power2.out' }, 0.9);
  }

  // Step 4: Eyebrow label & Avatar (1.1s - 1.25s)
  const indexLabel = entrance.querySelector('.section-index-label');
  if (indexLabel) {
    indexLabel.classList.add('hero-reveal--eyebrow');
    tl.to(indexLabel, { opacity: 1, y: 0, duration: 0.45 }, 1.1);
  }

  const avatar = entrance.querySelector('.entrance-avatar');
  if (avatar) {
    avatar.classList.add('hero-reveal--avatar');
    tl.to(avatar, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, 1.2);
  }

  // Step 5: Headline unmasking (1.3s)
  const name = entrance.querySelector('.entrance-name');
  if (name) {
    name.classList.add('hero-reveal--name');
    tl.to(name, {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.75,
      ease: 'power3.out'
    }, 1.3);
  }

  // Step 6: GPA, Tagline & CTA button entrance (1.55s - 1.8s)
  const gpa = entrance.querySelector('.entrance-gpa');
  if (gpa) {
    gpa.classList.add('hero-reveal');
    tl.to(gpa, { opacity: 1, y: 0, duration: 0.4 }, 1.55);
  }

  const tagline = entrance.querySelector('.entrance-tagline');
  if (tagline) {
    tagline.classList.add('hero-reveal');
    tl.to(tagline, { opacity: 1, y: 0, duration: 0.45 }, 1.65);
  }

  const cta = entrance.querySelector('.btn--primary');
  if (cta) {
    cta.classList.add('hero-reveal--cta');
    tl.to(cta, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.75);
  }

  // Step 7: Copper line drawing & light-sweep flare (1.8s - 2.5s)
  const copperTrack = entrance.querySelector('.copper-accent-line .copper-track');
  const copperFlare = entrance.querySelector('.copper-accent-line .copper-flare');

  if (copperTrack) {
    tl.to(copperTrack, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 1.8);
  }

  if (copperFlare) {
    tl.fromTo(copperFlare,
      { attr: { cx: 0 }, opacity: 0 },
      { opacity: 1, duration: 0.15 },
      1.8
    );
    tl.to(copperFlare, {
      attr: { cx: 1200 },
      duration: 0.75,
      ease: 'power2.inOut'
    }, 1.85);
    tl.to(copperFlare, { opacity: 0, duration: 0.2 }, 2.45);
  }
}

function initBlueprintParallax() {
  const grid = document.querySelector('.section--entrance .blueprint-grid');
  if (!grid) return;

  const canHover = window.matchMedia('(hover: hover)').matches;

  ScrollTrigger.create({
    trigger: '.section--entrance',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
    onUpdate: (self) => {
      gsap.set(grid, { opacity: 0.12 - self.progress * 0.08 });
    }
  });

  if (canHover) {
    const entrance = document.querySelector('.section--entrance');
    const handleMove = (e) => {
      const rect = entrance.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(grid, {
        x: xPct * 10,
        y: yPct * 6,
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

function animateSectionHeader(section) {
  const indexLabel = section.querySelector('.section-index-label');
  const title = section.querySelector('.section-title');
  const subtitle = section.querySelector('.section-subtitle');

  // Inject architectural ruler line if not present
  let ruler = section.querySelector('.section-title-ruler');
  if (!ruler && title) {
    ruler = document.createElement('div');
    ruler.className = 'section-title-ruler';
    ruler.setAttribute('aria-hidden', 'true');
    title.insertAdjacentElement('afterend', ruler);
  }

  const tl = gsap.timeline();
  if (indexLabel) {
    tl.fromTo(indexLabel, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0);
  }
  if (title) {
    tl.fromTo(title, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1);
  }
  if (ruler) {
    tl.fromTo(ruler, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0.2);
  }
  if (subtitle) {
    tl.fromTo(subtitle, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.25);
  }
  return tl;
}

function initSectionStorytelling() {
  // =========================================================================
  // 1. MIND (02) — The 3D Drafting Table Cards & Blueprint Bio
  // =========================================================================
  const mind = document.querySelector('.section--mind');
  if (mind) {
    ScrollTrigger.create({
      trigger: mind,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        animateSectionHeader(mind);

        const cards = mind.querySelectorAll('.mind-card');
        if (cards.length >= 3) {
          // Card 1: Swing from bottom-left
          gsap.fromTo(cards[0],
            { opacity: 0, x: -45, y: 55, rotateY: -16, rotateZ: -2 },
            { opacity: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 0.85, delay: 0.2, ease: 'power3.out' }
          );
          // Card 2: Swing from center with forward pitch
          gsap.fromTo(cards[1],
            { opacity: 0, y: 70, rotateX: 22, scale: 0.92 },
            { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.85, delay: 0.35, ease: 'power3.out' }
          );
          // Card 3: Swing from bottom-right
          gsap.fromTo(cards[2],
            { opacity: 0, x: 45, y: 55, rotateY: 16, rotateZ: 2 },
            { opacity: 1, x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 0.85, delay: 0.5, ease: 'power3.out' }
          );
        } else {
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' });
        }

        const bio = mind.querySelector('.mind-bio');
        if (bio) {
          gsap.fromTo(bio,
            { opacity: 0, x: -35 },
            {
              opacity: 1,
              x: 0,
              duration: 0.75,
              delay: 0.65,
              ease: 'power3.out',
              onStart: () => bio.classList.add('revealed')
            }
          );
        }
      }
    });
  }

  // =========================================================================
  // 2. TOOLKIT (03) — Mechanical Assembly Matrix & Tag Pop Cascade
  // =========================================================================
  const toolkit = document.querySelector('.section--toolkit');
  if (toolkit) {
    ScrollTrigger.create({
      trigger: toolkit,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        animateSectionHeader(toolkit);

        const domains = toolkit.querySelectorAll('.toolkit-domain');
        domains.forEach((domain, idx) => {
          // Alternating mechanical entry vectors
          const fromVector = (idx % 2 === 0) ? { x: -45 } : { x: 45 };
          const heading = domain.querySelector('.toolkit-domain-title');
          if (heading) {
            gsap.fromTo(heading,
              { opacity: 0, ...fromVector },
              { opacity: 1, x: 0, duration: 0.5, delay: 0.18 * idx, ease: 'power3.out' }
            );
          }

          // Mechanical tag pops: popping in like physical typewriter/switchboard keys
          const tags = domain.querySelectorAll('.toolkit-tag');
          gsap.fromTo(tags,
            { opacity: 0, scale: 0.35, y: 15 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.045,
              delay: 0.25 + 0.18 * idx,
              ease: 'back.out(2.8)'
            }
          );
        });
      }
    });
  }

  // =========================================================================
  // 3. WORKS (04) — Architectural Blueprint Drawings & Optical Image Zoom
  // =========================================================================
  const works = document.querySelector('.section--works');
  if (works) {
    ScrollTrigger.create({
      trigger: works,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        animateSectionHeader(works);

        // Featured Project: Dramatic vertical zoom-in & copper badge flash
        const featured = works.querySelector('.project-card--featured');
        if (featured) {
          gsap.fromTo(featured,
            { opacity: 0, scale: 0.88, y: 65 },
            { opacity: 1, scale: 1, y: 0, duration: 0.9, delay: 0.25, ease: 'power3.out' }
          );

          const badge = featured.querySelector('.project-id');
          if (badge) {
            gsap.fromTo(badge,
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.5, delay: 0.5, ease: 'back.out(1.8)' }
            );
          }
        }

        // Standard Project Grid: Alternating directional entry + Image optical settle
        const standardCards = works.querySelectorAll('.project-card:not(.project-card--featured)');
        standardCards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              const isEven = (idx % 2 === 0);
              const fromX = isEven ? -35 : 35;

              gsap.fromTo(card,
                { opacity: 0, x: fromX, y: 40 },
                { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'power3.out' }
              );

              // Optical settling of screenshot image inside card
              const img = card.querySelector('.project-image');
              if (img) {
                gsap.fromTo(img,
                  { scale: 1.18 },
                  { scale: 1, duration: 0.95, ease: 'power2.out' }
                );
              }

              const idTag = card.querySelector('.project-id');
              if (idTag) {
                gsap.fromTo(idTag,
                  { opacity: 0, x: -15 },
                  { opacity: 1, x: 0, duration: 0.45, delay: 0.2, ease: 'power2.out' }
                );
              }
            }
          });
        });
      }
    });
  }

  // =========================================================================
  // 4. PEOPLE (05) — Scroll-Linked Timeline Progress Gauge & Node Halo Pops
  // =========================================================================
  const people = document.querySelector('.section--people');
  if (people) {
    ScrollTrigger.create({
      trigger: people,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        animateSectionHeader(people);
      }
    });

    const timelineContainer = people.querySelector('.timeline');
    if (timelineContainer) {
      // Add real-time copper progress gauge line
      let gauge = timelineContainer.querySelector('.timeline-progress-gauge');
      if (!gauge) {
        gauge = document.createElement('div');
        gauge.className = 'timeline-progress-gauge';
        gauge.setAttribute('aria-hidden', 'true');
        timelineContainer.prepend(gauge);
      }

      // Scrub the copper line directly as the user scrolls through the timeline!
      ScrollTrigger.create({
        trigger: timelineContainer,
        start: 'top 70%',
        end: 'bottom 85%',
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(gauge, { height: `${(self.progress * 100).toFixed(1)}%` });
        }
      });
    }

    const entries = people.querySelectorAll('.timeline-entry');
    entries.forEach((entry) => {
      ScrollTrigger.create({
        trigger: entry,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.fromTo(entry,
            { opacity: 0, x: -35 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
          );

          // Node pops open with halo pulse
          const node = entry.querySelector('.timeline-node');
          if (node) {
            gsap.fromTo(node,
              { scale: 0, opacity: 0, boxShadow: '0 0 0 10px rgba(193, 139, 97, 0.5)' },
              { scale: 1, opacity: 1, boxShadow: '0 0 0 0px rgba(193, 139, 97, 0)', duration: 0.5, delay: 0.1, ease: 'back.out(2.5)' }
            );
          }
        }
      });
    });

    // Education section
    const eduBlock = people.querySelector('.education-block');
    if (eduBlock) {
      ScrollTrigger.create({
        trigger: eduBlock,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const eduTitle = eduBlock.querySelector('.education-block-title');
          if (eduTitle) {
            gsap.fromTo(eduTitle,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
          }
        }
      });
    }
  }

  // =========================================================================
  // 5. CONNECTION (06) — Direct Channel Beam
  // =========================================================================
  const connection = document.querySelector('.section--connection');
  if (connection) {
    ScrollTrigger.create({
      trigger: connection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        animateSectionHeader(connection);

        const socialLink = connection.querySelector('.social-link');
        if (socialLink) {
          gsap.fromTo(socialLink,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.3, ease: 'back.out(2)' }
          );
        }
      }
    });
  }
}
