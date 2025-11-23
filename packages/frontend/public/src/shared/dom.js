// src/shared/dom.js

export const dom = {
  qs: (selector) => document.querySelector(selector),
  qsa: (selector) => document.querySelectorAll(selector),
  showError: (id, message) => {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.remove('hidden');
  },
  hideError: (id) => {
    const el = document.getElementById(id);
    el.textContent = '';
    el.classList.add('hidden');
  },
  clearForm: (formId) => {
    document.getElementById(formId).reset();
  }
};
