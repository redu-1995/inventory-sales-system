import React from 'react';
import StatusBadge from './StatusBadge';
export default function ProductTable({ products, selectedRowIds, onToggleSelectRow, onToggleSelectAll }) {
  const allSelected = products.length > 0 && products.every(p => selectedRowIds.includes(p.id));
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
          <tr>
            <th className="p-4 w-4">
              <input type="checkbox" checked={allSelected} onChange={() => onToggleSelectAll(products.map(p => p.id))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </th>
            <th className="p-4">Product</th>
            <th className="p-4">SKU</th>
            <th className="p-4">Category</th>
            <th className="p-4 text-right">Cost</th>
            <th className="p-4 text-right">Selling Price</th>
            <th className="p-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700">
          {products.length === 0 ? (
            <tr><td colSpan="7" className="p-8 text-center text-gray-400">No products match your criteria.</td></tr>
          ) : products.map(product => (
            <tr key={product.id} className={`hover:bg-gray-50/70 transition-colors ${selectedRowIds.includes(product.id) ? 'bg-blue-50/40' : ''}`}>
              <td className="p-4">
                <input type="checkbox" checked={selectedRowIds.includes(product.id)} onChange={() => onToggleSelectRow(product.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td className="p-4 font-medium text-gray-900">{product.name}</td>
              <td className="p-4 text-gray-500 font-mono text-xs">{product.sku}</td>
              <td className="p-4 text-gray-500">{product.category}</td>
              <td className="p-4 text-right text-gray-500">${product.cost_price.toFixed(2)}</td>
              <td className="p-4 text-right font-medium text-gray-900">${product.selling_price.toFixed(2)}</td>
              <td className="p-4 text-center"><StatusBadge active={product.status} stock={product.stock} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}