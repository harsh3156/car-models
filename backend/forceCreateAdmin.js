require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_carworld")
  .then(async () => {
    console.log("Connected to DB");
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
        console.log("Admin already exists, resetting password...");
        existingAdmin.password = adminPassword; // pre-save hook will hash it
        await existingAdmin.save();
        console.log("Password reset successfully");
    } else {
        console.log("Creating new Admin...");
        await User.create({
            name: "Admin",
            email: adminEmail,
            password: adminPassword, // pre-save hook will hash it
            role: "admin",
        });
        console.log("Admin created successfully!");
    }

    mongoose.disconnect();
  })
  .catch(err => console.error(err));
