import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const LowStockTable = ({ lowStock }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Low Stock Alert</h2>
          </div>
          <Link
            to="/inventory"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View Inventory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium text-xs border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-center">Current</th>
                <th className="py-2.5 px-3 text-center">Reorder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStock.length > 0 ? (
                lowStock.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">{item.product}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-rose-600">{item.stock}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{item.reorder_level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-slate-400 text-xs">
                    All inventory levels healthy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};