// src/components/reports/SalesChart.jsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function SalesChart({ salesChart }) {
  const chartData = salesChart.labels.map((label, index) => ({
    name: label,
    revenue: Number(salesChart.values[index] || 0),
  }));

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
        <p className="text-xs text-gray-500">Daily sales breakdown over recent timeline</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="name" tickLine={false} stroke="#9CA3AF" fontSize={12} />
            <YAxis tickLine={false} stroke="#9CA3AF" fontSize={12} tickFormatter={(val) => `ETB ${val}`} />
            <Tooltip
              formatter={(value) => [`ETB ${Number(value).toLocaleString()}`, "Revenue"]}
              contentStyle={{ backgroundColor: "#1E293B", color: "#FFF", borderRadius: "8px", border: "none" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}