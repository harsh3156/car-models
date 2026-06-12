const Order = require("../models/Order");
const Car = require("../models/car");

// ── @desc    Create a public purchase order from the storefront form
// ── @route   POST /api/orders/create
// ── @access  Public
const createPublicOrder = async (req, res) => {
  try {
    const {
      carId,
      carName,
      carPrice,
      fullName,
      email,
      phone,
      address,
      state,
      pinCode,
      paymentMethod,
      emiTenure,
      notes,
    } = req.body;

    if (!carId || !carName || !carPrice || !fullName || !email || !phone || !address || !state || !pinCode || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
    }

    if (!/^\d{6}$/.test(pinCode)) {
      return res.status(400).json({ success: false, message: "PIN code must be 6 digits" });
    }

    if (paymentMethod === "EMI" && !emiTenure) {
      return res.status(400).json({ success: false, message: "EMI tenure is required" });
    }

    const order = await Order.create({
      carId,
      carName,
      carPrice: Number(carPrice),
      buyerName: fullName,
      email,
      phone,
      address,
      state,
      pinCode,
      paymentMethod,
      emiTenure: paymentMethod === "EMI" ? emiTenure : "",
      notes: notes || "",
      status: "pending",
    });

    res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── @desc    Place a new order
// ── @route   POST /api/orders
// ── @access  Private
const createOrder = async (req, res) => {
  try {
    const { carId, quantity } = req.body;

    // Validate car exists and has enough stock
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${car.stock} unit(s) in stock`,
      });
    }

    const totalPrice = car.price * quantity;

    const order = await Order.create({
      user: req.user.id,
      car: carId,
      quantity,
      totalPrice,
    });

    // Deduct stock
    car.stock -= quantity;
    await car.save();

    // Populate for response
    await order.populate("car", "name brand price image");
    await order.populate("user", "name email");

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── @desc    Get orders (admin: all orders | user: own orders)
// ── @route   GET /api/orders
// ── @access  Private
const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };

    const orders = await Order.find(filter)
      .populate("car", "name brand price image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Get single order by ID
// ── @route   GET /api/orders/:id
// ── @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("car", "name brand price image")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only owner or admin can view
    if (order.user._id.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Update order status (admin only)
// ── @route   PUT /api/orders/:id/status
// ── @access  Private / Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("car", "name brand price image")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, createPublicOrder };
