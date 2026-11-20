/**
 * ATELIER ARCHITECTURE V3.0.0
 * Muhammad Irfan — Portfolio Runtime
 * ──────────────────────────────────
 */

export const ATELIER_VERSION = '3.0.0';

import { initTheme } from './theme.js';
import { initNavigation } from './nav.js';
import { initScrollInteraction } from './scroll.js';
import { initMotion } from './motion.js';
import { initProjectShowcase } from './showcase.js';
import { initCertificateInteraction } from './certificate.js';
import { initCursor } from './cursor.js';
import { initAtelier3D } from './atelier3d.js';
import { initWorksFilter } from './worksFilter.js';
import { initTelemetry } from './telemetry.js';
import { initSmoothScroll } from './smoothScroll.js';
import { initMindApparatus } from './mindApparatus.js';
import { initToolkitSimulator } from './toolkitSimulator.js';

function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.warn(`[Atelier V3] ${name} init failed:`, err);
  }
}

function scheduleIdle(name, fn) {
  const run = () => safeInit(name, fn);
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 80);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Critical path — must run synchronously
  safeInit('Theme', initTheme);
  safeInit('Navigation', initNavigation);
  safeInit('ScrollInteraction', initScrollInteraction);
  safeInit('SmoothScroll', initSmoothScroll);
  safeInit('Motion', initMotion);

  // High priority — run after first paint
  requestAnimationFrame(() => {
    safeInit('ProjectShowcase', initProjectShowcase);
    safeInit('CertificateInteraction', initCertificateInteraction);
    safeInit('Atelier3D', initAtelier3D);
    safeInit('WorksFilter', initWorksFilter);
    safeInit('MindApparatus', initMindApparatus);
  });

  // Deferred — non-critical enhancements
  scheduleIdle('Cursor', initCursor);
  scheduleIdle('Telemetry', initTelemetry);
  scheduleIdle('ToolkitSimulator', initToolkitSimulator);
});
