import React from 'react';
import InventorySummaryCards from './InventorySummaryCards';
import InventoryValueChart from './InventoryValueChart';
import TopValuableProducts from './TopValuableProducts';
import { TrendingUp, RefreshCw } from 'lucide-react';

export default function InventoryAnalytics({ analytics, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
        <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mb-2" />
        <p className="text-slate-500 text-xs font-medium">Evaluating inventory valuations & assets...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 bg-white rounded-xl border border-slate-200 mt-6">
        <p className="text-xs text-slate-500 font-medium">No analytics data available to display.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-200 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Inventory Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Asset values, stock multipliers, and performance indicators
          </p>
        </div>

        <button 
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98] self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Update Feed</span>
        </button>
      </div>

      {/* Level 1: Summary Cards */}
      <InventorySummaryCards summary={analytics.summary} />

      {/* Level 2: Visual Grid Charts & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <InventoryValueChart trend={analytics.trend} />
        </div>
        <div>
          <TopValuableProducts products={analytics.top_products} />
        </div>
      </div>
    </div>
  );
}