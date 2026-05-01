import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { getBrands } from '../services/api';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-Auto'];

const CAR_MODELS = {
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5', 'Q7'],
  BMW: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', 'X1', 'X3', 'X5'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Puma', 'EcoSport', 'Mondeo', 'Galaxy'],
  Hyundai: ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Santa Fe', 'Ioniq'],
  Mercedes: ['A Class', 'B Class', 'C Class', 'E Class', 'GLA Class', 'GLC Class'],
  Skoda: ['Citigo', 'Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
  Toyota: ['Aygo', 'Yaris', 'Corolla', 'C-HR', 'RAV4', 'Land Cruiser', 'Prius'],
  Vauxhall: ['Corsa', 'Astra', 'Mokka', 'Crossland X', 'Grandland X', 'Insignia'],
  VW: ['Polo', 'Golf', 'T-Cross', 'T-Roc', 'Tiguan', 'Passat', 'Touareg'],
};

const INITIAL_FORM = {
  brand: '',
  model: '',
  year: '',
  transmission: '',
  mileage: '',
  fuelType: '',
  tax: '150',
  mpg: '50',
  engineSize: '1.5',
};

export default function PredictionForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [brands, setBrands] = useState(Object.keys(CAR_MODELS));
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    getBrands().then(b => {
      if (b.length > 0) setBrands(b);
    });
  }, []);

  const availableModels = form.brand ? (CAR_MODELS[form.brand] || []) : [];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Reset car model when brand changes
      if (name === 'brand') updated.model = '';
      return updated;
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.brand) errs.brand = 'Select a brand';
    if (!form.model) errs.model = 'Select a model';
    if (!form.year || form.year < 2000 || form.year > 2026) errs.year = 'Year must be 2000–2026';
    if (!form.transmission) errs.transmission = 'Select transmission';
    if (!form.mileage || form.mileage < 0) errs.mileage = 'Enter valid mileage';
    if (!form.fuelType) errs.fuelType = 'Select fuel type';
    if (form.engineSize && (form.engineSize <= 0 || form.engineSize > 7)) errs.engineSize = 'Engine size: 0.1–7.0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      year: parseInt(form.year),
      mileage: parseFloat(form.mileage),
      tax: parseFloat(form.tax) || 150,
      mpg: parseFloat(form.mpg) || 50,
      engineSize: parseFloat(form.engineSize) || 1.5,
    });
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 lg:p-8 animate-fade-in" id="prediction-form">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <SearchIcon sx={{ fontSize: 22, color: '#4CAF50' }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Car Details</h2>
          <p className="text-xs text-white/40">Enter your car information for pricing</p>
        </div>
      </div>

      {/* Main Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Brand *</label>
          <select
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className={`glass-select ${errors.brand ? 'border-red-400/60' : ''}`}
            id="input-brand"
          >
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.brand && <p className="text-red-400 text-xs mt-1">{errors.brand}</p>}
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Model *</label>
          <select
            name="model"
            value={form.model}
            onChange={handleChange}
            className={`glass-select ${errors.model ? 'border-red-400/60' : ''}`}
            disabled={!form.brand}
            id="input-model"
          >
            <option value="">Select Model</option>
            {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Year *</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="e.g. 2020"
            min="2000"
            max="2026"
            className={`glass-input ${errors.year ? 'border-red-400/60' : ''}`}
            id="input-year"
          />
          {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Transmission *</label>
          <select
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            className={`glass-select ${errors.transmission ? 'border-red-400/60' : ''}`}
            id="input-transmission"
          >
            <option value="">Select Type</option>
            {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.transmission && <p className="text-red-400 text-xs mt-1">{errors.transmission}</p>}
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Mileage (miles) *</label>
          <input
            type="number"
            name="mileage"
            value={form.mileage}
            onChange={handleChange}
            placeholder="e.g. 25000"
            min="0"
            className={`glass-input ${errors.mileage ? 'border-red-400/60' : ''}`}
            id="input-mileage"
          />
          {errors.mileage && <p className="text-red-400 text-xs mt-1">{errors.mileage}</p>}
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-1.5">Fuel Type *</label>
          <select
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            className={`glass-select ${errors.fuelType ? 'border-red-400/60' : ''}`}
            id="input-fuel-type"
          >
            <option value="">Select Fuel</option>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {errors.fuelType && <p className="text-red-400 text-xs mt-1">{errors.fuelType}</p>}
        </div>
      </div>

      {/* Advanced Fields Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors mb-4"
      >
        <TuneIcon sx={{ fontSize: 16 }} />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {/* Advanced Fields */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Road Tax (£)</label>
            <input
              type="number"
              name="tax"
              value={form.tax}
              onChange={handleChange}
              placeholder="150"
              className="glass-input"
              id="input-tax"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">MPG</label>
            <input
              type="number"
              name="mpg"
              value={form.mpg}
              onChange={handleChange}
              placeholder="50"
              step="0.1"
              className="glass-input"
              id="input-mpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">Engine Size (L)</label>
            <input
              type="number"
              name="engineSize"
              value={form.engineSize}
              onChange={handleChange}
              placeholder="1.5"
              step="0.1"
              className={`glass-input ${errors.engineSize ? 'border-red-400/60' : ''}`}
              id="input-engine-size"
            />
            {errors.engineSize && <p className="text-red-400 text-xs mt-1">{errors.engineSize}</p>}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          id="btn-predict"
        >
          {loading ? (
            <>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white loader-dot"></div>
                <div className="w-2 h-2 rounded-full bg-white loader-dot"></div>
                <div className="w-2 h-2 rounded-full bg-white loader-dot"></div>
              </div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <SearchIcon sx={{ fontSize: 20 }} />
              <span>Predict Price</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          title="Reset form"
          id="btn-reset"
        >
          <RestartAltIcon sx={{ fontSize: 20 }} />
        </button>
      </div>
    </form>
  );
}
