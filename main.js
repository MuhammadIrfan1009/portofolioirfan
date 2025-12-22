/* =====================================
   Active Menu & Smooth Scroll
===================================== */

const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Remove active class dari semua link
    menuLinks.forEach(item => item.classList.remove("active"));
    
    // Add active class ke link yang diklik
    link.classList.add("active");
    
    // Smooth scroll ke target
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* =====================================
   Highlight Menu Saat Scroll
===================================== */

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* =====================================
   Contact Form Validation
===================================== */

const form = document.getElementById("form");
const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const name = document.querySelector("input[name='name']").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || subject === "" || message === "") {
    alert("Mohon lengkapi semua field terlebih dahulu.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Format email tidak valid.");
    return;
  }

  alert("Pesan berhasil dikirim! Terima kasih 🙌");
  form.reset();
});

/* =====================================
   Email Validation Function
===================================== */

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/* =====================================
   Dark Mode Toggle (BONUS)
===================================== */

function initDarkMode() {
  const darkModeBtn = document.createElement("button");
  darkModeBtn.id = "dark-mode-toggle";
  darkModeBtn.innerHTML = "🌙";
  darkModeBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    z-index: 999;
    transition: 0.3s;
  `;

  document.body.appendChild(darkModeBtn);

  // Check localStorage untuk dark mode preference
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    darkModeBtn.innerHTML = "☀️";
  }

  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isActive = document.body.classList.contains("dark-mode");
    
    darkModeBtn.innerHTML = isActive ? "☀️" : "🌙";
    localStorage.setItem("darkMode", isActive);
  });
}

/* =====================================
   Scroll Animation (Fade In)
===================================== */

function initScrollAnimation() {
  const cards = document.querySelectorAll(".content-card");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-visible");
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.classList.add("animate-hidden");
    observer.observe(card);
  });
}

// Tambah CSS animation ke document
function addAnimationStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-hidden {
      opacity: 0;
      transform: translateY(30px);
    }

    .animate-visible {
      animation: fadeInUp 0.8s ease-in-out forwards;
    }

    /* Dark Mode Styles */
    body.dark-mode {
      --accent-color: rgb(100, 150, 255);
      --background-color: rgb(30, 30, 40);
      --background-color-2: rgb(20, 20, 30);
    }

    body.dark-mode .content {
      background: rgb(25, 25, 35);
      color: #ddd;
    }

    body.dark-mode .content-card h1,
    body.dark-mode .content-card p,
    body.dark-mode .language p {
      color: #ddd;
    }

    body.dark-mode .text-input,
    body.dark-mode .message {
      background: rgb(35, 35, 45);
      color: rgb(100, 150, 255);
      border-bottom-color: rgb(100, 150, 255);
    }

    body.dark-mode .text-input::placeholder,
    body.dark-mode .message::placeholder {
      color: rgb(100, 150, 255);
    }

    body.dark-mode .submit-btn {
      background: rgb(100, 150, 255);
      color: rgb(20, 20, 30);
    }

    body.dark-mode .submit-btn:hover {
      background: rgb(80, 120, 220);
    }

    body.dark-mode .header {
      background: linear-gradient(135deg, rgb(20, 20, 30) 0%, rgb(40, 60, 90) 100%);
    }

    body.dark-mode .menu {
      background: rgb(35, 35, 45);
    }

    body.dark-mode .menu-icon {
      color: rgb(100, 150, 255);
    }

    body.dark-mode .home h1 {
      color: rgb(100, 150, 255);
    }

    body.dark-mode .skill {
      background: rgb(100, 150, 255);
      color: rgb(20, 20, 30);
    }

    #dark-mode-toggle {
      background: rgba(100, 150, 255, 0.2) !important;
    }

    #dark-mode-toggle:hover {
      background: rgba(100, 150, 255, 0.4) !important;
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
}

/* =====================================
   Lazy Load Images
===================================== */

function initLazyLoadImages() {
  const images = document.querySelectorAll("img");
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load gambar jika punya data-src
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}

/* =====================================
   Back to Top Button
===================================== */

function initBackToTop() {
  const backToTopBtn = document.createElement("button");
  backToTopBtn.id = "back-to-top";
  backToTopBtn.innerHTML = "↑";
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 16px;
    background: rgba(1, 12, 67, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
    z-index: 999;
  `;

  document.body.appendChild(backToTopBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = "1";
      backToTopBtn.style.visibility = "visible";
    } else {
      backToTopBtn.style.opacity = "0";
      backToTopBtn.style.visibility = "hidden";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =====================================
   Initialize All Features
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  addAnimationStyles();
  initDarkMode();
  initScrollAnimation();
  initLazyLoadImages();
  initBackToTop();
});