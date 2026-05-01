import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import PriceResult from './components/PriceResult';
import ConfidenceInterval from './components/ConfidenceInterval';
import FeatureImportance from './components/FeatureImportance';
import SimilarCars from './components/SimilarCars';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import { usePrediction } from './hooks/usePrediction';
import TimelineIcon from '@mui/icons-material/Timeline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function App() {
  const { result, loading, error, predict, clearResult } = usePrediction();

  return (
    <div className="min-h-screen relative">
      {/* Background particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <Navbar />

        {/* Hero Text */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
            Used Car <span className="text-success">Price Prediction</span>
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto">
            Get instant AI-powered price estimates with confidence intervals.
            Powered by machine learning trained on thousands of real car listings.
          </p>
        </div>

        {/* Main Layout: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column: Form (3/5) */}
          <div className="lg:col-span-3">
            <PredictionForm onSubmit={predict} loading={loading} />
          </div>

          {/* Right Column: Results (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Results Card */}
            <div className="glass-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <TimelineIcon sx={{ fontSize: 22, color: '#7986CB' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Valuation</h2>
                  <p className="text-xs text-white/40">AI-powered estimate</p>
                </div>
              </div>

              {/* Error */}
              {error && <ErrorAlert message={error} onDismiss={clearResult} />}

              {/* Loading */}
              {loading && <LoadingSpinner />}

              {/* Empty State */}
              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <DirectionsCarIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <p className="text-white/30 text-sm">Fill in the car details and click</p>
                  <p className="text-white/30 text-sm font-semibold">"Predict Price"</p>
                </div>
              )}

              {/* Results */}
              {result && !loading && (
                <>
                  <PriceResult price={result.price} currency={result.currency} />
                  <ConfidenceInterval min={result.confidence_min} max={result.confidence_max} price={result.price} />
                  <FeatureImportance features={result.feature_importance} />
                </>
              )}
            </div>

            {/* Similar Cars Card */}
            {result && !loading && result.similar_cars && result.similar_cars.length > 0 && (
              <div className="glass-card p-6">
                <SimilarCars cars={result.similar_cars} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-6">
          <p className="text-white/20 text-xs">
            AutoValue AI © 2026 · ML-Powered Price Predictions · Built with React + FastAPI + RandomForest
          </p>
        </footer>
      </div>
    </div>
  );
}
