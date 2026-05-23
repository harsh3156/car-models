const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentOrders,
  getTopCars,
  getRevenueChart,
} = require("../controllers/dashboardController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

// ── All dashboard routes: Private + Admin only ────────────────────────────────
router.use(protect, verifyAdmin);

router.get("/stats", getDashboardStats);
router.get("/recent-orders", getRecentOrders);
router.get("/top-cars", getTopCars);
router.get("/revenue-chart", getRevenueChart);

module.exports = router;
