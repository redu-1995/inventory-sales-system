import React, { useMemo } from 'react';

export default function ProductInsights({ products }) {
  // Compute Top Performer metrics based on total sales dynamically from our sample products
  const topPerformer = useMemo(() => {
    if (!products || products.length === 0) return null;
    return [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))[0];
  }, [products]);

  // Compute the highest revenue generating product parameters
  const highestRevenueProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    return [...products].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0];
  }, [products]);

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
      
      {/* ================= PANEL HEADER ================= */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-xl p-5 text-white shadow-sm border border-gray-800">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400">Inventory Health</h3>
        <p className="text-2xl font-bold mt-1 text-emerald-400">94.2%</p>
        <p className="text-xs text-slate-400 mt-1">Operational target clear this week</p>
        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full w-[94.2%]" />
        </div>
      </div>

      {/* ================= ANALYTICS METRIC CARDS ================= */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Quick Performance Insights</h4>
        
        {/* Card 1: Top Seller */}
        {topPerformer && (
          <div className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-gray-50/80 transition-colors">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold">★</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-tight">Top Selling Item</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{topPerformer.name}</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">{topPerformer.salesCount} units moved</p>
            </div>
          </div>
        )}

        {/* Card 2: Highest Revenue */}
        {highestRevenueProduct && (
          <div className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-gray-50/80 transition-colors">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">$</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-tight">Highest Revenue</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{highestRevenueProduct.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Generated <span className="text-gray-900 font-semibold">${highestRevenueProduct.revenue?.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ================= SYSTEM ACTIVITY LOG ================= */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">Recent Changes</h4>
        <div className="flow-root">
          <ul className="-mb-8">
            {products.slice(0, 3).map((product, productIdx) => (
              <li key={product.id}>
                <div className="relative pb-6">
                  {productIdx !== 2 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                        {product.id}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5">
                      <p className="text-xs text-gray-600">
                        Stock updated for <span className="font-semibold text-gray-900">{product.name}</span>
                      </p>
                      <div className="text-right text-[10px] whitespace-nowrap text-gray-400 mt-0.5">
                        {product.updatedAt || 'Just now'}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}