import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function LowStockAlerts({ lowStockList = [], loading, error, onRefresh }) {
  if (loading) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-100 rounded"></div>
          <div className="h-8 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex justify-between items-center">
        <span>Failed to load stock alerts.</span>
        <button onClick={onRefresh} className="text-xs underline font-semibold">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Low Stock Alerts</h3>
            <p className="text-xs text-gray-500">{lowStockList.length} items need attention</p>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Alert List */}
      <div className="p-4 divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
        {lowStockList.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            All products are sufficiently stocked!
          </div>
        ) : (
          lowStockList.map((item, index) => {
            // Safe property checks depending on whether backend serializer 
            // returned flat 'product_name' or nested 'product.name'
            const productName = item.product_name || item.product?.name || 'Unknown Product';
            const sku = item.sku || item.product?.sku || 'N/A';
            const quantity = item.current_quantity ?? item.quantity ?? 0;
            const isOutOfStock = quantity === 0;

            return (
              <div key={item.id || index} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{productName}</p>
                  <p className="text-xs text-gray-400 truncate">SKU: {sku}</p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    isOutOfStock 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {isOutOfStock ? 'Out of Stock' : `${quantity} remaining`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    
    </div>
  );
}