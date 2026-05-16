// ─────────────────────────────────────────────────────────────────────────────
// axios.js — Configured Axios instance for API calls
// ─────────────────────────────────────────────────────────────────────────────
// - Base URL points to backend server
// - Automatically attaches JWT token to every request
// - Handles 401 errors by clearing auth and redirecting to login
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

// Create axios instance with backend base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// ── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// Attaches the admin token from localStorage to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
// If server returns 401 (unauthorized), clear auth data and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
