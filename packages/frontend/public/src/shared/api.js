// src/shared/api.js

const API_BASE = import.meta && import.meta.env && import.meta.env.DEV
  ? 'http://localhost:8787'
  : 'https://marketer-suite-api.vomodo.workers.dev';

async function request(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  sendOTP: (email) => request('/api/auth/send-otp', { email }),
  verifyOTP: (email, code) => request('/api/auth/verify-otp', { email, code })
};
