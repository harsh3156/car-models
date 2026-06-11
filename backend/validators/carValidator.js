const { body, validationResult } = require("express-validator");

// ─────────────────────────────────────────────
// Validation Error Handler
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Add Car Validator
// ─────────────────────────────────────────────
const addCarValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Car name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Car name must be between 2 and 100 characters"),

    body("brand")
        .trim()
        .notEmpty()
        .withMessage("Brand is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Brand name is invalid"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be numeric")
        .custom((value) => {
            if (value <= 0) {
                throw new Error("Price must be greater than 0");
            }
            return true;
        }),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ min: 5, max: 2000 })
        .withMessage("Description must be between 5 and 2000 characters"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a positive number"),

    body("modelYear")
        .optional()
        .isInt({ min: 1990, max: 2035 })
        .withMessage("Invalid manufacturing year"),

    body("year")
        .optional()
        .isInt({ min: 1990, max: 2035 })
        .withMessage("Invalid manufacturing year"),

    handleValidationErrors,
];

// ─────────────────────────────────────────────
// Update Car Validator
// ─────────────────────────────────────────────
const updateCarValidator = [

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Invalid car name"),

    body("brand")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Invalid brand"),

    body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be numeric"),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ min: 5, max: 2000 })
        .withMessage("Description is too short"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be positive"),

    body("modelYear")
        .optional()
        .isInt({ min: 1990, max: 2035 })
        .withMessage("Invalid year"),

    body("year")
        .optional()
        .isInt({ min: 1990, max: 2035 })
        .withMessage("Invalid year"),

    handleValidationErrors,
];

module.exports = {
    addCarValidator,
    updateCarValidator,
};