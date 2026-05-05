const Car = require("../models/car");

// ── @desc    Get all cars
// ── @route   GET /api/cars
// ── @access  Public
const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cars.length, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Get single car by ID
// ── @route   GET /api/cars/:id
// ── @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── @desc    Create a new car
// ── @route   POST /api/cars
// ── @access  Private / Admin
const createCar = async (req, res) => {
  try {
    const { name, brand, price, image, description, fuelType, modelYear, transmission, mileage, stock } = req.body;

    const car = await Car.create({
      name,
      brand,
      price,
      image,
      description,
      fuelType,
      modelYear,
      transmission,
      mileage,
      stock,
    });

    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── @desc    Update a car
// ── @route   PUT /api/cars/:id
// ── @access  Private / Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── @desc    Delete a car
// ── @route   DELETE /api/cars/:id
// ── @access  Private / Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar };
