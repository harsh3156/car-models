// ─────────────────────────────────────────────────────────────────────────────
// server.js — Car World Backend Entry Point
// ─────────────────────────────────────────────────────────────────────────────
// STARTUP FLOW:
//   1. Load environment variables from .env
//   2. Connect to MongoDB
//   3. Auto-create default admin account (if not exists)
//   4. Register all API routes
//   5. Start Express server on PORT
// ─────────────────────────────────────────────────────────────────────────────

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const createAdmin = require("./utils/createAdmin");
const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);app.use("/api/upload", uploadRoutes);
// ── Home Route ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Car World backend running" });
});

// ── Error middleware — always last ──────────────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB
    await connectDB();

    // Step 2: Seed default admin (reads ADMIN_EMAIL & ADMIN_PASSWORD from .env)
    await createAdmin();

    // Step 3: Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚗 Car World server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();