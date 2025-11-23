/**
 * LanguageToggle Component
 * Allows users to switch between Vietnamese and English
 */

import { getCurrentLanguage, toggleLanguage, onLanguageChange } from '../utils/i18n.js';

class LanguageToggle {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentLang = getCurrentLanguage();
    this.unsubscribe = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    
    // Subscribe to language changes
    this.unsubscribe = onLanguageChange((lang) => {
      this.currentLang = lang;
      this.render();
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="language-toggle">
        <button class="language-toggle__btn" data-lang="vi" 
                aria-label="Switch to Vietnamese"
                ${this.currentLang === 'vi' ? 'disabled' : ''}>
          <span class="language-toggle__icon">🇻🇳</span>
          <span class="language-toggle__text">VI</span>
        </button>
        <button class="language-toggle__btn" data-lang="en"
                aria-label="Switch to English"
                ${this.currentLang === 'en' ? 'disabled' : ''}>
          <span class="language-toggle__icon">🇬🇧</span>
          <span class="language-toggle__text">EN</span>
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.language-toggle__btn');
      if (btn && !btn.disabled) {
        toggleLanguage();
      }
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default LanguageToggle;
