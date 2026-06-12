const express = require("express");
const router = express.Router();

const { createOrder, getOrders, getOrderById, updateOrderStatus, createPublicOrder } = require("../controllers/orderController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");
const {
    placeOrderValidator,
    updateOrderStatusValidator,
} = require("../validators/orderValidator");

// ── Public purchase flow ───────────────────────────────────────────────────
router.post("/create", createPublicOrder);

// ── All order routes require authentication ───────────────────────────────────
router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

// ── Admin: update order status ────────────────────────────────────────────────
router.put("/:id/status", protect, verifyAdmin, updateOrderStatus);

module.exports = router;

