const { body, validationResult } = require("express-validator");

// Common validation result handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};

// Register validation
const registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain one number"),

    body("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be user or admin"),

    handleValidationErrors,
];

// Login validation
const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    handleValidationErrors,
];

// Update profile validation
const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    handleValidationErrors,
];

// Role update validation
const updateRoleValidator = [
    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["user", "admin"])
        .withMessage("Role must be user or admin"),

    handleValidationErrors,
];

module.exports = {
    registerValidator,
    loginValidator,
    updateProfileValidator,
    updateRoleValidator,
};