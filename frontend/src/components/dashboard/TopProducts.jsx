import React from 'react';

export const TopProducts = ({ topProducts }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Top Selling Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium text-xs border-y border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3 text-right">Units Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topProducts.length > 0 ? (
              topProducts.map((prod, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{prod.product}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{prod.sold}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-6 text-slate-400 text-xs">
                  No sales recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};