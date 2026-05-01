import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function ConfidenceInterval({ min, max, price }) {
  if (!min || !max || !price) return null;

  const range = max - min;
  const pricePosition = range > 0 ? ((price - min) / range) * 100 : 50;
  const confidence = Math.max(0, Math.min(100, 100 - (range / price) * 100));

  return (
    <div className="mt-6 animate-fade-in" id="confidence-interval">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SwapVertIcon sx={{ fontSize: 18, color: '#7986CB' }} />
          <span className="text-sm font-medium text-white/70">Confidence Range</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light/30 text-primary-50 font-medium">
          {confidence.toFixed(0)}% confidence
        </span>
      </div>

      {/* Range Bar */}
      <div className="relative py-4">
        {/* Track */}
        <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
          {/* Filled range */}
          <div
            className="absolute h-full rounded-full"
            style={{
              left: '5%',
              right: '5%',
              background: 'linear-gradient(90deg, #303F9F, #4CAF50, #303F9F)',
              opacity: 0.6,
            }}
          ></div>
          {/* Price indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-success border-2 border-white shadow-glow"
            style={{ left: `${Math.max(5, Math.min(95, pricePosition * 0.9 + 5))}%`, transform: 'translate(-50%, -50%)' }}
          ></div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3">
          <div className="text-left">
            <p className="text-xs text-white/40">Low</p>
            <p className="text-sm font-semibold text-primary-200">
              £{min.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/40">Predicted</p>
            <p className="text-sm font-bold text-success">
              £{price.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">High</p>
            <p className="text-sm font-semibold text-primary-200">
              £{max.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
