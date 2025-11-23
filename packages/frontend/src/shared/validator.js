// src/shared/validator.js

export const validator = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  otp: (code) => {
    return code.length === 6 && /^\d+$/.test(code);
  }
};
