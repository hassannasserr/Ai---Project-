import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function SimilarCars({ cars }) {
  if (!cars || cars.length === 0) return null;

  return (
    <div className="mt-6 animate-fade-in" id="similar-cars">
      <div className="flex items-center gap-2 mb-4">
        <CompareArrowsIcon sx={{ fontSize: 20, color: '#7986CB' }} />
        <h3 className="text-sm font-semibold text-white/80">Similar Cars</h3>
      </div>
      <div className="space-y-2">
        {cars.map((car, i) => {
          const isHigher = car.difference > 0;
          return (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
              <div>
                <p className="text-sm font-medium text-white/80">{car.brand} {car.model}</p>
                <p className="text-xs text-white/40">{car.year} · {car.mileage.toLocaleString()} mi</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white/90">£{car.price.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</p>
                <div className={`flex items-center gap-0.5 justify-end ${isHigher ? 'text-red-400' : 'text-success'}`}>
                  {isHigher ? <ArrowUpwardIcon sx={{ fontSize: 12 }} /> : <ArrowDownwardIcon sx={{ fontSize: 12 }} />}
                  <span className="text-xs font-medium">£{Math.abs(car.difference).toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
