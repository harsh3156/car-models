const express = require("express");
const router = express.Router();

const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
} = require("../controllers/carController");

const {
  addCarValidator,
  updateCarValidator,
} = require("../validators/carValidator");

// Search route
router.get("/search", searchCars);

// Get all cars
router.get("/", getCars);

// Get single car
router.get("/:id", getCarById);

// Create car
router.post("/", addCarValidator, createCar);

// Update car
router.put("/:id", updateCarValidator, updateCar);

// Delete car
router.delete("/:id", deleteCar);

module.exports = router;