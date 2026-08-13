import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight line-clamp-2"
          title={title}
        >
          {title}
        </p>

        {Icon && (
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${
              colorMap[color] || colorMap.blue
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Value & Trend */}
      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none break-all">
          {value}
        </h3>

        {trend && (
          <div className="mt-3 flex items-center">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                  : "bg-rose-50 text-rose-700 border-rose-200/60"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              {trend.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};