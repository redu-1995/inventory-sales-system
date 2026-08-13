import React from 'react';
import { RefreshCw, Calendar, Sparkles } from 'lucide-react';

export const DashboardHeader = ({ onRefresh, loading }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good Morning, Admin
          </h1>
          <span className="inline-block animate-bounce text-2xl">👋</span>
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-600">{today}</span>
          <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live System
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/90 text-slate-700 text-sm font-semibold rounded-xl shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 transition-transform ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>{loading ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>
    </div>
  );
};