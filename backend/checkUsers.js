require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_carworld")
  .then(async () => {
    console.log("Connected to DB");
    const users = await User.find({});
    console.log("All users:", users);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
