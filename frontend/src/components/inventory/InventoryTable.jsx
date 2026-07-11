import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function InventoryTable({ data, onAdjustClick }) {
  const formatValue = (value) => (value ?? 0).toLocaleString();
  const getProductName = (item) => item.product_name || item.product?.name || `Product #${item.product}`;
  const getCategory = (item) => item.category_name || item.product?.category?.name || 'Uncategorized';
  const getWarehouse = (item) => item.warehouse_name || item.warehouse || 'Main Warehouse';
  const getDate = (item) => {
    const date = item.updated_at || item.last_updated;
    return date ? new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No update';
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-dashed border-slate-200">
        <p className="text-sm font-medium text-slate-500">No inventory products match these filters.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse text-xs text-slate-700">
      <thead>
        <tr className="bg-slate-50 border-y border-slate-200 text-slate-950 font-bold">
          <th className="w-10 p-3">
            <input type="checkbox" className="rounded border-slate-300" aria-label="Select all inventory rows" />
          </th>
          <th className="p-3">Product</th>
          <th className="p-3">SKU</th>
          <th className="p-3">Category</th>
          <th className="p-3 text-right">Current Quantity</th>
          <th className="p-3 text-right">Min. Stock Level</th>
          <th className="p-3 text-center">Status</th>
          <th className="p-3">Warehouse</th>
          <th className="p-3">Last Restocked</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
            <td className="p-3">
              <input type="checkbox" className="rounded border-slate-300" aria-label={`Select ${getProductName(item)}`} />
            </td>
            <td className="p-3">
              <div className="flex items-center gap-3 min-w-44">
                <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                  {getProductName(item).slice(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-slate-950">{getProductName(item)}</span>
              </div>
            </td>
            <td className="p-3 text-slate-600">{item.sku || item.product?.sku || 'N/A'}</td>
            <td className="p-3 text-slate-600">{getCategory(item)}</td>
            <td className="p-3 text-right font-semibold text-slate-950">{formatValue(item.quantity)}</td>
            <td className="p-3 text-right text-slate-600">{formatValue(item.reorder_level ?? item.minimum_stock_level)}</td>
            <td className="p-3 text-center">
              <StatusBadge quantity={item.quantity} minimumLevel={item.reorder_level ?? item.minimum_stock_level ?? 0} />
            </td>
            <td className="p-3 text-slate-600">{getWarehouse(item)}</td>
            <td className="p-3 text-slate-600 whitespace-nowrap">{getDate(item)}</td>
            <td className="p-3">
              <div className="flex justify-center gap-1">
                <button
                  type="button"
                  onClick={() => onAdjustClick(item)}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  aria-label={`Adjust ${getProductName(item)}`}
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50"
                  aria-label={`Delete ${getProductName(item)}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
