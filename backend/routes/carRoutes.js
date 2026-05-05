const express = require("express");
const router = express.Router();

const { getCars, getCarById, createCar, updateCar, deleteCar } = require("../controllers/carController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/", getCars);
router.get("/:id", getCarById);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.post("/", protect, adminOnly, createCar);
router.put("/:id", protect, adminOnly, updateCar);
router.delete("/:id", protect, adminOnly, deleteCar);

module.exports = router;
