// src/components/reports/ExportReports.jsx
import React from "react";
import { FileSpreadsheet, FileText } from "lucide-react";

export function ExportReports({ onExport }) {
  const exports = [
    { name: "Sales Report", type: "sales" },
    { name: "Inventory Report", type: "inventory" },
    { name: "Purchase Report", type: "purchases" },
    { name: "Customer Report", type: "customers" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Export Datasets</h3>
        <p className="text-xs text-gray-500 mb-4">Download comprehensive offline summaries</p>

        <div className="space-y-3">
          {exports.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-700">{item.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onExport(item.type, "excel")}
                  title="Export Excel"
                  className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onExport(item.type, "csv")}
                  title="Export CSV"
                  className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}