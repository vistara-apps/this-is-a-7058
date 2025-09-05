import React from 'react';

export default function InputWithUnits({ 
  value, 
  onChange, 
  unit, 
  placeholder, 
  type = 'text',
  className = '',
  disabled = false,
  required = false,
  min,
  max,
  step
}) {
  return (
    <div className={`relative ${className}`}>
      {unit && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
          {unit}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        className={`w-full ${unit ? 'pl-8' : 'pl-3'} pr-3 py-2 bg-bg border border-surface rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </div>
  );
}
