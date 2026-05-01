import { useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

export default function ErrorAlert({ message, onDismiss }) {
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  function handleClose() {
    setVisible(false);
    if (onDismiss) onDismiss();
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-400/20 animate-fade-in" id="error-alert">
      <ErrorOutlineIcon sx={{ fontSize: 20, color: '#ef5350', flexShrink: 0, marginTop: '2px' }} />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-300">Prediction Error</p>
        <p className="text-xs text-red-300/70 mt-0.5">{message}</p>
      </div>
      <button onClick={handleClose} className="text-red-300/50 hover:text-red-300 transition-colors">
        <CloseIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
}
