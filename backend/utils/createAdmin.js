const User = require("../models/User");

/**
 * createAdmin
 * Automatically provisions an admin user if one doesn't exist,
 * using credentials defined in the .env file.
 */
const createAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "123456";

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env - Using fallback admin credentials");
        }

        const existingAdmin = await User.findOne({ email: adminEmail }).select("+password");

        if (existingAdmin) {
            existingAdmin.role = "admin";
            const passwordMatches = await existingAdmin.matchPassword(adminPassword);
            if (!passwordMatches) {
                existingAdmin.password = adminPassword;
                await existingAdmin.save();
                console.log("✅ Admin password was reset to match .env credentials.");
            } else {
                await existingAdmin.save();
                console.log("✅ Admin account is ready and verified.");
            }
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