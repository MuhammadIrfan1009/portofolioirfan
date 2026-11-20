export function initCertificateInteraction() {
  const dialog = document.getElementById('certificate-dialog');
  if (!dialog) return;

  const closeBtn = document.getElementById('certificate-dialog-close');
  const imgEl = document.getElementById('certificate-dialog-img');
  const titleEl = document.getElementById('cert-dialog-title');
  const cards = document.querySelectorAll('.timeline-entry--has-cert');

  let activeTrigger = null;

  function openCertificate(target) {
    const src = target.getAttribute('data-cert-src');
    const title = target.getAttribute('data-cert-title');
    if (!src) return;

    activeTrigger = target;
    if (imgEl) {
      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', title || 'Pratinjau Sertifikat');
    }
    if (titleEl) {
      titleEl.textContent = title || 'Sertifikat';
    }

    // V3: Hide cert preview cursor before opening dialog
    const certPreview = document.querySelector('.cursor-cert-preview');
    if (certPreview) {
      certPreview.classList.remove('is-active');
    }

    dialog.showModal();
    document.body.classList.add('dialog-open');

    if (closeBtn) {
      closeBtn.focus();
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      openCertificate(card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        openCertificate(card);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
      }
    }
  });

  dialog.addEventListener('cancel', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    // V3: Removed cursor reparenting — no longer needed since cursor
    // visibility is handled via CSS body.dialog-open selector
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus();
    }
    activeTrigger = null;
  });
}
