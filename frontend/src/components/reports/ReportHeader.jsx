// src/components/reports/ReportHeader.jsx
import React from "react";
import { Download, RefreshCw, BarChart2 } from "lucide-react";

export function ReportHeader({ onRefresh, onExport, loading }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Real-time insights on sales, inventory valuations, purchases, and performance KPIs.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <button
          onClick={() => onExport("sales", "excel")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export All (Excel)
        </button>
      </div>
    </div>
  );
}