// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // ── Helper: sign a JWT ────────────────────────────────────────────────────────
// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });
// };

// // ── Helper: send token in response ───────────────────────────────────────────
// const sendTokenResponse = (user, statusCode, res) => {
//   const token = generateToken(user._id, user.role);

//   res.status(statusCode).json({
//     success: true,
//     token,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// };

// // ── @desc    Register a new user
// // ── @route   POST /api/auth/register
// // ── @access  Public
// const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email already in use" });
//     }

//     // Prevent self-assigning admin role (only DB seed / manual assignment)
//     const safeRole = role === "admin" ? "user" : role || "user";

//     const user = await User.create({ name, email, password, role: safeRole });

//     sendTokenResponse(user, 201, res);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ── @desc    Login user
// // ── @route   POST /api/auth/login
// // ── @access  Public
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "Please provide email and password" });
//     }

//     // Explicitly select password since it's select:false in schema
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     sendTokenResponse(user, 200, res);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ── @desc    Get currently logged-in user
// // ── @route   GET /api/auth/me
// // ── @access  Private
// const getMe = async (req, res) => {
//   try {
//     // req.user is set by authMiddleware
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { register, login, getMe };


// const user = await User.create({
//   name,
//   email,
//   password,
//   role
// });

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Your mongoose/sequelize User model

// ─────────────────────────────────────────────
// Helper: generate JWT token
// ─────────────────────────────────────────────
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─────────────────────────────────────────────
// USER LOGIN  →  /api/auth/login
// ─────────────────────────────────────────────
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user (only non-admin accounts)
    const user = await User.findOne({ email, role: "user" });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." }); // vague on purpose
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken({ id: user._id, email: user.email, role: "user" });

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: "user" },
    });
  } catch (error) {
    console.error("userLogin error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// ADMIN LOGIN  →  /api/auth/admin/login
// ─────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find admin account only
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken({ id: admin._id, email: admin.email, role: "admin" });

    res.status(200).json({
      message: "Admin login successful.",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: "admin" },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────────
// REGISTER USER  →  /api/auth/register
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: "user" });

    const token = generateToken({ id: user._id, email: user.email, role: "user" });

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: "user" },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { userLogin, adminLogin, registerUser };