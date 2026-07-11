import React from 'react';

export default function LowStockPanel({ lowStockProducts, onCreatePurchaseClick }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-950">Low Stock Alerts</h3>
        <button onClick={onCreatePurchaseClick} className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>
      </div>

      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
        {lowStockProducts?.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">All products are above their minimum stock levels.</p>
        ) : (
          lowStockProducts?.slice(0, 5).map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                  {(item.product_name || `P${item.product}`).slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-950 truncate">{item.product_name || `Product #${item.product}`}</p>
                  <p className="text-xs text-slate-500 truncate">{item.sku || 'No SKU'} / {item.category_name || 'Inventory'}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-orange-600">{item.quantity}</p>
                <p className="text-[11px] text-slate-500">Units Left</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
