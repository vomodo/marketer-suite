// src/pages/Dashboard.js

import { auth } from '../shared/auth.js';

export const DashboardPage = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="card">
        <h1>Dashboard</h1>
        <p>Xin chào <strong>${auth.user.email}</strong></p>
        <button id="logout" class="btn btn-text">Đăng xuất</button>
      </div>
    `;
    document.getElementById('logout').onclick = this.handleLogout;
  },
  handleLogout() {
    auth.clear();
    window.location.href = '/';
  }
};
