import React from 'react';

export const InventoryOverview = ({ summary }) => {
  const { in_stock = 0, low_stock = 0, out_of_stock = 0 } = summary || {};

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Inventory Breakdown</h2>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Overview</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {/* In Stock */}
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-100/80 rounded-xl transition-all hover:bg-emerald-50">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">In Stock</span>
          </div>
          <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">{in_stock}</span>
        </div>

        {/* Low Stock */}
        <div className="p-3.5 bg-amber-50/60 border border-amber-100/80 rounded-xl transition-all hover:bg-amber-50">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Low Stock</span>
          </div>
          <span className="block text-2xl sm:text-3xl font-extrabold text-amber-700 tracking-tight">{low_stock}</span>
        </div>

        {/* Out of Stock */}
        <div className="p-3.5 bg-rose-50/60 border border-rose-100/80 rounded-xl transition-all hover:bg-rose-50">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Out of Stock</span>
          </div>
          <span className="block text-2xl sm:text-3xl font-extrabold text-rose-700 tracking-tight">{out_of_stock}</span>
        </div>
      </div>
    </div>
  );
};