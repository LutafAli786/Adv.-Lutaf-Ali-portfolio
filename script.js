/* ═══════════════════════════════════════════════
   LUTAF ALI — PORTFOLIO SCRIPT
   Features:
   - Scroll reveal animations
   - Sticky navbar with scroll state
   - Mobile menu toggle
   - Active nav link highlighting
   - Smooth scroll polyfill handling
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAVBAR SCROLL STATE ─────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on init


  /* ─── MOBILE MENU TOGGLE ──────────────────── */
  const toggle    = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    function openMenu() {
      navLinks.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', function () {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }


  /* ─── SCROLL REVEAL ───────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once revealed, stop observing to save resources
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements for browsers without IntersectionObserver
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ─── ACTIVE NAV LINK ─────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    let currentId = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navItems.forEach(function (link) {
      link.removeAttribute('aria-current');
      if (link.getAttribute('href') === '#' + currentId) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ─── SMOOTH SCROLL (fallback for older browsers) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset  = navbar ? navbar.offsetHeight : 0;
        const top     = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ─── STAT NUMBER ANIMATION ───────────────── */
  // Animate numbers when the about section enters the viewport
  const stats = document.querySelectorAll('.stat-number');

  if (stats.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach(function (s) { statObserver.observe(s); });
  }

  function animateStat(el) {
    const final = el.textContent.trim();
    // Extract numeric portion
    const numMatch = final.match(/[\d.]+/);
    if (!numMatch) return;

    const target   = parseFloat(numMatch[0]);
    const suffix   = final.replace(numMatch[0], '');
    const isDecimal = numMatch[0].includes('.');
    const decimals  = isDecimal ? (numMatch[0].split('.')[1] || '').length : 0;
    const duration  = 1200;
    const start     = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = (isDecimal ? current.toFixed(decimals) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  /* ─── YEAR IN FOOTER ─────────────────────── */
  // Dynamically keep the copyright year current
  const copyEl = document.querySelector('.footer-copy');
  if (copyEl) {
    const year = new Date().getFullYear();
    copyEl.textContent = copyEl.textContent.replace('2025', String(year));
  }

})();
