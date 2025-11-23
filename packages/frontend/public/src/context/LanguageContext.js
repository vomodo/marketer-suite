/**
 * LanguageContext - Global i18n state management
 * Supports Vietnamese (vi) and English (en)
 */

const DEFAULT_LANGUAGE = 'vi';
const SUPPORTED_LANGUAGES = ['vi', 'en'];
const STORAGE_KEY = 'marketer_suite_lang';

class LanguageContext {
  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.listeners = [];
    this.translations = {};
  }

  /**
   * Get stored language from localStorage or default
   * @returns {string} Language code
   */
  getStoredLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
      }
    } catch (e) {
      console.warn('Cannot access localStorage:', e);
    }
    return DEFAULT_LANGUAGE;
  }

  /**
   * Set current language and persist to storage
   * @param {string} lang - Language code (vi/en)
   */
  setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.error(`Unsupported language: ${lang}`);
      return;
    }
    
    this.currentLanguage = lang;
    
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Cannot save to localStorage:', e);
    }
    
    // Notify all listeners
    this.listeners.forEach(callback => callback(lang));
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Subscribe to language changes
   * @param {Function} callback - Callback function(lang)
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Load translations for a language
   * @param {string} lang - Language code
   * @param {Object} translations - Translation object
   */
  loadTranslations(lang, translations) {
    this.translations[lang] = translations;
  }

  /**
   * Get translation by key
   * @param {string} key - Translation key (dot notation supported)
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} Translated text
   */
  t(key, params = {}) {
    const lang = this.currentLanguage;
    const translations = this.translations[lang] || {};
    
    // Support dot notation: 'common.buttons.save'
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value === undefined) {
      console.warn(`Missing translation for key: ${key} in language: ${lang}`);
      return key;
    }
    
    // Interpolate parameters
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  }

  /**
   * Toggle between Vietnamese and English
   */
  toggleLanguage() {
    const newLang = this.currentLanguage === 'vi' ? 'en' : 'vi';
    this.setLanguage(newLang);
  }
}

// Export singleton instance
export const languageContext = new LanguageContext();
export default languageContext;
