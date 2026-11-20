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

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollInteraction();
  initSmoothScroll();
  initMotion();
  initProjectShowcase();
  initCertificateInteraction();
  initCursor();
  initAtelier3D();
  initWorksFilter();
  initTelemetry();
  initMindApparatus();
  initToolkitSimulator();
});
