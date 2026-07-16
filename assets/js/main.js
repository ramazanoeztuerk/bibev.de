/* ═══════════════════════════════════════════════════════
   BIB e.V. — Interaktivität · Vanilla JS, keine Dependencies
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');
  const sidebarNav = document.querySelector('.sidebar-nav');
  const main = document.querySelector('.main');
  const menuToggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.overlay');

  /* ── Active Link Highlighting ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href === currentPath) {
      link.classList.add('active');
    }
  });

  /* ── Sidebar Active State on Scroll (Scroll-Spy) ── */
  if (sidebarNav && main) {
    const headings = main.querySelectorAll('h1[id], h2[id]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (!id) return;
          document.querySelectorAll('.sidebar-link').forEach(function (link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ── Mobile Menu Toggle ── */
  function openMenu() {
    if (sidebar) sidebar.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    if (menuToggle) menuToggle.setAttribute('aria-label', 'Menü schließen');
  }

  function closeMenu() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.setAttribute('aria-label', 'Menü öffnen');
  }

  function toggleMenu() {
    if (sidebar && sidebar.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  /* ── Escape-Key schliesst mobiles Menü ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
      closeMenu();
      if (menuToggle) menuToggle.focus();
    }
  });

  /* ── Smooth-Scroll für Ankerlinks ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        /* Schliesse mobiles Menü nach Klick auf Ankerlink */
        if (sidebar && sidebar.classList.contains('is-open')) {
          closeMenu();
        }
      }
    });
  });

  /* ── Scroll-to-Top Button ── */
  var scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');
  scrollBtn.innerHTML = '&#8593;';
  document.body.appendChild(scrollBtn);

  function handleScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var threshold = window.innerHeight * 0.6;
    if (scrollY > threshold) {
      scrollBtn.classList.add('is-visible');
    } else {
      scrollBtn.classList.remove('is-visible');
    }
  }

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Throttle Scroll-Event f端r Performance */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── Contact Form Handler ── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('formStatus');
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : 'Nachricht senden';

      if (btn) {
        btn.textContent = 'Wird gesendet…';
        btn.disabled = true;
      }

      setTimeout(function () {
        if (status) {
          status.className = 'form-status success';
          status.textContent = 'Vielen Dank! Wir werden uns zeitnah bei Ihnen melden.';
        }
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
        contactForm.reset();
      }, 1500);
    });
  }

  /* ── Intersection Observer: Bento-Tiles animieren ── */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.bento-tile, .gallery-card, .manifesto-item, .split, .data-row, .transit-card').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1)';
      revealObserver.observe(el);
    });
  }
});