// src/components/Auth/LoginForm.js

export const LoginForm = {
  template: () => `
    <div class="card">
      <h1>Đăng nhập</h1>
      <p>Nhập email để nhận mã OTP</p>
      <form id="login-form">
        <div class="mb-md">
          <label for="email">Email</label>
          <input type="email" id="email" class="input" placeholder="your@email.com" required />
        </div>
        <div id="login-error" class="error hidden"></div>
        <button type="submit" class="btn btn-primary">Gửi mã</button>
      </form>
    </div>
  `,
  mount: (onSubmit) => {
    const form = document.getElementById('login-form');
    form.onsubmit = onSubmit;
  }
};
