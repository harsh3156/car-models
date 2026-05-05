const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── @desc    Protect routes — verifies JWT from Authorization header
// ── Usage    router.get("/route", protect, handler)
const protect = async (req, res, next) => {
  try {
    let token;

    // Accept token from "Authorization: Bearer <token>" header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized — no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User belonging to this token no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired — please log in again" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { protect };
