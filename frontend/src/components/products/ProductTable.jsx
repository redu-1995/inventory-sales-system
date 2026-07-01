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
         {products.map((product) => (
  <tr key={product.id}>
    {/* Product Name & Details */}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {product.name || product.title}
    </td>
    
    {/* SKU */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.sku || 'N/A'}
    </td>

    {/* Purchase / Cost Price */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ${product.cost_price || product.purchase_price || product.cost || 0}
    </td>

    {/* Selling Price */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ${product.selling_price || product.price || 0}
    </td>

    {/* Current Stock */}
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.stock ?? product.quantity ?? product.current_stock ?? 0}
    </td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}