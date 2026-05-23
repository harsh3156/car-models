const User = require("../models/User");

/**
 * createAdmin
 * Automatically provisions an admin user if one doesn't exist,
 * using credentials defined in the .env file.
 */
const createAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env - Skipping default admin creation");
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("✅ Admin account is ready and verified.");
            return;
        }

        // Create the admin user. Note: Password is automatically hashed by the User model's pre-save hook.
        await User.create({
            name: "Master Admin",
            email: adminEmail,
            password: adminPassword,
            role: "admin",
        });

        console.log(`✅ Default admin created successfully [Email: ${adminEmail}]`);
    } catch (error) {
        console.error("❌ Failed to create admin:", error.message);
    }
};

module.exports = createAdmin;