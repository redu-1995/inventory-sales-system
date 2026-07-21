import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function RecommendedRestocking({ lowStock, onReorderTrigger }) {
  const items = (lowStock || []).slice(0, 4);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-950">Recommended Restocking</h3>
        <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
          View All
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-500">
          No restocking recommendations right now.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2 font-bold">Product</th>
                <th className="pb-2 font-bold text-right">Suggested Qty</th>
                <th className="pb-2 font-bold text-right">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const minimum = item.minimum_stock_level ?? item.reorder_level ?? 0;
                const suggestedReorderAmount = Math.max((minimum * 3) - item.quantity, 25);

                return (
                  <tr key={item.id}>
                    <td className="py-2 font-semibold text-slate-950">{item.product_name || `Product #${item.product}`}</td>
                    <td className="py-2 text-right text-slate-700">{suggestedReorderAmount}</td>
                    <td className="py-2 text-right text-slate-700">3 days</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={onReorderTrigger}
        className="mt-4 w-full h-10 rounded-md bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 inline-flex items-center justify-center gap-2"
      >
        <ShoppingCart size={16} />
        Create Purchase Request
      </button>
    </div>
  );
}
