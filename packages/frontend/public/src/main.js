// src/main.js

import { auth } from './shared/auth.js';
import { AuthPage } from './pages/Auth.js';
import { DashboardPage } from './pages/Dashboard.js';

// Simple router
const routes = {
  '/': () => auth.check() ? DashboardPage.render() : AuthPage.render(),
  '/dashboard': () => auth.check() ? DashboardPage.render() : AuthPage.render()
};

function init() {
  const path = window.location.pathname;
  const route = routes[path] || routes['/'];
  route();
}

init();
