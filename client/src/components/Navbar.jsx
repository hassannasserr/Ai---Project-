import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export default function Navbar() {
  return (
    <nav className="glass-card-static px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-success to-success-light flex items-center justify-center shadow-glow">
            <DirectionsCarIcon sx={{ fontSize: 26, color: 'white' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Auto<span className="text-success">Value</span> AI
            </h1>
            <p className="text-xs text-white/40 font-medium tracking-wider uppercase">
              Smart Car Pricing
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <AutoGraphIcon sx={{ fontSize: 18 }} />
            <span>ML-Powered Predictions</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs text-white/40">Model Active</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
