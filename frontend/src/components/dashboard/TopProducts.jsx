import React from 'react';
import { PackageCheck } from 'lucide-react';

export const TopProducts = ({ topProducts = [] }) => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Selling Products</h2>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">By Volume</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-y border-slate-100">
              <th className="py-2.5 px-3 rounded-l-lg">Product</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Units Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topProducts.length > 0 ? (
              topProducts.map((prod, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{prod.product}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-indigo-600">
                    {prod.sold}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-8 text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <PackageCheck className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-medium text-slate-500">No sales recorded yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ); 
};