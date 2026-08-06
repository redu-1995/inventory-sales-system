import React from "react";

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all min-h-[120px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-sm font-medium text-slate-500 leading-5 break-words flex-1"
          title={title}
        >
          {title}
        </p>

        {Icon && (
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-lg shrink-0 ${
              colorMap[color] || colorMap.blue
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <h3
          className="
            text-xl
            sm:text-2xl
            lg:text-3xl
            font-bold
            text-slate-900
            leading-tight
            break-all
          "
        >
          {value}
        </h3>

        {trend && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                trend.isPositive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {trend.isPositive ? "▲" : "▼"} {trend.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};