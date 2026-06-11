require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD || "123456";

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_carworld")
  .then(async () => {
    console.log("Connected to DB");
    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.password = adminPassword;
      admin.role = "admin";
      await admin.save(); // This will trigger the pre-save hook and hash it correctly
      console.log(`Admin password reset successfully for ${adminEmail}`);
    } else {
      await User.create({
        name: "Master Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`Admin created successfully with ${adminEmail}`);
    }
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
