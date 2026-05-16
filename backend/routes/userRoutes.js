const express = require("express");
const {
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
} = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// User profile
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateProfile);

// Admin user management
router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", verifyAdmin, getUserById);
router.delete("/:id", verifyAdmin, deleteUser);
router.put("/:id/role", verifyAdmin, updateUserRole);

module.exports = router;