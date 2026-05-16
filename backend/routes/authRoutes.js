// ─────────────────────────────────────────────────────────────────────────────
// authRoutes.js — Authentication API routes
// ─────────────────────────────────────────────────────────────────────────────
// ROUTE MAP:
//   POST /api/auth/login          → Unified login (admin + user)
//   POST /api/auth/admin/login    → Admin-only login
//   POST /api/auth/register       → Register new user
//   GET  /api/auth/me             → Get logged-in user profile (protected)
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

// Import controller functions
const { login, adminLogin, registerUser, getMe } = require("../controllers/authController");

// Import middleware
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// ── Public Routes (no token needed) ──────────────────────────────────────────
router.post("/register", registerUser);       // Anyone can register
router.post("/login", login);                 // Unified login (detects role)
router.post("/admin/login", adminLogin);      // Admin-only login endpoint

// ── Protected Routes (token required) ────────────────────────────────────────
router.get("/me", verifyToken, getMe);        // Any logged-in user

// ── Admin-Only Routes ────────────────────────────────────────────────────────
router.get("/admin/dashboard", verifyAdmin, (req, res) => {
  res.json({ success: true, message: "Welcome to admin dashboard.", admin: req.user });
});

module.exports = router;