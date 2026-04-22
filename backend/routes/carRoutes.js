const express = require("express");
const router = express.Router();

const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
} = require("../controllers/carController.js");

// Search must come before /:id so it isn't caught as an id param
router.get("/search", searchCars);   // GET  /api/cars/search?q=...

router.get("/", getCars);      // GET  /api/cars
router.get("/:id", getCarById);   // GET  /api/cars/:id
router.post("/", createCar);    // POST /api/cars
router.put("/:id", updateCar);    // PUT  /api/cars/:id
router.delete("/:id", deleteCar);    // DELETE /api/cars/:id

module.exports = router;
