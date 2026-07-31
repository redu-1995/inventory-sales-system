import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

export const SalesChart = ({ salesChart }) => {
  const labels = salesChart?.labels || [];
  const values = salesChart?.values || [];
  const maxValue = Math.max(...values, 100);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Sales Overview</h2>
          <p className="text-xs text-slate-500">Sales trend over the last 7 days</p>
        </div>
      </div>

      {/* CSS-based Bar Chart Representation */}
      <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 border-b border-slate-200 pb-2">
        {labels.map((label, index) => {
          const val = values[index] || 0;
          const heightPercent = Math.round((val / maxValue) * 100);

          return (
            <div key={label + index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium bg-slate-800 text-white px-1.5 py-0.5 rounded shadow">
                {formatCurrency(val)}
              </span>
              <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                <div
                  className="w-full bg-blue-600 group-hover:bg-blue-700 transition-all rounded-t-md"
                  style={{ height: `${Math.max(heightPercent, 4)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 mt-1">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};