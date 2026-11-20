export function initMindApparatus() {
  const portal = document.getElementById('mind-stage-portal');
  const canvas = document.getElementById('mind-stage-canvas');
  if (!portal || !canvas) return;

  const tagEl = document.getElementById('mind-stage-tag');
  const section = document.querySelector('.section--mind');
  const container = document.querySelector('.mind-cards');
  const cards = document.querySelectorAll('.mind-card');
  if (!cards.length) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animId = null;
  let activeMind = null;
  let activeCard = null;
  let angle = 0;

  const tags = {
    builder: '3D DOM WIREFRAME ARCHITECTURE',
    thinker: '3D RELATIONAL SYSTEM MATRIX',
    collaborator: '3D ORBITAL GYROSCOPIC GIMBAL'
  };

  function isLightMode() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function getThemeColors() {
    if (isLightMode()) {
      return {
        accent: '#b37547',
        accentAlpha: 'rgba(179, 117, 71, ',
        glow: 'rgba(179, 117, 71, 0.12)',
        line: 'rgba(100, 116, 139, 0.35)',
        vertex: '#0f172a',
        grid: 'rgba(100, 116, 139, 0.15)'
      };
    }
    return {
      accent: '#c18b61',
      accentAlpha: 'rgba(193, 139, 97, ',
      glow: 'rgba(193, 139, 97, 0.22)',
      line: 'rgba(193, 139, 97, 0.45)',
      vertex: '#ffffff',
      grid: 'rgba(193, 139, 97, 0.12)'
    };
  }

  /* ───────── 3D DRAW FUNCTIONS ───────── */

  function drawBuilder(colors, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    const rotX = 0.95;
    const rotZ = angle * 0.4;

    const layers = [
      { y: -80, size: 220, alpha: 0.3 },
      { y: 0, size: 180, alpha: 0.65 },
      { y: 80, size: 140, alpha: 0.9 }
    ];

    layers.forEach((layer) => {
      ctx.save();
      ctx.translate(0, layer.y);

      const s = layer.size;
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const pts = [
        { x: -s, y: -s * 0.6 },
        { x: s, y: -s * 0.6 },
        { x: s, y: s * 0.6 },
        { x: -s, y: s * 0.6 }
      ].map(p => ({
        x: p.x * cosZ - p.y * sinZ,
        y: (p.x * sinZ + p.y * cosZ) * rotX
      }));

      ctx.fillStyle = colors.accentAlpha + (layer.alpha * 0.08) + ')';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = colors.accentAlpha + layer.alpha + ')';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = colors.accentAlpha + (layer.alpha * 0.4) + ')';
      ctx.lineWidth = 1;
      for (let g = 1; g < 4; g++) {
        const ratio = g / 4;
        const lx1 = pts[0].x + (pts[1].x - pts[0].x) * ratio;
        const ly1 = pts[0].y + (pts[1].y - pts[0].y) * ratio;
        const lx2 = pts[3].x + (pts[2].x - pts[3].x) * ratio;
        const ly2 = pts[3].y + (pts[2].y - pts[3].y) * ratio;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();
      }

      pts.forEach(p => {
        ctx.fillStyle = colors.vertex;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });

    for (let c = 0; c < 4; c++) {
      const topPts = [
        { x: -220, y: -220 * 0.6 },
        { x: 220, y: -220 * 0.6 },
        { x: 220, y: 220 * 0.6 },
        { x: -220, y: 220 * 0.6 }
      ];
      const botPts = [
        { x: -140, y: -140 * 0.6 },
        { x: 140, y: -140 * 0.6 },
        { x: 140, y: 140 * 0.6 },
        { x: -140, y: 140 * 0.6 }
      ];

      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const tx = topPts[c].x * cosZ - topPts[c].y * sinZ;
      const ty = -80 + (topPts[c].x * sinZ + topPts[c].y * cosZ) * rotX;
      const bx = botPts[c].x * cosZ - botPts[c].y * sinZ;
      const by = 80 + (botPts[c].x * sinZ + botPts[c].y * cosZ) * rotX;

      ctx.strokeStyle = colors.accentAlpha + '0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  function drawThinker(colors, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    const radius = 175;
    const nodeCount = 20;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi + angle * 0.6;

      const x3 = radius * Math.sin(phi) * Math.cos(theta);
      const y3 = radius * Math.cos(phi);
      const z3 = radius * Math.sin(phi) * Math.sin(theta);

      const fov = 420;
      const scale = fov / (fov + z3);
      nodes.push({
        x: x3 * scale,
        y: y3 * scale,
        z: z3,
        scale,
        alpha: Math.max(0.15, (z3 + radius) / (radius * 2))
      });
    }

    ctx.lineWidth = 1.2;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < 110) {
          const edgeAlpha = (1 - dist / 110) * Math.min(nodes[i].alpha, nodes[j].alpha);
          ctx.strokeStyle = colors.accentAlpha + (edgeAlpha * 0.7) + ')';
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.sort((a, b) => a.z - b.z);

    nodes.forEach((n, idx) => {
      const pulse = Math.sin(angle * 2 + idx) * 2;
      ctx.fillStyle = colors.accentAlpha + (n.alpha * 0.95) + ')';
      ctx.beginPath();
      ctx.arc(n.x, n.y, (3.5 + pulse * 0.4) * n.scale, 0, Math.PI * 2);
      ctx.fill();

      if (idx % 4 === 0) {
        ctx.strokeStyle = colors.vertex;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, (7 + pulse) * n.scale, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
    halo.addColorStop(0, colors.accentAlpha + '0.12)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawCollaborator(colors, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    const rings = [
      { r: 180, rotY: angle * 0.7, color: colors.accentAlpha + '0.75)' },
      { r: 140, rotY: -angle * 0.9, color: colors.accentAlpha + '0.6)' },
      { r: 95, rotY: angle * 1.1, color: colors.accentAlpha + '0.9)' }
    ];

    rings.forEach((ring, idx) => {
      ctx.save();
      ctx.rotate(angle * 0.2 * (idx % 2 === 0 ? 1 : -1));

      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.r, ring.r * 0.45, ring.rotY, 0, Math.PI * 2);
      ctx.stroke();

      const satCount = 3 + idx;
      for (let s = 0; s < satCount; s++) {
        const satAngle = ring.rotY + (s * (Math.PI * 2 / satCount));
        const sx = Math.cos(satAngle) * ring.r;
        const sy = Math.sin(satAngle) * (ring.r * 0.45);

        ctx.fillStyle = colors.vertex;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });

    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = colors.vertex;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /* ───────── HIGH PERFORMANCE ON-DEMAND ANIMATION LOOP ───────── */

  function renderStage() {
    if (!activeMind) {
      animId = null;
      return;
    }

    angle += 0.016;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = getThemeColors();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (activeMind === 'builder') drawBuilder(colors, cx, cy);
    else if (activeMind === 'thinker') drawThinker(colors, cx, cy);
    else if (activeMind === 'collaborator') drawCollaborator(colors, cx, cy);

    animId = requestAnimationFrame(renderStage);
  }

  /* ───────── RELIABLE ACTIVATION / DEACTIVATION ───────── */

  function activate(card, mindType) {
    if (activeCard === card && activeMind === mindType) return;
    activeCard = card;
    activeMind = mindType;

    if (tagEl) tagEl.textContent = tags[mindType] || '3D SPATIAL KERNEL';
    section.classList.add('has-focal');
    container.classList.add('has-focal');
    document.body.classList.add('mind-has-focal');

    cards.forEach(c => {
      c.classList.toggle('is-focal-card', c === card);
    });

    if (!animId) {
      animId = requestAnimationFrame(renderStage);
    }
  }

  function deactivate() {
    activeCard = null;
    activeMind = null;

    section.classList.remove('has-focal');
    container.classList.remove('has-focal');
    document.body.classList.remove('mind-has-focal');

    cards.forEach(c => {
      c.classList.remove('is-focal-card');
    });

    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ───────── DIRECT HOVER & GESTURE-SAFE TOUCH BINDING ───────── */

  cards.forEach(card => {
    const mindType = card.getAttribute('data-mind') || 'builder';

    // Desktop hover: instantaneous 3D focal stage activation
    card.addEventListener('mouseenter', () => {
      activate(card, mindType);
    });

    // Touch devices: track gesture coordinates to separate intentional tap from scroll
    let touchStartX = 0;
    let touchStartY = 0;

    card.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
        const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
        // Only activate if finger moved less than 12px (tap, NOT a scroll!)
        if (dx < 12 && dy < 12) {
          if (activeCard === card) {
            deactivate();
          } else {
            activate(card, mindType);
          }
        }
      }
    });

    // Hybrid pointer click (laptop touchscreens, mouse clicks)
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeCard === card) {
        deactivate();
      } else {
        activate(card, mindType);
      }
    });

    // Keyboard focus accessibility
    card.addEventListener('focusin', () => activate(card, mindType));
  });

  // Leaving the entire cards container smoothly turns off 3D on desktop
  container.addEventListener('mouseleave', () => {
    deactivate();
  });

  // Tapping or clicking outside cards dismisses focal stage
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mind-card')) {
      deactivate();
    }
  });

  // Auto-deactivate when scrolling away from THE MIND section
  if ('IntersectionObserver' in window) {
    const mindObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && activeCard) {
          deactivate();
        }
      });
    }, { threshold: 0.08 });

    mindObserver.observe(section);
  }
}
