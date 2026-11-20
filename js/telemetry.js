export function initTelemetry() {
  initLiveClock();
  initClipboardCopy();
  initAmbientSpotlight();
}

function initLiveClock() {
  const clockEl = document.getElementById('atelier-live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 3600000 * 7);
    const hrs = String(wib.getHours()).padStart(2, '0');
    const mins = String(wib.getMinutes()).padStart(2, '0');
    const secs = String(wib.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hrs}:${mins}:${secs} WIB`;
  }

  update();
  setInterval(update, 1000);
}

function initClipboardCopy() {
  const email = 'redmiredmi600@gmail.com';

  const atelierBtn = document.getElementById('atelier-copy-email');
  const actionText = document.getElementById('copy-action-text');
  if (atelierBtn) {
    atelierBtn.addEventListener('click', () => {
      copyToClipboard(email, () => {
        if (actionText) {
          const original = actionText.textContent;
          actionText.textContent = '[ COPIED TO SYSTEM CLIPBOARD ]';
          actionText.style.color = '#10b981';
          atelierBtn.classList.add('is-copied');
          setTimeout(() => {
            actionText.textContent = original;
            actionText.style.color = '';
            atelierBtn.classList.remove('is-copied');
          }, 2400);
        }
      });
    });
  }
}

function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const input = document.createElement('textarea');
  input.value = text;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.focus();
  input.select();
  try {
    document.execCommand('copy');
    if (onSuccess) onSuccess();
  } catch (err) {}
  document.body.removeChild(input);
}

function initAmbientSpotlight() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let ticking = false;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  }, { passive: true });

  function render() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    document.documentElement.style.setProperty('--spotlight-x', `${currentX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--spotlight-y', `${currentY.toFixed(1)}px`);

    if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
      requestAnimationFrame(render);
    } else {
      ticking = false;
    }
  }
}

