const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully");
    } catch (error) {
        console.log("Create admin error:", error.message);
    }
};

module.exports = createAdmin;