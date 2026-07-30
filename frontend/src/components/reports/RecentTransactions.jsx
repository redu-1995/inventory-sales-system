// src/components/reports/RecentTransactions.jsx
import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function RecentTransactions({ transactions }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sales & Purchase Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-4 rounded-l-lg">Type</th>
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Party</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx, idx) => {
              const isSale = tx.type === "Sale";
              return (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isSale ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {isSale ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700">{tx.reference}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{tx.party}</td>
                  <td className={`py-3 px-4 text-right font-bold ${isSale ? "text-emerald-600" : "text-gray-900"}`}>
                    {isSale ? "+" : "-"} ETB {Number(tx.amount).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}