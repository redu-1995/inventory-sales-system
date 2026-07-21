import React from 'react';
import InventorySummaryCards from './InventorySummaryCards';
import InventoryValueChart from './InventoryValueChart';
import TopValuableProducts from './TopValuableProducts';
import { TrendingUp, RefreshCw } from 'lucide-react';

export default function InventoryAnalytics({ analytics, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-slate-100 shadow-sm mt-8">
        <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-3" />
        <p className="text-slate-500 text-sm">Evaluating inventory valuations & assets...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 mt-8">
        <p className="text-slate-500">No analytics data available to display.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Inventory Performance Analytics
          </h2>
          <p className="text-sm text-slate-500">Asset values, stock multipliers, and performance indicators</p>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Update Feed
        </button>
      </div>

      {/* Level 1: Summary Cards */}
      <InventorySummaryCards summary={analytics.summary} />

      {/* Level 2: Visual Grid charts & listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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