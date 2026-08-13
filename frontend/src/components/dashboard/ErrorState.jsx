import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-white/80 backdrop-blur-md rounded-2xl border border-rose-100 shadow-sm my-6 relative overflow-hidden">
      {/* Background visual accent */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <AlertTriangle className="w-7 h-7 text-rose-500" />
      </div>

      {/* Message */}
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Failed to load dashboard</h3>
      <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
        {message || 'An unexpected error occurred while fetching dashboard data.'}
      </p>

      {/* Retry Action */}
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      >
        <RefreshCw className="w-4 h-4 text-slate-300" />
        <span>Try Again</span>
      </button>
    </div>
  );
};