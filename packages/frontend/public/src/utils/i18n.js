/**
 * i18n utility functions
 */

import { languageContext } from '../context/LanguageContext.js';
import viTranslations from '../locales/vi.js';
import enTranslations from '../locales/en.js';

// Load translations
languageContext.loadTranslations('vi', viTranslations);
languageContext.loadTranslations('en', enTranslations);

/**
 * Get translation function (shorthand)
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters
 * @returns {string} Translated text
 */
export const t = (key, params) => languageContext.t(key, params);

/**
 * Get current language
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => languageContext.getLanguage();

/**
 * Set language
 * @param {string} lang - Language code
 */
export const setLanguage = (lang) => languageContext.setLanguage(lang);

/**
 * Toggle language between vi and en
 */
export const toggleLanguage = () => languageContext.toggleLanguage();

/**
 * Subscribe to language changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onLanguageChange = (callback) => languageContext.subscribe(callback);

/**
 * Format number according to current locale
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  const lang = getCurrentLanguage();
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format date according to current locale
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  const lang = getCurrentLanguage();
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
};

/**
 * Format currency according to current locale
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: VND)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'VND') => {
  const lang = getCurrentLanguage();
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export default {
  t,
  getCurrentLanguage,
  setLanguage,
  toggleLanguage,
  onLanguageChange,
  formatNumber,
  formatDate,
  formatCurrency,
};
