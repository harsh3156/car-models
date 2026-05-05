const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Dispatched", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    trackingId: {
      type: String,
      unique: true,
      default: () => `TRK-${uuidv4().split("-")[0].toUpperCase()}`,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
