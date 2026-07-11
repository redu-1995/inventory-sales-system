import React from 'react';

export default function InventoryValueCard({ totalValuation }) {
  const value = totalValuation || 0;
  const previous = Math.round(value * 0.984);
  const difference = value - previous;
  const points = [18, 24, 20, 32, 27, 36, 33, 38, 35, 42, 39, 45, 41, 49, 44, 52];
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${index * 20 + 8} ${70 - point}`).join(' ');

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-950">Inventory Value Analytics</h3>
        <select className="h-8 px-3 border border-slate-200 rounded-md text-xs font-medium bg-white text-slate-700" defaultValue="month">
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-md border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs text-slate-500">This Month</p>
          <p className="text-xl font-black text-slate-950">${value.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">^ 1.7% vs last month</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs text-slate-500">Last Month</p>
          <p className="text-xl font-black text-slate-950">${previous.toLocaleString()}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs text-slate-500">Difference</p>
          <p className="text-xl font-black text-emerald-600">+${difference.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-36 rounded-md bg-gradient-to-b from-blue-50 to-white border border-slate-100 p-3">
        <svg viewBox="0 0 318 96" className="w-full h-full" role="img" aria-label="Inventory value trend">
          <path d="M8 78 H310" stroke="#e2e8f0" />
          <path d="M8 48 H310" stroke="#e2e8f0" />
          <path d="M8 18 H310" stroke="#e2e8f0" />
          <path d={path} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point, index) => (
            <circle key={index} cx={index * 20 + 8} cy={70 - point} r="3" fill="#fff" stroke="#2563eb" strokeWidth="2" />
          ))}
        </svg>
      </div>
    </div>
  );
}
