import { useEffect, useState } from 'react';
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function PriceResult({ price, currency = 'GBP' }) {
  const [displayPrice, setDisplayPrice] = useState(0);

  // Animated counter effect
  useEffect(() => {
    if (!price) return;
    
    const duration = 1500; // ms
    const steps = 60;
    const increment = price / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(price, increment * step);
      setDisplayPrice(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayPrice(price);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [price]);

  const currencySymbol = currency === 'GBP' ? '£' : '$';

  return (
    <div className="text-center py-6 animate-slide-up">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-4">
        <PaidIcon sx={{ fontSize: 36, color: '#4CAF50' }} />
      </div>

      {/* Label */}
      <p className="text-sm text-white/50 font-medium uppercase tracking-widest mb-2">
        Estimated Value
      </p>

      {/* Price */}
      <div className="price-display mb-3" id="estimated-price">
        {currencySymbol}{displayPrice.toLocaleString('en-GB', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
        <TrendingUpIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
        <span className="text-xs text-success font-medium">AI Prediction</span>
      </div>
    </div>
  );
}
