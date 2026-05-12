const express = require("express");
const router = express.Router();

const { createOrder, getOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
    placeOrderValidator,
    updateOrderStatusValidator,
} = require("../validators/orderValidators");

// ── All order routes require authentication ───────────────────────────────────
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

// ── Admin: update order status ────────────────────────────────────────────────
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;

