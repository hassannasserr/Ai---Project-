/**
 * AutoValue AI – Predict Controller (MVC)
 */
const mlService = require('../services/mlService');

/**
 * POST /api/predict
 * Receives car data, validates it, calls ML service, returns prediction.
 */
async function predictPrice(req, res) {
  try {
    const carData = {
      brand: req.body.brand,
      model: req.body.model,
      year: parseInt(req.body.year),
      transmission: req.body.transmission,
      mileage: parseFloat(req.body.mileage),
      fuelType: req.body.fuelType,
      tax: parseFloat(req.body.tax) || 150,
      mpg: parseFloat(req.body.mpg) || 50,
      engineSize: parseFloat(req.body.engineSize) || 1.5,
    };

    console.log('📨 Prediction request:', carData);

    const prediction = await mlService.predictPrice(carData);

    console.log('✅ Prediction result:', prediction.price);

    return res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error('❌ Prediction error:', error.message);
    return res.status(502).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * GET /api/brands
 * Returns list of supported car brands.
 */
async function getBrands(req, res) {
  try {
    const brands = await mlService.getBrands();
    return res.json({ success: true, data: brands });
  } catch (error) {
    return res.status(502).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/feature-importance
 * Returns global feature importance from model training.
 */
async function getFeatureImportance(req, res) {
  try {
    const data = await mlService.getFeatureImportance();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(502).json({ success: false, error: error.message });
  }
}

module.exports = { predictPrice, getBrands, getFeatureImportance };
