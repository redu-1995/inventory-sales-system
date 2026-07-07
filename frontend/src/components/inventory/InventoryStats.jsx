import React from 'react';

export default function InventoryStats({ summary }) {
  const cards = [
    { title: "Total Stock Units", value: summary?.total_stock_units || 0, bg: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "Low Stock Items", value: summary?.low_stock || 0, bg: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { title: "Out of Stock", value: summary?.out_of_stock || 0, bg: "bg-red-50 text-red-600", border: "border-red-100" },
    { title: "Total Valuation", value: `$${(summary?.inventory_value || 0).toLocaleString()}`, bg: "bg-green-50 text-green-600", border: "border-green-100" }
  ];
console.log("Current summary data:", summary);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className={`p-4 bg-white border ${card.border} rounded-xl shadow-sm flex justify-between items-center`}>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${card.bg} font-semibold text-lg`}>📊</div>
        </div>
      ))}
    </div>
  );
}