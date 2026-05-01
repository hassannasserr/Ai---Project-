import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in" id="loading-spinner">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center animate-pulse-slow">
          <DirectionsCarIcon sx={{ fontSize: 40, color: '#4CAF50', opacity: 0.7 }} />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-success/20 animate-ping" style={{ animationDuration: '2s' }}></div>
      </div>
      <p className="text-white/50 text-sm font-medium">Analyzing car data...</p>
      <div className="flex gap-1.5 mt-3">
        <div className="w-2 h-2 rounded-full bg-success loader-dot"></div>
        <div className="w-2 h-2 rounded-full bg-success loader-dot"></div>
        <div className="w-2 h-2 rounded-full bg-success loader-dot"></div>
      </div>
    </div>
  );
}
