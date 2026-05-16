// ─────────────────────────────────────────────────────────────────────────────
// authController.js — Handles Login, Register, and Profile APIs
// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS:
//   POST /api/auth/login          → Unified login (auto-detects admin vs user)
//   POST /api/auth/admin/login    → Admin-only login (extra security)
//   POST /api/auth/register       → Register a new user account
//   GET  /api/auth/me             → Get current logged-in user's profile
// ─────────────────────────────────────────────────────────────────────────────

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED LOGIN  →  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
// HOW ADMIN LOGIN IS VERIFIED:
//   1. Find user by email (any role — admin or user)
//   2. Compare entered password with hashed password using bcrypt
//   3. If match → generate JWT token with user's role embedded
//   4. Return token + role so frontend knows where to redirect
//   5. If admin → frontend redirects to /admin/dashboard
//   6. If user  → frontend redirects to /  (main Car World site)
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email — select("+password") because password has select:false in schema
    const user = await User.findOne({ email }).select("+password");

    // If no user found with this email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        userExists: false, // Frontend uses this to suggest registration
      });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        userExists: true,
      });
    }

    // Generate JWT token with user info embedded
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Send success response with token, role, and user data
    res.status(200).json({
      success: true,
      message: `${user.role === "admin" ? "Admin" : "User"} login successful.`,
      token,
      role: user.role, // "admin" or "user" — frontend uses this for redirection
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY LOGIN  →  POST /api/auth/admin/login
// ─────────────────────────────────────────────────────────────────────────────
// Extra-secure endpoint that ONLY allows admin accounts to login.
// Regular users cannot log in through this endpoint.
// ─────────────────────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Only find accounts with role "admin"
    const admin = await User.findOne({ email, role: "admin" }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      role: "admin",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER USER  →  POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
// Creates a new user account with role "user" (never "admin").
// Password is hashed automatically by User model's pre-save hook.
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate all required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password) are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Check if email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Create user — password is hashed by User model's pre-save hook
    // IMPORTANT: Do NOT manually hash here, the model handles it
    const user = await User.create({ name, email, password, role: "user" });

    // Auto-login after registration by generating a token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      role: "user",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET CURRENT USER  →  GET /api/auth/me
// ─────────────────────────────────────────────────────────────────────────────
// Returns the profile of the currently logged-in user.
// Requires a valid JWT token in the Authorization header.
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is set by the verifyToken middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, adminLogin, registerUser, getMe };