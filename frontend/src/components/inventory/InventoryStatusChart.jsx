import React from 'react';

export default function InventoryStatusChart({ summary }) {
  const total = summary?.total_stock_units || 0;
  const lowStock = summary?.low_stock || 0;
  const outOfStock = summary?.out_of_stock || 0;
  const reserved = Math.round(total * 0.08);
  const inStock = Math.max(total - lowStock - outOfStock - reserved, 0);

  const rows = [
    { label: 'In Stock', value: inStock, color: 'bg-emerald-500' },
    { label: 'Low Stock', value: lowStock, color: 'bg-amber-500' },
    { label: 'Out of Stock', value: outOfStock, color: 'bg-red-500' },
    { label: 'Reserved', value: reserved, color: 'bg-blue-600' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-950 mb-6">Inventory Overview</h3>

      <div className="space-y-7">
        {rows.map((row) => {
          const pct = total ? Math.round((row.value / total) * 100) : 0;

          return (
            <div key={row.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <span className={`w-2 h-2 rounded-full ${row.color}`} />
                  {row.label}
                </span>
                <span className="text-slate-600">{row.value.toLocaleString()} ({pct}%)</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">Total Products</span>
        <span className="text-lg font-black text-slate-950">{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
