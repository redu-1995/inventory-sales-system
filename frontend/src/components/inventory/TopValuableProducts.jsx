import React from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function TopValuableProducts({ products = [] }) {
  if (!products || products.length === 0) return null;

  // Calculate highest single valuation to compute visual percentage bars
  const maxValuation = Math.max(
    ...products.map((p) => Number(p.value ?? p.total_value ?? 0)),
    1
  );

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[380px] h-full w-full">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            Highest Worth Holdings
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Top inventory items ranked by total capital investment
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          Top {products.length}
        </span>
      </div>

      {/* Product List / Table View */}
      <div className="flex-1 flex flex-col justify-around divide-y divide-slate-100">
        {products.map((prod, index) => {
          const holdingValue = Number(prod.value ?? prod.total_value ?? 0);
          const quantity = prod.quantity ?? prod.stock_quantity ?? prod.current_stock ?? null;
          const unitPrice = prod.cost_price ?? prod.unit_price ?? prod.price ?? null;
          const percentageOfTop = Math.min(Math.round((holdingValue / maxValuation) * 100), 100);

          return (
            <div
              key={prod.id || prod.sku || index}
              className="py-3 sm:py-3.5 first:pt-0 last:pb-0 group hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Product Info */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 shrink-0 transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-800 truncate" title={prod.name}>
                      {prod.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>SKU: {prod.sku || 'N/A'}</span>
                      {quantity !== null && (
                        <>
                          <span>•</span>
                          <span>{Number(quantity).toLocaleString()} in stock</span>
                        </>
                      )}
                      {unitPrice !== null && (
                        <>
                          <span>•</span>
                          <span>@ {formatCurrency(unitPrice)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Holding Valuation */}
                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(holdingValue)}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {percentageOfTop}% of top asset
                  </p>
                </div>
              </div>

              {/* Proportional Holding Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentageOfTop}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}