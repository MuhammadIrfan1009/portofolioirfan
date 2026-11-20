export function initTheme() {
  const desktopToggle = document.getElementById('theme-toggle');
  const drawerToggle = document.getElementById('theme-toggle-drawer');
  const docEl = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, dispatch = true) {
    docEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    const drawerLabelText = isDark ? 'Mode Terang' : 'Mode Gelap';

    if (desktopToggle) {
      desktopToggle.setAttribute('aria-label', label);
      desktopToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      desktopToggle.setAttribute('title', label);
    }
    if (drawerToggle) {
      drawerToggle.setAttribute('aria-label', label);
      drawerToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      drawerToggle.setAttribute('title', label);
      const textSpan = drawerToggle.querySelector('.theme-toggle-label');
      if (textSpan) textSpan.textContent = drawerLabelText;
    }

    // V3: Dispatch custom event so canvas renderers can react immediately
    if (dispatch) {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
  }

  function toggleTheme() {
    const current = docEl.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  applyTheme(getPreferredTheme(), false);

  const allToggles = [desktopToggle, drawerToggle].filter(Boolean);
  allToggles.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}
