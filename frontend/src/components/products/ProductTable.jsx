import React from 'react';
import StatusBadge from './StatusBadge';

export default function ProductTable({ 
  products, 
  selectedRowIds, 
  onToggleSelectRow, 
  onToggleSelectAll,
  onEdit = null,
  onDelete = null 
}) {
  const allSelected = products.length > 0 && products.every(p => selectedRowIds.includes(p.id));

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
          <tr>
            <th className="p-3 w-12 text-center">
              <input 
                type="checkbox" 
                checked={allSelected} 
                onChange={() => onToggleSelectAll(products.map(p => p.id))} 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
            </th>
            <th className="p-3 min-w-[130px]">Product Name</th>
            <th className="p-3 min-w-[70px]">SKU</th>
            <th className="p-3 min-w-[90px]">Category</th>
            <th className="p-3 min-w-[90px] text-right">Purchase Price</th>
            <th className="p-3 min-w-[60px] text-center">Stock</th>
            <th className="p-3 min-w-[75px] text-center">Stock Status</th>
            <th className="p-3 min-w-[80px] text-center">Updated</th>
            <th className="p-3 min-w-[100px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700 bg-white">
          {products.map((product) => {
            return (
              <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRowIds.includes(product.id)}
                    onChange={() => onToggleSelectRow(product.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3 font-medium text-gray-900 truncate text-xs">
                  {product.name || product.title}
                </td>
                <td className="p-3 text-gray-500 font-mono text-xs truncate">
                  {product.sku || 'N/A'}
                </td>
                <td className="p-3 text-gray-500 truncate text-xs">
                  {product.category_name || 'Unassigned'}
                </td>
                <td className="p-3 text-gray-500 text-right font-medium text-xs">
                  ${Number(product.cost_price || 0).toFixed(2)}
                </td>
                <td className="p-3 text-center font-medium text-gray-900 text-xs">
                  {product.quantity || product.inventory?.quantity || 0}
                </td>
                <td className="p-3 text-center">
                  <StatusBadge status={product.status} stock={product.quantity} />
                </td>
                <td className="p-3 text-center text-gray-500 text-xs">
                  {formatDate(product.updated_at || product.created_at)}
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(product.id)}
                        className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${product.name}"?`)) {
                            onDelete(product.id);
                          }
                        }}
                        className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}