const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/600x320?text=Car+World",
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Luxury",
    },
    fuelType: {
      type: String,
      default: "Petrol",
    },
    modelYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    transmission: {
      type: String,
      default: "Automatic",
    },
    mileage: {
      type: String,
      default: "0 km",
    },
    stock: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;

