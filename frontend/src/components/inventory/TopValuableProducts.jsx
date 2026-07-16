import React from 'react';
import { Package } from 'lucide-react';

export default function TopValuableProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px]">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-slate-900">Highest Worth Holdings</h4>
        <p className="text-xs text-slate-500">Top 5 items in inventory based on multiplication of current stock level and acquisition price</p>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Product Name</th>
              <th className="pb-3 font-semibold text-right">Holding Valuation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((prod, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{prod.name}</p>
                    <p className="text-xs text-slate-400">SKU: {prod.sku}</p>
                  </div>
                </td>
                <td className="py-3 text-right font-bold text-slate-900">
                    ${(prod.value ?? prod.total_value ?? 0).toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                    })}
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}