/* ============================================================
   AI GUARDIAN — SCRIPT.JS
   UX: Scroll reveal, sticky nav, mobile menu, route interaction
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Sticky nav shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Mobile hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navbar.classList.toggle('mobile-open');
      const isOpen = navbar.classList.contains('mobile-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate hamburger → ✕
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
      }
    });
  }

  /* Close mobile nav when a link is clicked */
  document.querySelectorAll('.nav__links a, .nav__cta a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('mobile-open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity  = '';
      spans[2].style.transform = '';
    });
  });

  /* ---------- 3. Scroll Reveal ---------- */
  // Add .reveal class to all target elements
  const revealTargets = [
    '.hero__badge', '.hero__headline', '.hero__sub', '.hero__actions', '.hero__stats',
    '.why .section-label', '.why .section-title', '.why .section-sub',
    '.route-card', '.route-detail',
    '.features .section-label', '.features .section-title', '.features .section-sub',
    '.feature-card',
    '.how-it-works .section-label', '.how-it-works .section-title', '.how-it-works .section-sub',
    '.step-card',
    '.cta-card',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger children of grids/lists
      if (el.closest('.features-grid') || el.closest('.route-list') || el.closest('.steps-row')) {
        el.style.transitionDelay = `${i * 0.07}s`;
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 4. Route card tab interaction ---------- */
  const routeCards = document.querySelectorAll('.route-card');
  const metricValues = document.querySelectorAll('.metric__value');
  const insightText = document.querySelector('.route-detail__insight p');

  const routeData = {
    fastest: {
      metrics: ['72%', 'Minimal CCTV', '1', '3'],
      insight: '<strong>AI Insight:</strong> Route A is the quickest but passes through poorly lit underpasses with minimal surveillance. Not recommended for solo travel at night.'
    },
    recommended: {
      metrics: ['98%', 'Active HD CCTV', '4', '0'],
      insight: '<strong>AI Insight:</strong> This route passes 4 minutes of real-time camera placements, active radio patrol pathways, active CCTV for monitoring, and a nearby Guardian ensures complete peace of mind.'
    },
    balanced: {
      metrics: ['85%', 'Moderate CCTV', '2', '1'],
      insight: '<strong>AI Insight:</strong> Route C offers a balance between time and safety. Some sections have reduced lighting — carrying a personal alarm is recommended after 9 PM.'
    }
  };

  routeCards.forEach(card => {
    card.addEventListener('click', () => {
      routeCards.forEach(c => c.classList.remove('active-route'));
      card.classList.add('active-route');

      let key = 'recommended';
      if (card.classList.contains('route-card--fastest')) key = 'fastest';
      if (card.classList.contains('route-card--balanced')) key = 'balanced';

      const data = routeData[key];

      // Animate metric values changing
      metricValues.forEach((el, i) => {
        el.style.transform = 'scale(0.8)';
        el.style.opacity = '0';
        el.style.transition = 'all 0.2s ease';
        setTimeout(() => {
          el.textContent = data.metrics[i];
          el.style.transform = 'scale(1)';
          el.style.opacity = '1';
        }, 200 + i * 40);
      });

      // Update insight
      if (insightText) {
        insightText.style.opacity = '0';
        setTimeout(() => {
          insightText.innerHTML = data.insight;
          insightText.style.opacity = '1';
          insightText.style.transition = 'opacity 0.3s ease';
        }, 250);
      }
    });
  });

  /* ---------- 5. Feature card hover spark ---------- */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * 4;
      const rotY = ((x - cx) / cx) * -4;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 6. Smooth active nav link highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--clr-primary)';
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => navObserver.observe(s));

  /* ---------- 7. CTA button micro-interaction ---------- */
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- 8. Respect reduced motion ---------- */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    document.querySelectorAll('[style*="transitionDelay"]').forEach(el => {
      el.style.transitionDelay = '0s';
    });
  }

  /* ---------- 9. Stats counter animation ---------- */
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat__value').forEach(el => {
        const finalText = el.textContent.trim();
        const numMatch = finalText.match(/[\d.]+/);
        if (!numMatch) return;
        const finalNum = parseFloat(numMatch[0]);
        const prefix = finalText.split(numMatch[0])[0];
        const suffix = finalText.split(numMatch[0])[1] || '';
        let start = 0;
        const duration = 1200;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + (finalNum < 10 ? (finalNum * eased).toFixed(1) : Math.round(finalNum * eased)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = finalText;
        };
        requestAnimationFrame(step);
      });
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero__stats');
  if (statsEl) statsObserver.observe(statsEl);

});
