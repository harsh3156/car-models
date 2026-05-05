const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentOrders,
  getTopCars,
  getRevenueChart,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// ── All dashboard routes: Private + Admin only ────────────────────────────────
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/recent-orders", getRecentOrders);
router.get("/top-cars", getTopCars);
router.get("/revenue-chart", getRevenueChart);

module.exports = router;
