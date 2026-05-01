/**
 * AutoValue AI – API Service
 * Handles all HTTP requests to the Node.js backend.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Predict car price.
 * @param {Object} carData - Car features object
 * @returns {Promise<Object>} Prediction result
 */
export async function predictPrice(carData) {
  try {
    const response = await api.post('/predict', carData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data;
      if (detail.details) {
        // Validation errors
        const messages = detail.details.map(d => `${d.field}: ${d.message}`).join(', ');
        throw new Error(messages);
      }
      throw new Error(detail.error || detail.message || 'Prediction failed');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Network error. Please check your connection.');
  }
}

/**
 * Get supported car brands.
 * @returns {Promise<string[]>} Array of brand names
 */
export async function getBrands() {
  try {
    const response = await api.get('/brands');
    return response.data.data?.brands || [];
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return [
      'Audi', 'BMW', 'Ford', 'Hyundai', 'Mercedes',
      'Skoda', 'Toyota', 'Vauxhall', 'VW',
    ];
  }
}

export default api;
