// src/components/reports/LowStockReport.jsx
import React from "react";
import { AlertCircle } from "lucide-react";

export function LowStockReport({ lowStockItems }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
        <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
          {lowStockItems.length} Products Needs Restock
        </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-4 rounded-l-lg">Product</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Reorder Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lowStockItems.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-emerald-600 font-medium">
                  ✓ All stock levels are healthy
                </td>
              </tr>
            ) : (
              lowStockItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    {item.product}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-600">{item.stock}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-500">{item.reorder_level}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}