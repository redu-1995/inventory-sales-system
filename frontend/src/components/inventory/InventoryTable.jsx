import React from 'react';
import StatusBadge from './StatusBadge';

export default function InventoryTable({ data, onAdjustClick }) {
  const formatValue = (value) => (value ?? 0).toLocaleString();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-400">No structured batch variants map to current filter query arrays.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse text-xs md:text-sm text-slate-600">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold tracking-wide uppercase text-[11px]">
          <th className="p-3.5">Product Parameters</th>
          <th className="p-3.5">SKU Tracking Code</th>
          <th className="p-3.5 text-right">Available Volume</th>
          <th className="p-3.5 text-right">Buffer Floor</th>
          <th className="p-3.5 text-center">Status Badge</th>
          <th className="p-3.5">Timestamp Matrix</th>
          <th className="p-3.5 text-center">Operational Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
            <td className="p-3.5">
              <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                {item.product_name || item.product?.name || `Product Key ID: ${item.product}`}
              </span>
            </td>
            <td className="p-3.5">
              <span className="font-mono text-xs text-slate-500 bg-slate-100/80 px-1.5 py-0.5 rounded">
                {item.sku || item.product?.sku || 'N/A'}
              </span>
            </td>
            <td className="p-3.5 text-right font-bold text-slate-800">
              {formatValue(item.quantity)}
            </td>
            <td className="p-3.5 text-right text-slate-400 font-medium">
              {formatValue(item.reorder_level ?? item.minimum_stock_level)}
            </td>
            <td className="p-3.5 text-center">
              <StatusBadge quantity={item.quantity} minimumLevel={item.reorder_level ?? item.minimum_stock_level ?? 0} />
            </td>
            <td className="p-3.5 text-slate-400 text-xs">
              {item.updated_at || item.last_updated ? new Date(item.updated_at || item.last_updated).toLocaleString() : 'No timestamp logged'}
            </td>
            <td className="p-3.5 text-center">
              <button
                type="button"
                onClick={() => onAdjustClick(item)}
                className="text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg transition-all shadow-sm"
              >
                Reconcile Parameters
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}