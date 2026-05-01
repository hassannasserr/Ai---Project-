/**
 * AutoValue AI – ML Service Client
 * Handles communication with the Python FastAPI microservice.
 */
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Send car data to the Python ML service for prediction.
 */
async function predictPrice(carData) {
  try {
    const response = await mlClient.post('/predict', carData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'ML Service error');
    }
    throw new Error('ML Service unavailable. Ensure the Python service is running on port 8000.');
  }
}

/**
 * Get list of supported car brands.
 */
async function getBrands() {
  try {
    const response = await mlClient.get('/brands');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch brands from ML service');
  }
}

/**
 * Get global feature importance data.
 */
async function getFeatureImportance() {
  try {
    const response = await mlClient.get('/feature-importance');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch feature importance from ML service');
  }
}

module.exports = { predictPrice, getBrands, getFeatureImportance };
