import React from 'react';

export default function Input({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}) {
  return (
    <div className="w-full text-left mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-150
          ${error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger' : 'border-slate-200'} 
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-brand-danger font-medium">
          {error}
        </p>
      )}
    </div>
  );
}