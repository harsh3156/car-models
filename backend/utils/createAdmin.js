const bcrypt = require("bcryptjs");
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

const createAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ role: "admin" });
    if (existing) {
        console.log("Admin already exists!");
        process.exit();
    }

    const hashedPassword = await bcrypt.hash("harsh.123", 12);  // ✅ string mein

    await User.create({
        name: "Admin",
        email: "h1@gmail.com",
        password: hashedPassword,   // ✅ hashed password use karo
        role: "admin",
    });

    console.log("Admin created successfully!");
    process.exit();
};

createAdmin();