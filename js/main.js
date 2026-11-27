/* ============================================
   MedhaSkill - Main JavaScript (Direct Access)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  function getLang() {
    return (window.MedhaI18n && window.MedhaI18n.getLang()) || localStorage.getItem('medhaskill_lang') || 'hi';
  }

  // --- Navbar Scroll ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((i) => {
          i.classList.remove('active');
          const ans = i.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = '0';
        });
        if (!isActive) {
          item.classList.add('active');
          const answer = item.querySelector('.faq-answer');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current >= target) {
              el.textContent = prefix + target.toLocaleString() + suffix;
            } else {
              el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
              requestAnimationFrame(updateCounter);
            }
          };
          updateCounter();
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Course Filtering & Direct Interactive Module Modal (courses.html) ---
  const filterChips = document.querySelectorAll('.course-filter-chip');
  const courseSearch = document.getElementById('course-search');
  const courseCards = document.querySelectorAll('.course-card[data-category]');

  function filterCourses() {
    const activeChip = document.querySelector('.course-filter-chip.active');
    const category = activeChip ? activeChip.dataset.filter : 'all';
    const query = courseSearch ? courseSearch.value.trim().toLowerCase() : '';

    courseCards.forEach((card) => {
      const cardCat = card.dataset.category || '';
      const text = card.textContent.toLowerCase();
      const catMatch = category === 'all' || cardCat === category;
      const searchMatch = !query || text.includes(query);
      card.style.display = catMatch && searchMatch ? '' : 'none';
    });
  }

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      filterCourses();
    });
  });

  if (courseSearch) {
    courseSearch.addEventListener('input', filterCourses);
  }

  // Interactive Module Modal (Direct Access, No Login Required)
  const modalOverlay = document.getElementById('module-modal-overlay');
  const modalClose = document.getElementById('module-modal-close');
  const modalTitle = document.getElementById('module-modal-title');
  const modalDesc = document.getElementById('module-modal-desc');
  const modalLessons = document.getElementById('module-modal-lessons');

  document.querySelectorAll('.open-module-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = getLang();
      const card = btn.closest('.course-card');
      const titleEl = card ? card.querySelector('.course-title') : null;
      const descEl = card ? card.querySelector('.course-desc') : null;
      if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent;
      if (modalDesc && descEl) modalDesc.textContent = descEl.textContent;
      if (modalLessons) {
        modalLessons.innerHTML = lang === 'en'
          ? `<div class="module-lesson-item"><span>1. Concept Foundation &amp; Story</span><span class="badge badge-success">Open ✓</span></div>
             <div class="module-lesson-item"><span>2. Interactive Simulation Lab</span><span class="badge badge-success">Open ✓</span></div>
             <div class="module-lesson-item"><span>3. AI Guided Practice &amp; Quiz</span><span class="badge badge-success">Open ✓</span></div>
             <div class="module-lesson-item"><span>4. Mastery Assessment &amp; Certificate</span><span class="badge badge-primary">Ready</span></div>`
          : `<div class="module-lesson-item"><span>1. मूल अवधारणा और कहानी</span><span class="badge badge-success">खुला है ✓</span></div>
             <div class="module-lesson-item"><span>2. इंटरैक्टिव सिमुलेशन लैब</span><span class="badge badge-success">खुला है ✓</span></div>
             <div class="module-lesson-item"><span>3. AI अभ्यास और क्विज़</span><span class="badge badge-success">खुला है ✓</span></div>
             <div class="module-lesson-item"><span>4. दक्षता मूल्यांकन और प्रमाणपत्र</span><span class="badge badge-primary">तैयार</span></div>`;
      }
      if (modalOverlay) modalOverlay.classList.add('open');
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  // --- Progress Bars Animation ---
  const progressBars = document.querySelectorAll('.progress-fill[data-width]');
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  progressBars.forEach((bar) => {
    bar.style.width = '0%';
    progressObserver.observe(bar);
  });
});
