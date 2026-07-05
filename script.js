/* =========================================================================
   NOIR & OR — LUXURY RESTAURANT LANDING PAGE
   Script
   Handles: preloader, navbar scroll state, mobile menu, scroll-reveal
            animations, active nav-link highlighting, back-to-top button,
            and the reservation form's client-side submission flow.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------------
     1. PRELOADER
     Hides the preloader once the page has fully loaded so the first paint
     doesn't flash unstyled or half-loaded hero imagery.
     ------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 400);
  });

  // Fallback in case the 'load' event fires late or is missed
  setTimeout(() => preloader && preloader.classList.add('is-hidden'), 2500);


  /* -----------------------------------------------------------------------
     2. NAVBAR — scroll state (glass intensifies once the page scrolls)
     ------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 40;

  const updateNavbarState = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });


  /* -----------------------------------------------------------------------
     3. MOBILE MENU TOGGLE
     ------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksList = document.getElementById('navLinks');

  const closeMobileMenu = () => {
    navToggle.classList.remove('is-active');
    navLinksList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile drawer whenever a link inside it is clicked
  navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* -----------------------------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL
     Highlights the nav item that matches the section currently in view.
     ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let currentSectionId = sections[0]?.id;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentSectionId}`);
    });
  };

  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });


  /* -----------------------------------------------------------------------
     5. SCROLL-REVEAL ANIMATIONS
     Uses IntersectionObserver (rather than scroll listeners) for smooth,
     performant fade/slide-in reveals as content enters the viewport.
     ------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


  /* -----------------------------------------------------------------------
     6. BACK-TO-TOP BUTTON
     ------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* -----------------------------------------------------------------------
     7. RESERVATION FORM
     Demonstrates a production-style client-side flow: basic validation,
     a friendly confirmation message, and a form reset. Wire the fetch()
     call below up to a real booking API/back-end when one is available.
     ------------------------------------------------------------------- */
  const reserveForm = document.getElementById('reserveForm');
  const reserveMessage = document.getElementById('reserveMessage');

  // Prevent selecting a reservation date in the past
  const dateInput = document.getElementById('guestDate');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  reserveForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!reserveForm.checkValidity()) {
      reserveForm.reportValidity();
      return;
    }

    const name = document.getElementById('guestName').value.trim();
    const date = document.getElementById('guestDate').value;

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    /* Placeholder for a real network request, e.g.:
       fetch('/api/reservations', { method: 'POST', body: new FormData(reserveForm) });
    */

    reserveMessage.textContent = `Thank you, ${name}. Your table is requested for ${formattedDate} — a confirmation will follow shortly.`;
    reserveForm.reset();
  });


  /* -----------------------------------------------------------------------
     8. FOOTER — dynamic copyright year
     ------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
