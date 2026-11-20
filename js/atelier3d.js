import { gsap } from 'gsap';

export function initAtelier3D() {
  const canvas = document.getElementById('atelier-3d-canvas');
  if (!canvas) return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = canvas.clientWidth || 320;
  let height = canvas.clientHeight || 320;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const newW = canvas.clientWidth || 320;
    const newH = canvas.clientHeight || 320;
    if (newW === width && newH === height) return;
    width = newW;
    height = newH;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  resize();

  // V3: ResizeObserver instead of window resize for precise canvas sizing
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }

  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
  ];

  const baseRadius = 85;
  const vertices = rawVertices.map((v) => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [(v[0] / len) * baseRadius, (v[1] / len) * baseRadius, (v[2] / len) * baseRadius];
  });

  const edges = [];
  const edgeDistSq = Math.pow(2 * baseRadius / Math.sqrt(1 + phi * phi), 2);
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const dx = vertices[i][0] - vertices[j][0];
      const dy = vertices[i][1] - vertices[j][1];
      const dz = vertices[i][2] - vertices[j][2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (Math.abs(distSq - edgeDistSq) < 400) {
        edges.push([i, j]);
      }
    }
  }

  const dustCount = 28;
  const dustParticles = [];
  for (let d = 0; d < dustCount; d++) {
    const theta = Math.random() * Math.PI * 2;
    const phiAngle = Math.acos(Math.random() * 2 - 1);
    const r = baseRadius * (1.1 + Math.random() * 0.55);
    dustParticles.push({
      x: r * Math.sin(phiAngle) * Math.cos(theta),
      y: r * Math.sin(phiAngle) * Math.sin(theta),
      z: r * Math.cos(phiAngle),
      size: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.45
    });
  }

  let rotX = 0.35;
  let rotY = 0.55;
  let velX = 0;
  let velY = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let autoSpeed = isReduced ? 0 : 0.005;
  let pulseTimer = 0;

  // V3: Cache theme colors, update on themechange event
  let cachedCopperRgb = '139, 94, 50';
  let cachedAxisRgb = '32, 36, 38';

  function updateThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    cachedCopperRgb = isDark ? '193, 139, 97' : '139, 94, 50';
    cachedAxisRgb = isDark ? '234, 231, 223' : '32, 36, 38';
  }

  updateThemeColors();
  window.addEventListener('themechange', updateThemeColors);

  function onPointerDown(clientX, clientY) {
    isDragging = true;
    lastMouseX = clientX;
    lastMouseY = clientY;
    velX = 0;
    velY = 0;
  }

  function onPointerMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - lastMouseX;
    const dy = clientY - lastMouseY;
    velY = dx * 0.006;
    velX = -dy * 0.006;
    rotY += velY;
    rotX += velX;
    lastMouseX = clientX;
    lastMouseY = clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchend', onPointerUp);

  const entrance = document.querySelector('.section--entrance');
  if (entrance) {
    entrance.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      const rect = entrance.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(canvas, {
        x: xPct * 24,
        y: yPct * 16,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }, { passive: true });
  }

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const dy = window.scrollY - lastScrollY;
    rotY += dy * 0.002;
    lastScrollY = window.scrollY;
  }, { passive: true });

  function project(x, y, z, cx, cy) {
    const fov = 380;
    const factor = fov / (fov + z);
    return [cx + x * factor, cy + y * factor, factor];
  }

  function render() {
    // V3: Guard against 0-dimension canvas
    if (canvas.width === 0 || canvas.height === 0) {
      resize();
      if (isVisible && !isReduced) rafId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;

    if (!isDragging && !isReduced) {
      velX *= 0.94;
      velY *= 0.94;
      rotX += velX + autoSpeed * 0.5;
      rotY += velY + autoSpeed;
    }

    pulseTimer += 0.03;

    const copperRgb = cachedCopperRgb;
    const axisRgb = cachedAxisRgb;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    function rotatePt(pt) {
      const x1 = pt[0] * cosY + pt[2] * sinY;
      const z1 = -pt[0] * sinY + pt[2] * cosY;
      const y2 = pt[1] * cosX - z1 * sinX;
      const z2 = pt[1] * sinX + z1 * cosX;
      return [x1, y2, z2];
    }

    const projectedDust = dustParticles.map((dp) => {
      const [rx, ry, rz] = rotatePt([dp.x, dp.y, dp.z]);
      const [px, py, scale] = project(rx, ry, rz, cx, cy);
      return { px, py, z: rz, scale, size: dp.size, alpha: dp.alpha };
    });

    projectedDust.forEach((p) => {
      const alpha = Math.max(0.05, Math.min(0.7, p.alpha * ((p.z + baseRadius * 1.5) / (baseRadius * 3))));
      ctx.beginPath();
      ctx.arc(p.px, p.py, p.size * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${copperRgb}, ${alpha})`;
      ctx.fill();
    });

    const projectedVertices = vertices.map((v) => {
      const [rx, ry, rz] = rotatePt(v);
      const [px, py, scale] = project(rx, ry, rz, cx, cy);
      return { px, py, z: rz, scale };
    });

    const ringRadius1 = baseRadius * 1.48;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${copperRgb}, 0.28)`;
    ctx.lineWidth = 1.2;
    ctx.ellipse(cx, cy, ringRadius1, ringRadius1 * Math.abs(cosX * 0.55 + 0.35), rotY * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    const ringRadius2 = baseRadius * 1.26;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${axisRgb}, 0.16)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.ellipse(cx, cy, ringRadius2, ringRadius2 * Math.abs(sinX * 0.55 + 0.35), -rotY * 0.45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const ringRadius3 = baseRadius * 1.62;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${copperRgb}, 0.12)`;
    ctx.lineWidth = 0.8;
    ctx.arc(cx, cy, ringRadius3, 0, Math.PI * 2);
    ctx.stroke();

    edges.forEach(([i, j]) => {
      const vA = projectedVertices[i];
      const vB = projectedVertices[j];
      const avgZ = (vA.z + vB.z) / 2;
      const alpha = Math.max(0.1, Math.min(0.9, (avgZ + baseRadius) / (2 * baseRadius)));

      ctx.beginPath();
      ctx.moveTo(vA.px, vA.py);
      ctx.lineTo(vB.px, vB.py);
      ctx.strokeStyle = `rgba(${copperRgb}, ${alpha * 0.85})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    });

    projectedVertices.forEach((pv) => {
      const nodeAlpha = Math.max(0.2, (pv.z + baseRadius) / (2 * baseRadius));
      const radius = 2.6 * pv.scale;

      ctx.beginPath();
      ctx.arc(pv.px, pv.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${copperRgb}, ${nodeAlpha})`;
      ctx.fill();

      if (pv.z > 0) {
        ctx.beginPath();
        ctx.arc(pv.px, pv.py, radius + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${copperRgb}, ${nodeAlpha * 0.45})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    const corePulse = Math.sin(pulseTimer) * 1.5 + 4;
    ctx.beginPath();
    ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${copperRgb}, 0.85)`;
    ctx.shadowColor = `rgba(${copperRgb}, 0.7)`;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();

    if (!isReduced && isVisible) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  }

  let isVisible = true;
  let rafId = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId && !isReduced) {
          rafId = requestAnimationFrame(render);
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.05 });

    observer.observe(entrance || canvas);
  }

  rafId = requestAnimationFrame(render);
}
