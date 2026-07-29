import React, { useState } from 'react';
import { Edit3, Trash2, RotateCcw } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function InventoryTable({ data, onAdjustClick, onDeleteClick }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const formatValue = (value) => (value ?? 0).toLocaleString();
  const getProductName = (item) => item.product_name || item.product?.name || `Product #${item.product}`;
  const getCategory = (item) => item.category_name || item.product?.category?.name || 'Uncategorized';
  const getDate = (item) => {
    const date = item.updated_at || item.last_updated;
    return date ? new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No update';
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked && data) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleResetSelection = () => {
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    if (onDeleteClick) {
      onDeleteClick(selectedIds);
    }
    setSelectedIds([]);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-dashed border-slate-200">
        <p className="text-sm font-medium text-slate-500">No inventory products match these filters.</p>
      </div>
    );
  }

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0;

  return (
    <div className="w-full space-y-2">
      {/* Dynamic Action Bar (Appears when items are selected) */}
      {isSomeSelected && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 text-white rounded-lg shadow-sm text-xs transition-all">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>{selectedIds.length} {selectedIds.length === 1 ? 'product' : 'products'} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSelection}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw size={13} />
              Reset Selection
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded transition-colors"
            >
              <Trash2 size={13} />
              Delete Product{selectedIds.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
        <table className="w-full text-left border-collapse text-xs text-slate-700">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
              <th className="w-10 p-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  aria-label="Select all inventory rows"
                />
              </th>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Current Quantity</th>
              <th className="p-3 text-right">Min. Stock Level</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3">Last Restocked</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(item.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      aria-label={`Select ${getProductName(item)}`}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3 min-w-44">
                      <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                        {getProductName(item).slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">{getProductName(item)}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-600 font-mono">{item.sku || item.product?.sku || 'N/A'}</td>
                  <td className="p-3 text-slate-600">{getCategory(item)}</td>
                  <td className="p-3 text-right font-semibold text-slate-900">{formatValue(item.quantity)}</td>
                  <td className="p-3 text-right text-slate-600">{formatValue(item.reorder_level ?? item.minimum_stock_level)}</td>
                  <td className="p-3 text-center">
                    <StatusBadge quantity={item.quantity} minimumLevel={item.reorder_level ?? item.minimum_stock_level ?? 0} />
                  </td>
                  <td className="p-3 text-slate-600 whitespace-nowrap">{getDate(item)}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onAdjustClick(item)}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        aria-label={`Adjust ${getProductName(item)}`}
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}