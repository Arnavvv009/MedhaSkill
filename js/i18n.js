/* ============================================
   MedhaSkill - Bilingual Engine (Hindi Default + English)
   ============================================ */

(function () {
  const LANG_KEY = 'medhaskill_lang';

  function getSavedLang() {
    return localStorage.getItem(LANG_KEY) || 'hi';
  }

  function applyLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;

    // Translate elements with data-en attribute
    document.querySelectorAll('[data-en]').forEach((el) => {
      if (!el.dataset.hi) {
        el.dataset.hi = el.innerHTML;
      }
      if (lang === 'en') {
        el.innerHTML = el.dataset.en;
      } else {
        el.innerHTML = el.dataset.hi;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach((el) => {
      if (!el.dataset.hiPlaceholder) {
        el.dataset.hiPlaceholder = el.getAttribute('placeholder') || '';
      }
      el.setAttribute(
        'placeholder',
        lang === 'en' ? el.dataset.enPlaceholder : el.dataset.hiPlaceholder
      );
    });

    // Translate page title
    const titleEl = document.querySelector('title[data-en-title]');
    if (titleEl) {
      if (!titleEl.dataset.hiTitle) {
        titleEl.dataset.hiTitle = titleEl.textContent;
      }
      titleEl.textContent = lang === 'en' ? titleEl.dataset.enTitle : titleEl.dataset.hiTitle;
    }

    // Update language toggle buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Dispatch custom event so dynamic UI (auth/courses) updates too
    window.dispatchEvent(new CustomEvent('medha:langchange', { detail: { lang } }));
  }

  window.MedhaI18n = {
    getLang: getSavedLang,
    setLang: applyLanguage
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
      });
    });

    // Apply saved language (defaults to Hindi 'hi')
    applyLanguage(getSavedLang());
  });
})();
