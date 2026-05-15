// const express = require("express");

// const {
//     register,
//     login,
//     getMe,
// } = require("../controllers/authController");

// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// router.get("/me", authMiddleware, getMe);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { userLogin, adminLogin, registerUser } = require("../controllers/authController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);       // User registration
router.post("/login", userLogin);             // User login
router.post("/admin/login", adminLogin);      // Admin login (separate endpoint)

// Protected: any logged-in user
router.get("/me", verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// Protected: admin only
router.get("/admin/dashboard", verifyAdmin, (req, res) => {
    res.json({ message: "Welcome to admin dashboard.", admin: req.user });
});

module.exports = router;