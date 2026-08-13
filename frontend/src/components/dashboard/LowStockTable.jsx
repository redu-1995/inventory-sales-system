import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LowStockTable = ({ lowStock }) => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-100/80 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Low Stock Alert</h2>
              <p className="text-xs text-slate-500">Items requiring immediate attention</p>
            </div>
          </div>
          <Link
            to="/inventory"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50/60 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/60"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-y border-slate-100">
                <th className="py-2.5 px-3 rounded-l-lg">Product</th>
                <th className="py-2.5 px-3 text-center">Current Stock</th>
                <th className="py-2.5 px-3 text-center rounded-r-lg">Reorder Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStock.length > 0 ? (
                lowStock.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.product}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                        {item.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-medium">{item.reorder_level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/80" />
                      <p className="text-xs font-medium text-slate-600">All inventory levels healthy.</p>
                    </div>
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