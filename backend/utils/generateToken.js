// ─────────────────────────────────────────────────────────────────────────────
// generateToken.js — Creates a signed JWT token
// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS:
//   1. Accepts a payload object (e.g. { id, email, role })
//   2. Signs it with the JWT_SECRET from .env
//   3. Sets expiry from JWT_EXPIRES_IN (default 7 days)
//   4. Returns the signed token string
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
