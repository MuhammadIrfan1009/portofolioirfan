import { gsap } from 'gsap';

export function initProjectShowcase() {
  const dialog = document.getElementById('project-dialog');
  if (!dialog) return;

  const closeBtn = document.getElementById('project-dialog-close');
  const idEl = document.getElementById('project-dialog-id');
  const titleEl = document.getElementById('project-dialog-title');
  const subtitleEl = document.getElementById('project-dialog-subtitle');
  const mediaEl = document.getElementById('project-dialog-media');
  const detailsEl = document.getElementById('project-dialog-details');
  const footerEl = document.getElementById('project-dialog-footer');

  const cards = document.querySelectorAll('.project-card');
  let activeTrigger = null;

  const projectData = {
    'SYS-001': {
      id: 'SYS-001 / FEATURED',
      title: 'SI FEST 2026',
      subtitle: 'Festival Information Website & Chatbot Integration',
      placeholder: 'Tangkapan layar proyek SI FEST 2026',
      image: 'img/img6.webp',
      fallback: 'img/img6.png',
      roles: ['PIC Frontend Website', 'PIC Backend Chatbot Oscar'],
      note: 'Website resmi kegiatan festival Sistem Informasi dengan integrasi Chatbot Oscar untuk layanan informasi interaktif.',
      link: 'https://sifestunsri.com',
      linkLabel: 'sifestunsri.com ↗'
    },
    'SYS-002': {
      id: 'SYS-002',
      title: 'LOKA NIKAH',
      subtitle: 'Platform Reservasi Wedding Organizer',
      placeholder: 'Tangkapan layar proyek Loka Nikah',
      image: 'img/img5.webp',
      fallback: 'img/img5.png',
      roles: ['Frontend & Backend Implementation'],
      note: 'Website wedding organizer yang menyediakan informasi dan reservasi secara online. Merupakan proyek kuliah dengan kontribusi pada sisi frontend dan backend.',
      link: 'https://loka-nikah.vercel.app',
      linkLabel: 'loka-nikah.vercel.app ↗'
    },
    'SYS-003': {
      id: 'SYS-003',
      title: 'E-KOMDIGI',
      subtitle: 'Sistem Pengarsipan Surat Kantor',
      placeholder: null,
      image: 'img/img3.webp',
      fallback: 'img/img3.png',
      imageAlt: 'Tangkapan layar proyek E-Komdigi',
      roles: [],
      note: 'Website untuk pengelolaan arsip surat kantor.',
      link: null,
      linkLabel: null
    },
    'SYS-004': {
      id: 'SYS-004',
      title: 'ABSENGO',
      subtitle: 'Sistem Presensi Magang Instansi',
      placeholder: null,
      image: 'img/img4.webp',
      fallback: 'img/img4.png',
      imageAlt: 'Tangkapan layar proyek AbsenGo',
      roles: [],
      note: 'Website absensi untuk pekerja magang di kantor pemerintah.',
      link: null,
      linkLabel: null
    },
    'SYS-005': {
      id: 'SYS-005',
      title: 'LINKTREE HIMSI',
      subtitle: 'Landing Page Kurasi Tautan Organisasi',
      placeholder: null,
      image: 'img/img2.webp',
      fallback: 'img/img2.png',
      imageAlt: 'Tangkapan layar proyek Linktree HIMSI',
      roles: [],
      note: 'Landing page kurasi tautan resmi untuk mempermudah navigasi informasi dan media komunikasi organisasi HIMSI.',
      link: null,
      linkLabel: null
    },
    'SYS-006': {
      id: 'SYS-006',
      title: 'GORYUK',
      subtitle: 'Platform Reservasi Gelanggang Olahraga',
      placeholder: null,
      image: 'img/img1.webp',
      fallback: 'img/img1.png',
      imageAlt: 'Tangkapan layar proyek GorYuk',
      roles: [],
      note: 'Website pemesanan online gelanggang olahraga.',
      link: null,
      linkLabel: null
    }
  };

  function openProject(key, triggerEl) {
    const data = projectData[key];
    if (!data) return;

    activeTrigger = triggerEl;

    idEl.textContent = data.id;
    titleEl.textContent = data.title;

    if (data.subtitle) {
      subtitleEl.textContent = data.subtitle;
      subtitleEl.style.display = 'block';
    } else {
      subtitleEl.style.display = 'none';
    }

    const cardImg = triggerEl ? triggerEl.querySelector('.project-image') : null;
    const finalImageSrc = data.image || (cardImg ? cardImg.getAttribute('src') : null);
    const finalFallbackSrc = data.fallback || (cardImg ? cardImg.getAttribute('src') : null);
    const finalImageAlt = cardImg ? cardImg.getAttribute('alt') : (data.imageAlt || data.title);

    if (finalImageSrc) {
      // V3: Added loading="eager" + onerror fallback for resilient image loading
      mediaEl.innerHTML = `<picture><source srcset="${finalImageSrc}" type="image/webp"><img src="${finalFallbackSrc}" alt="${finalImageAlt}" loading="eager" decoding="async" onerror="this.style.display='none'"></picture>`;
      mediaEl.style.display = 'block';
    } else if (data.placeholder) {
      mediaEl.innerHTML = `<div class="project-image-placeholder"><span class="project-image-placeholder-label">${data.placeholder}</span></div>`;
      mediaEl.style.display = 'block';
    } else {
      mediaEl.style.display = 'none';
    }

    let detailsHtml = '';
    if (data.roles && data.roles.length > 0) {
      detailsHtml += `<h4 class="project-dialog-section-label">Peran & Tanggung Jawab</h4><ul class="project-dialog-roles" role="list">`;
      data.roles.forEach((r) => {
        detailsHtml += `<li>${r}</li>`;
      });
      detailsHtml += `</ul>`;
    }
    if (data.note) {
      detailsHtml += `<h4 class="project-dialog-section-label">Ringkasan</h4><p class="project-dialog-note">${data.note}</p>`;
    }
    detailsEl.innerHTML = detailsHtml;

    if (data.link) {
      footerEl.innerHTML = `<span class="project-dialog-meta">${data.id}</span><a class="project-dialog-link" href="${data.link}" target="_blank" rel="noopener noreferrer">${data.linkLabel || 'Kunjungi Website ↗'}</a>`;
      footerEl.style.display = 'flex';
    } else {
      footerEl.innerHTML = `<span class="project-dialog-meta">${data.id}</span>`;
      footerEl.style.display = 'flex';
    }

    dialog.showModal();
    document.body.classList.add('dialog-open');

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = dialog.querySelector('.project-dialog-container');

    if (!isReduced && typeof gsap !== 'undefined' && container) {
      gsap.fromTo(container,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }

    if (closeBtn) {
      closeBtn.focus();
    }
  }

  cards.forEach((card) => {
    const idElInCard = card.querySelector('.project-id');
    if (!idElInCard) return;

    const rawId = idElInCard.textContent.trim().split(' ')[0].trim();

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');

    const titleElInCard = card.querySelector('.project-title');
    if (titleElInCard) {
      card.setAttribute('aria-label', `Buka dossier proyek ${titleElInCard.textContent.trim()}`);
    }

    card.addEventListener('click', (e) => {
      if (e.target.closest('a.project-link')) {
        return;
      }
      openProject(rawId, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a.project-link')) {
          return;
        }
        e.preventDefault();
        openProject(rawId, card);
      }
    });

    const bodyEl = card.querySelector('.project-body');
    if (bodyEl && !card.querySelector('.project-card-action')) {
      const promptBtn = document.createElement('span');
      promptBtn.className = 'project-card-action';
      promptBtn.setAttribute('aria-hidden', 'true');
      promptBtn.textContent = 'Buka Dossier →';
      bodyEl.appendChild(promptBtn);
    }
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
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus();
    }
    activeTrigger = null;
  });
}
