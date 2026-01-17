/**
 * Input Validation Middleware
 * 
 * Uses express-validator for sanitization and validation
 */

const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Registration validation rules
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain special character'),

    handleValidationErrors
];

/**
 * Login validation rules
 */
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
];

/**
 * Product validation rules
 */
const productValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title too long'),

    body('price')
        .isFloat({ min: 0 }).withMessage('Price must be positive'),

    handleValidationErrors
];

/**
 * Order validation rules
 */
const orderValidation = [
    body('items')
        .isArray({ min: 1 }).withMessage('Order must have items'),

    body('shippingAddress.street')
        .trim()
        .notEmpty().withMessage('Street is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('shippingAddress.postalCode')
        .trim()
        .notEmpty().withMessage('Postal code is required'),

    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    registerValidation,
    loginValidation,
    productValidation,
    orderValidation
};
