// src/components/Auth/OTPVerify.js

export const OTPVerify = {
  template: (email) => `
    <div class="card">
      <h1>Nhập mã OTP</h1>
      <p>Mã đã gửi đến <strong>${email}</strong></p>
      <form id="otp-form">
        <div class="otp-group">
          ${[0,1,2,3,4,5].map(i => `
            <input type="text" maxlength="1" class="otp-input" data-index="${i}" ${i===0?'autofocus':''} />
          `).join('')}
        </div>
        <div id="otp-error" class="error hidden"></div>
        <button type="submit" class="btn btn-primary">Xác nhận</button>
        <button type="button" id="resend" class="btn btn-text mt-sm">Gửi lại mã</button>
      </form>
    </div>
  `,
  mount: (onSubmit, onResend) => {
    const form = document.getElementById('otp-form');
    const inputs = document.querySelectorAll('.otp-input');
    // Auto-focus next
    inputs.forEach((input, i) => {
      input.oninput = () => { if (input.value && i < 5) inputs[i + 1].focus(); };
    });
    form.onsubmit = onSubmit;
    document.getElementById('resend').onclick = onResend;
  }
};
