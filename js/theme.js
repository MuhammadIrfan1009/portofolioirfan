export function initTheme() {
  const desktopToggle = document.getElementById('theme-toggle');
  const drawerToggle = document.getElementById('theme-toggle-drawer');
  const docEl = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    const drawerLabelText = isDark ? 'Mode Terang' : 'Mode Gelap';

    if (desktopToggle) {
      desktopToggle.setAttribute('aria-label', label);
    }
    if (drawerToggle) {
      drawerToggle.setAttribute('aria-label', label);
      const textSpan = drawerToggle.querySelector('.theme-toggle-label');
      if (textSpan) textSpan.textContent = drawerLabelText;
    }
  }

  function toggleTheme() {
    const current = docEl.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Initial theme
  applyTheme(getPreferredTheme());

  // Listeners
  if (desktopToggle) {
    desktopToggle.addEventListener('click', toggleTheme);
  }
  if (drawerToggle) {
    drawerToggle.addEventListener('click', toggleTheme);
  }

  // System preference change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

