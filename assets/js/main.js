/* BIB e.V. – Sidebar Navigation & Interactions */

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');
  const sidebarNav = document.querySelector('.sidebar-nav');
  const main = document.querySelector('.main');
  const menuToggle = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.overlay');

  /* Active Link Highlighting */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href === currentPath) {
      link.classList.add('active');
    }
  });

  /* Sidebar Active State on Scroll */
  if (sidebarNav && main) {
    const headings = main.querySelectorAll('h1, h2');
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
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    headings.forEach(function (h) {
      if (h.id) observer.observe(h);
    });
  }

  /* Mobile Menu Toggle */
  function openMenu() {
    if (sidebar) sidebar.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (sidebar && sidebar.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  /* Contact Form Handler */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('formStatus');
      var btn = contactForm.querySelector('button');
      var originalText = btn.textContent;
      btn.textContent = 'Wird gesendet…';
      btn.disabled = true;

      setTimeout(function () {
        if (status) {
          status.className = 'form-status success';
          status.textContent = 'Vielen Dank! Wir werden uns zeitnah bei Ihnen melden.';
        }
        btn.textContent = originalText;
        btn.disabled = false;
        contactForm.reset();
      }, 1500);
    });
  }
});
