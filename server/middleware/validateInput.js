/**
 * AutoValue AI – Input Validation Middleware
 */
const { body, validationResult } = require('express-validator');

const validatePredictInput = [
  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required')
    .isString().withMessage('Brand must be a string'),

  body('model')
    .trim()
    .notEmpty().withMessage('Car model is required')
    .isString().withMessage('Model must be a string'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 2000, max: 2026 }).withMessage('Year must be between 2000 and 2026'),

  body('transmission')
    .trim()
    .notEmpty().withMessage('Transmission is required')
    .isIn(['Manual', 'Automatic', 'Semi-Auto']).withMessage('Invalid transmission type'),

  body('mileage')
    .notEmpty().withMessage('Mileage is required')
    .isFloat({ min: 0 }).withMessage('Mileage must be a positive number'),

  body('fuelType')
    .trim()
    .notEmpty().withMessage('Fuel type is required')
    .isIn(['Petrol', 'Diesel', 'Hybrid', 'Electric']).withMessage('Invalid fuel type'),

  body('tax')
    .optional()
    .isFloat({ min: 0 }).withMessage('Tax must be a positive number'),

  body('mpg')
    .optional()
    .isFloat({ min: 1, max: 200 }).withMessage('MPG must be between 1 and 200'),

  body('engineSize')
    .optional()
    .isFloat({ min: 0.1, max: 7.0 }).withMessage('Engine size must be between 0.1 and 7.0'),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(e => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  },
];

module.exports = { validatePredictInput };
