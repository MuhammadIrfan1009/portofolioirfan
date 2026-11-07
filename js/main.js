import { initTheme } from './theme.js';
import { initNavigation } from './nav.js';
import { initScrollInteraction } from './scroll.js';
import { initMotion } from './motion.js';
import { initProjectShowcase } from './showcase.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollInteraction();
  initMotion();
  initProjectShowcase();
});

