const express = require("express");
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;