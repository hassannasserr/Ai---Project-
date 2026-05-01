/**
 * AutoValue AI – usePrediction Hook
 * Manages prediction state: loading, result, error.
 */
import { useState, useCallback } from 'react';
import { predictPrice } from '../services/api';

export function usePrediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (carData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictPrice(carData);
      if (response.success) {
        setResult(response.data);
      } else {
        throw new Error(response.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, predict, clearResult };
}
