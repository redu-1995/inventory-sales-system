import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingUp } from 'lucide-react';

export const SalesChart = ({ salesChart }) => {
  const labels = salesChart?.labels || [];
  const values = salesChart?.values || [];
  const maxValue = Math.max(...values, 100);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Sales Overview</h2>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">7-day rolling revenue trend</p>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-6">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
          <div className="border-b border-dashed border-slate-100 w-full" />
          <div className="border-b border-dashed border-slate-100 w-full" />
          <div className="border-b border-dashed border-slate-100 w-full" />
        </div>

        {/* Bars Container */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-2 relative z-10">
          {labels.map((label, index) => {
            const val = values[index] || 0;
            const heightPercent = Math.round((val / maxValue) * 100);

            return (
              <div key={label + index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Floating Tooltip Pill */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-1 text-[11px] font-bold bg-slate-900 text-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap pointer-events-none">
                  {formatCurrency(val)}
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100/80 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-blue-500 group-hover:from-indigo-500 group-hover:to-blue-400 transition-all duration-300 rounded-t-md shadow-xs"
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  />
                </div>

                {/* X-Axis Label */}
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors mt-1">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};