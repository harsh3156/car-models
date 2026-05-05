const User = require("../models/User");
const Car = require("../models/car");
const Order = require("../models/Order");

// ── @desc    Get admin dashboard statistics
// ── @route   GET /api/dashboard/stats
// ── @access  Private / Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalCars, totalOrders, orders] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Car.countDocuments(),
      Order.countDocuments(),
      Order.find().select("totalPrice status"),
    ]);

    // Total revenue from Delivered orders only
    const totalRevenue = orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // Orders broken down by status
    const statusBreakdown = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCars,
        totalOrders,
        totalRevenue,
        statusBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Get recent orders for dashboard table
// ── @route   GET /api/dashboard/recent-orders
// ── @access  Private / Admin
const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .populate("car", "name brand price image");

    res.status(200).json({ success: true, data: recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Get top selling cars
// ── @route   GET /api/dashboard/top-cars
// ── @access  Private / Admin
const getTopCars = async (req, res) => {
  try {
    const topCars = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$car",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars",
          localField: "_id",
          foreignField: "_id",
          as: "car",
        },
      },
      { $unwind: "$car" },
      {
        $project: {
          "car.name": 1,
          "car.brand": 1,
          "car.image": 1,
          "car.price": 1,
          totalOrders: 1,
          totalRevenue: 1,
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: topCars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Get monthly revenue chart data (last 6 months)
// ── @route   GET /api/dashboard/revenue-chart
// ── @access  Private / Admin
const getRevenueChart = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const data = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getRecentOrders, getTopCars, getRevenueChart };
