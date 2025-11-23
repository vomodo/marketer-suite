// src/pages/Auth.js

import { LoginForm } from '../components/Auth/LoginForm.js';
import { OTPVerify } from '../components/Auth/OTPVerify.js';
import { api } from '../shared/api.js';
import { auth } from '../shared/auth.js';
import { dom } from '../shared/dom.js';
import { validator } from '../shared/validator.js';

export const AuthPage = {
  state: {
    step: 'login',
    email: ''
  },
  render() {
    const app = document.getElementById('app');
    if (this.state.step === 'otp') {
      app.innerHTML = OTPVerify.template(this.state.email);
      OTPVerify.mount(
        this.handleOTPSubmit.bind(this),
        this.handleResend.bind(this)
      );
    } else {
      app.innerHTML = LoginForm.template();
      LoginForm.mount(this.handleLoginSubmit.bind(this));
    }
  },
  async handleLoginSubmit(e) {
    e.preventDefault();
    dom.hideError('login-error');
    const email = dom.qs('#email').value.trim();
    if (!validator.email(email)) {
      dom.showError('login-error', 'Email không hợp lệ');
      return;
    }
    try {
      await api.sendOTP(email);
      this.state.email = email;
      this.state.step = 'otp';
      this.render();
    } catch (err) {
      dom.showError('login-error', err.message);
    }
  },
  async handleOTPSubmit(e) {
    e.preventDefault();
    dom.hideError('otp-error');
    const inputs = dom.qsa('.otp-input');
    const code = Array.from(inputs).map(i => i.value).join('');
    if (!validator.otp(code)) {
      dom.showError('otp-error', 'Vui lòng nhập đủ 6 số');
      return;
    }
    try {
      const { token, user } = await api.verifyOTP(this.state.email, code);
      auth.set(token, user);
      window.location.href = '/dashboard';
    } catch (err) {
      dom.showError('otp-error', err.message);
      inputs.forEach(i => i.value = '');
      inputs[0].focus();
    }
  },
  async handleResend() {
    try {
      await api.sendOTP(this.state.email);
      alert('Đã gửi lại mã OTP');
    } catch (err) {
      alert(err.message);
    }
  }
};
