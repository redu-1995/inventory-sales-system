import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 shadow-xs p-6 hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}