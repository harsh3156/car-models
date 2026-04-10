const Car = require("../models/car.js");

// @desc    Get all cars
// @route   GET /api/cars
const getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new car
// @route   POST /api/cars
const createCar = async (req, res) => {
  try {
    const { name, brand, price, image, description, fuelType, modelYear, transmission } = req.body;

    // Validate required fields
    if (!name || !brand || !price || !image || !description) {
      return res.status(400).json({
        message: "Please provide all required fields: name, brand, price, image, description",
      });
    }

    const car = await Car.create({
      name,
      brand,
      price,
      image,
      description,
      fuelType,
      modelYear,
      transmission,
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a car by ID
// @route   PUT /api/cars/:id
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a car by ID
// @route   DELETE /api/cars/:id
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(req.params.id);

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search / filter cars by brand or name
// @route   GET /api/cars/search?q=toyota
const searchCars = async (req, res) => {
  try {
    const query = req.query.q || "";
    const cars = await Car.find({
      $or: [
        { name:  { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
};
