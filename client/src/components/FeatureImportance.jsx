import { useEffect, useState } from 'react';
import InsightsIcon from '@mui/icons-material/Insights';

export default function FeatureImportance({ features }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (features && features.length > 0) {
      const timer = setTimeout(() => setAnimated(true), 200);
      return () => clearTimeout(timer);
    }
  }, [features]);

  if (!features || features.length === 0) return null;

  const maxImportance = Math.max(...features.map(f => f.importance));
  const labelMap = {
    year: '📅 Year', mileage: '🛣️ Mileage', engineSize: '⚙️ Engine Size',
    mpg: '⛽ MPG', tax: '💷 Road Tax', brand: '🏷️ Brand',
    model: '🚗 Model', transmission: '🔧 Transmission', fuelType: '⛽ Fuel Type',
  };

  return (
    <div className="mt-6 animate-fade-in" id="feature-importance">
      <div className="flex items-center gap-2 mb-4">
        <InsightsIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
        <h3 className="text-sm font-semibold text-white/80">Price Factors</h3>
      </div>
      <div className="space-y-3">
        {features.map((feature, index) => {
          const widthPct = maxImportance > 0 ? (feature.importance / maxImportance) * 100 : 0;
          const label = labelMap[feature.name] || feature.name;
          return (
            <div key={feature.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/60">{label}</span>
                <span className="text-xs text-white/40 font-mono">{(feature.importance * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="importance-bar" style={{ width: animated ? `${widthPct}%` : '0%', transitionDelay: `${index * 100}ms`, opacity: 1 - index * 0.12 }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
