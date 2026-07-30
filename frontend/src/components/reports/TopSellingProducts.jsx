// src/components/reports/TopSellingProducts.jsx
import React from "react";

export function TopSellingProducts({ products }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-4 rounded-l-lg">Product</th>
              <th className="py-3 px-4">Units Sold</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">No sales recorded yet</td>
              </tr>
            ) : (
              products.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-semibold text-gray-800">{item.product}</td>
                  <td className="py-3 px-4 font-medium">{item.sold}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    ETB {Number(item.revenue).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}