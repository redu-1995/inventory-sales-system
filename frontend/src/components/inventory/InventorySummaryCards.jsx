import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, Percent } from 'lucide-react';

export default function InventorySummaryCards({ summary }) {
  if (!summary) return null;

  const isGrowthPositive = summary.growth_percentage >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Current Inventory Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Current Inventory Value</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              ${summary.current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Previous Period Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Previous Period Value</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              ${summary.previous_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* growth Indicator Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Period Valuation Shift</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-bold text-slate-900">
                {summary.difference >= 0 ? '+' : ''}
                {summary.difference.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-sm font-semibold px-2 py-0.5 rounded-full ${
                isGrowthPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {isGrowthPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {Math.abs(summary.growth_percentage)}%
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${isGrowthPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <Percent className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}