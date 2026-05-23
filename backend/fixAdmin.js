require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_carworld")
  .then(async () => {
    console.log("Connected to DB");
    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (admin) {
      admin.password = process.env.ADMIN_PASSWORD;
      await admin.save(); // This will trigger the pre-save hook and hash it correctly
      console.log("Admin password reset successfully!");
    } else {
      console.log("Admin not found. Restart backend to create.");
    }
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
