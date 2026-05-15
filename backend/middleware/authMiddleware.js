// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // ── @desc    Protect routes — verifies JWT from Authorization header
// // ── Usage    router.get("/route", protect, handler)
// const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Accept token from "Authorization: Bearer <token>" header
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not authorized — no token provided" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user to request (without password)
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({ success: false, message: "User belonging to this token no longer exists" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ success: false, message: "Invalid token" });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ success: false, message: "Token has expired — please log in again" });
//     }
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = protect;

const jwt = require("jsonwebtoken");

// Middleware: Verify any logged-in user (user OR admin)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role: "user" | "admin" }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Middleware: Only allow admins
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
