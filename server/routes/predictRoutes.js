/**
 * AutoValue AI – Prediction Routes
 */
const express = require('express');
const router = express.Router();
const { predictPrice, getBrands, getFeatureImportance } = require('../controllers/predictController');
const { validatePredictInput } = require('../middleware/validateInput');

// POST /api/predict – Get car price prediction
router.post('/predict', validatePredictInput, predictPrice);

// GET /api/brands – List supported car brands
router.get('/brands', getBrands);

// GET /api/feature-importance – Global feature importance
router.get('/feature-importance', getFeatureImportance);

module.exports = router;
