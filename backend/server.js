require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db.js");
const carRoutes = require("./routes/carRoutes.js");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Car World backend running" });
});

// Car API routes
app.use("/api/cars", carRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const UserModel = mongoose.model("users", UserSchema);

// INSERT API
app.post("/insert", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// SELECT API
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});



const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});


// ===== REGISTER =====
app.post("/register", async (req, res) => {
  await User.create(req.body);
  res.send("register success");
});


// ===== LOGIN =====
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ status: "ok" });
  } else {
    res.json({ status: "fail" });
  }

});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});