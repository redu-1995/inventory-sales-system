import React, { useMemo } from 'react';

export default function ProductInsights({ products }) {
  const topPerformer = useMemo(() => {
    if (!products || products.length === 0) return null;
    return [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))[0];
  }, [products]);

  const highestRevenueProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    return [...products].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0];
  }, [products]);

  return (
    <div className="w-full flex flex-col space-y-4 text-xs min-w-0 overflow-hidden">
      
      {/* 1. HEALTH BAR CARD */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-lg p-3 text-white shadow-sm border border-gray-800">
        <h3 className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Inventory Health</h3>
        <p className="text-xl font-bold mt-0.5 text-emerald-400">94.2%</p>
        <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full w-[94.2%]" />
        </div>
      </div>

      {/* 2. COMPACT INSIGHT METRICS */}
      <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm space-y-3">
        <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-1 text-xs">Quick Performance</h4>
        
        {topPerformer && (
          <div className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors min-w-0">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md font-bold text-xs flex-shrink-0">★</div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tight">Top Selling</p>
              <p className="font-semibold text-gray-900 truncate">{topPerformer.name}</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">{topPerformer.salesCount} units</p>
            </div>
          </div>
        )}

        {highestRevenueProduct && (
          <div className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-50 transition-colors min-w-0">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md font-bold text-xs flex-shrink-0">$</div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-tight">Highest Revenue</p>
              <p className="font-semibold text-gray-900 truncate">{highestRevenueProduct.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                Total: <span className="text-gray-900 font-semibold">${highestRevenueProduct.revenue?.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. CONDENSED TIMELINE CHANGELOG */}
      <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-2 border-b border-gray-50 pb-1 text-xs">Recent Changes</h4>
        <div className="flow-root">
          <ul className="-mb-4">
            {products.slice(0, 2).map((product, productIdx) => (
              <li key={product.id}>
                <div className="relative pb-3">
                  {productIdx !== 1 ? (
                    <span className="absolute top-3 left-3 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-2">
                    <span className="h-6 w-6 flex-shrink-0 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-medium">
                      {product.id}
                    </span>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[11px] text-gray-600 truncate">
                        Stock update: <span className="font-semibold text-gray-900">{product.name}</span>
                      </p>
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