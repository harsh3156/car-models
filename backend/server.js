require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Database connect
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Car World backend running" });
});

// Error middleware — always last
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});