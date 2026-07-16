import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InventoryValueChart({ trend }) {
  if (!trend || trend.length === 0) return null;

  // Formatting utility for Y-axis currency displays
  const formatYAxis = (value) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[380px] flex flex-col">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-slate-900">Asset Valuation Performance</h4>
        <p className="text-xs text-slate-500">Rolling total inventory cost valuation over the last 7 days</p>
      </div>
      <div className="flex-1 w-full h-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="date" 
              stroke="#94A3B8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94A3B8" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={formatYAxis}
              dx={-5}
            />
            <Tooltip 
              contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}
              labelClassName="font-semibold text-slate-900 text-xs"
              formatter={(value) => [`$${value.toLocaleString()}`, 'Inventory Value']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2563EB" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorVal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}