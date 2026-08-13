import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowUpRight, FileText } from 'lucide-react';

export const RecentTransactions = ({ recentSales = [], recentPOs = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Sales */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Sales</h2>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Invoices</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-y border-slate-100">
                  <th className="py-2.5 px-3 rounded-l-lg">Invoice</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {sale.invoice_number}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{sale.customer}</td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(sale.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Purchase Orders</h2>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Procurement</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-y border-slate-100">
                  <th className="py-2.5 px-3 rounded-l-lg">PO Number</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPOs.map((po, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{po.po_number}</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{po.supplier}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 inline-block">
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};