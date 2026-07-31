import React from 'react';

export const InventoryOverview = ({ summary }) => {
  const { in_stock = 0, low_stock = 0, out_of_stock = 0 } = summary || {};

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Inventory Breakdown</h2>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
          <span className="block text-2xl font-bold text-emerald-700">{in_stock}</span>
          <span className="text-xs font-medium text-emerald-800">In Stock</span>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <span className="block text-2xl font-bold text-amber-700">{low_stock}</span>
          <span className="text-xs font-medium text-amber-800">Low Stock</span>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
          <span className="block text-2xl font-bold text-rose-700">{out_of_stock}</span>
          <span className="text-xs font-medium text-rose-800">Out of Stock</span>
        </div>
      </div>
    </div>
  );
};