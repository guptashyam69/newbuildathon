/* ============================================================
   BUILDATHON — MAIN JS (Nav, Counters, Scroll, Typewriter)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Progress Bar ──────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      progressBar.style.width = `${progress}%`;
    });
  }

  /* ── Navbar Scroll Effect ─────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  }

  /* ── Mobile Hamburger ─────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ── Intersection Observer — Reveal ───────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Animated Counters ────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();
      const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      const animate = (now) => {
        const elapsed = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(ease(elapsed) * target) + suffix;
        if (elapsed < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ── Countdown Timer ──────────────────────────────────── */
  function updateCountdown() {
    const target = new Date('2026-08-13T09:00:00+05:30').getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      document.querySelectorAll('.countdown-value').forEach(el => el.textContent = '00');
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };
    set('cd-days', days);
    set('cd-hours', hours);
    set('cd-mins', mins);
    set('cd-secs', secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── Typewriter ───────────────────────────────────────── */
  function typewriter(el, strings, speed = 80, pause = 2000) {
    if (!el) return;
    let strIdx = 0, charIdx = 0, deleting = false;
    const cursor = el.nextElementSibling;

    function tick() {
      const current = strings[strIdx];
      if (deleting) {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          strIdx = (strIdx + 1) % strings.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, speed / 2);
      } else {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          setTimeout(() => { deleting = true; tick(); }, pause);
          return;
        }
        setTimeout(tick, speed);
      }
    }
    tick();
  }

  const typeEl = document.getElementById('typewriter-text');
  if (typeEl) {
    typewriter(typeEl, [
      'AI Innovation', 'Future Tech', 'Smart Solutions',
      'Real-World Impact', 'Next-Gen Ideas'
    ]);
  }

  /* ── Parallax on Mouse Move ───────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    const px = (e.clientX / window.innerWidth - 0.5) * 2;
    const py = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = +(el.getAttribute('data-parallax') || 0.05);
      el.style.transform = `translate(${px * 30 * speed}px, ${py * 30 * speed}px)`;
    });
  });

  /* ── Smooth Anchor Links ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active Nav Highlighting ──────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.style.color = 'var(--neon-cyan)';
      a.style.textShadow = '0 0 10px rgba(0,245,255,0.5)';
    }
  });

  /* ── Copy to Clipboard Helper ─────────────────────────── */
  window.copyToClipboard = (text, btn) => {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    });
  };

  /* ── FAQ Accordion ────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

});
