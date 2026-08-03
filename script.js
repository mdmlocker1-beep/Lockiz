/* ═══════════════════════════════════════
   LOCKIZ — script.js
   ═══════════════════════════════════════ */

// ── LOGIN DROPDOWN (defined first so scroll handler can call it) ──
function closeLoginDropdown() {
  const menu = document.getElementById('loginMenu');
  const btn  = document.getElementById('loginDropdownBtn');
  if (menu) menu.classList.remove('open');
  if (btn)  { btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
}

// ── NAVBAR: scroll effect + hamburger ──
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else                       btn.classList.remove('visible');
  }

  // Close login dropdown on scroll
  closeLoginDropdown();
});


hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  navLinks.classList.contains('open')
    ? (spans[0].style.transform = 'rotate(45deg) translateY(7px)',
       spans[1].style.opacity = '0',
       spans[2].style.transform = 'rotate(-45deg) translateY(-7px)')
    : (spans[0].style.transform = '',
       spans[1].style.opacity = '',
       spans[2].style.transform = '');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ── SCROLL ANIMATIONS ──────────────────
const animTargets = document.querySelectorAll(
  '.about-card, .feature-card, .step-item, .gallery-item, ' +
  '.benefit-item, .contact-card, .download-card, .faq-item, ' +
  '.distributor-inner, .offer-card, .about-banner, .hiw-banner, ' +
  '.problem-item, .solution-item'
);

animTargets.forEach(el => el.classList.add('animate-on-scroll'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children if parent
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animTargets.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 60}ms`;
  observer.observe(el);
});

// ── LIGHTBOX ───────────────────────────
function openLightbox(el) {
  const src = el.querySelector('img').src;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Direct src version (used in phone mockup screens)
function openLightboxSrc(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── FAQ ACCORDION ──────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('active'));

  // Open clicked (if it was closed)
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}

// ── SMOOTH SCROLL FOR NAV LINKS ─────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── STATS COUNTER ANIMATION ─────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const text = counter.textContent;
    const numStr = text.replace(/[^\d]/g, '');
    if (!numStr) return;
    const target = parseInt(numStr);
    const suffix = text.replace(/[\d]/g, '');
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current).toLocaleString('bn-BD') + suffix;
    }, 16);
  });
}

// Trigger counter when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.4 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ── FEATURE CARDS: tilt on hover ────────
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 6;
    const rotY = (x / rect.width) * 6;
    card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── PHONE SCREEN SLIDESHOW ──────────────
const screens = [
  'image/app screen/Home.jpeg',
  'image/app screen/home2.jpeg',
  'image/app screen/Profile.jpeg',
  'image/app screen/commend.jpeg',
];
let screenIdx = 0;
const phoneImg = document.querySelector('.phone-img');
if (phoneImg) {
  setInterval(() => {
    phoneImg.style.opacity = '0';
    setTimeout(() => {
      screenIdx = (screenIdx + 1) % screens.length;
      phoneImg.src = screens[screenIdx];
      phoneImg.style.opacity = '1';
    }, 400);
  }, 3000);
  phoneImg.style.transition = 'opacity .4s ease';
}

// ── ACTIVE NAV LINK ON SCROLL ────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = '#fff';
      } else {
        link.style.color = '';
      }
    }
  });
});

// ── LOGIN DROPDOWN (wire up events) ────────
(function () {
  const btn  = document.getElementById('loginDropdownBtn');
  const menu = document.getElementById('loginMenu');
  const wrap = document.getElementById('loginDropdown');
  if (!btn || !menu) return;

  function open() {
    menu.classList.add('open');
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }

  // Toggle on button click
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (menu.classList.contains('open')) {
      closeLoginDropdown();
    } else {
      open();
    }
  });

  // Close when clicking anywhere outside the dropdown wrapper
  document.addEventListener('click', function (e) {
    if (wrap && !wrap.contains(e.target)) {
      closeLoginDropdown();
    }
  });

  // Prevent clicks inside the menu from closing it
  menu.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Keyboard support — Escape closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLoginDropdown();
  });
})();

console.log('%cLOCKIZ 🔒', 'color:#EF4444;font-size:24px;font-weight:900;');
console.log('%cEMI Mobile Security & Management', 'color:#94A3B8;font-size:12px;');


