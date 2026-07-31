import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm my-6">
      <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-slate-900">Failed to load dashboard</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );
};