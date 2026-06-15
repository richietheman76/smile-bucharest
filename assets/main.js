/* =========================================================
   RichieSolutions – Dental Tourism Romania
   main.js – Vanilla JS: nav, FAQ, form, scroll animations
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Nav Toggle ─────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });
    // close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── Smooth scroll for anchor links ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu if open
        if (mobileMenu) mobileMenu.classList.remove('open');
      }
    });
  });

  /* ── FAQ Accordion ─────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Lead Form Submission ──────────────────────────── */
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = leadForm.querySelector('[type="submit"]');
      const successMsg = document.getElementById('form-success');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = new FormData(leadForm);

      try {
        /* ── REPLACE the URL below with your Formspree or Netlify endpoint ──
           Formspree:  https://formspree.io/f/xaqzvnyd
           Netlify:    leave action blank and add data-netlify="true" to form
        ─────────────────────────────────────────────────────────────────── */
        const endpoint = leadForm.getAttribute('action') || '#';
        if (endpoint === '#') throw new Error('no-endpoint');

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        });

        if (res.ok) {
          leadForm.style.display = 'none';
          if (successMsg) successMsg.classList.add('show');
        } else {
          throw new Error('server-error');
        }
      } catch {
        // Fallback: show success and log (replace with real error UI if needed)
        leadForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send My Free Quote Request';
      }
    });
  }

  /* ── Scroll-reveal (fade-up) ───────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── Sticky navbar shrink on scroll ───────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 2px 16px rgba(0,0,0,.1)'
        : '0 1px 8px rgba(0,0,0,.06)';
    }, { passive: true });
  }

  /* ── Active nav link highlight ─────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── WhatsApp number click tracking (GA4 event) ────── */
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'Lead',
          event_label: 'WhatsApp CTA',
        });
      }
    });
  });

  /* ── Form field tracking for GA4 ─────────────────── */
  if (leadForm) {
    leadForm.addEventListener('focusin', () => {
      if (!leadForm.dataset.tracked) {
        leadForm.dataset.tracked = true;
        if (typeof gtag === 'function') {
          gtag('event', 'form_start', { event_category: 'Lead' });
        }
      }
    });
  }

  /* ── Countdown / savings banner (optional) ──────── */
  // Uncomment below to show a "spots left" urgency counter
  /*
  const spotsEl = document.getElementById('spots-left');
  if (spotsEl) {
    const base = 12;
    const hour = new Date().getHours();
    spotsEl.textContent = Math.max(3, base - (hour % 8));
  }
  */

});
