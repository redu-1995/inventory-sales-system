import React from 'react';

export default function Badge({ 
  children, 
  variant = 'primary', 
  className = '' 
}) {
  const variants = {
    primary: 'bg-blue-50 text-brand-primary border-blue-200',
    success: 'bg-emerald-50 text-brand-success border-emerald-200',
    warning: 'bg-amber-50 text-brand-warning border-amber-200',
    danger: 'bg-red-50 text-brand-danger border-red-200',
    secondary: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}