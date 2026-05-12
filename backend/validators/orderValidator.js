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
// Place Order Validator
// ─────────────────────────────────────────────
const placeOrderValidator = [

    body("car")
        .notEmpty()
        .withMessage("Car ID is required")
        .isMongoId()
        .withMessage("Invalid Car ID"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    body("paymentMethod")
        .notEmpty()
        .withMessage("Payment method is required")
        .isIn([
            "COD",
            "Razorpay",
            "Stripe",
            "UPI",
            "Card",
        ])
        .withMessage("Invalid payment method"),

    body("shippingAddress.fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Full name is invalid"),

    body("shippingAddress.phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must be 10 digits"),

    body("shippingAddress.address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 10, max: 300 })
        .withMessage("Address is too short"),

    body("shippingAddress.city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("shippingAddress.state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("shippingAddress.country")
        .trim()
        .notEmpty()
        .withMessage("Country is required"),

    body("shippingAddress.pincode")
        .trim()
        .notEmpty()
        .withMessage("Pincode is required")
        .matches(/^[0-9]{6}$/)
        .withMessage("Invalid pincode"),

    handleValidationErrors,
];

// ─────────────────────────────────────────────
// Update Order Status Validator
// ─────────────────────────────────────────────
const updateOrderStatusValidator = [

    body("status")
        .notEmpty()
        .withMessage("Order status is required")
        .isIn([
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Out For Delivery",
            "Delivered",
            "Cancelled",
        ])
        .withMessage("Invalid order status"),

    handleValidationErrors,
];

module.exports = {
    placeOrderValidator,
    updateOrderStatusValidator,
};