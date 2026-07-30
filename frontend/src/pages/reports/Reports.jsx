// src/pages/Reports.jsx
import React from "react";
import { useReports } from "../../hooks/useReports";
import { ReportHeader } from "../../components/reports/ReportHeader";
import { ReportStats } from "../../components/reports/ReportStats";
import { SalesChart } from "../../components/reports/SalesChart";
import { TopSellingProducts } from "../../components/reports/TopSellingProducts";
import { LowStockReport } from "../../components/reports/LowStockReport";
import { RecentTransactions } from "../../components/reports/RecentTransactions";
import { ExportReports } from "../../components/reports/ExportReports";

export default function Reports() {
  const {
    summary,
    salesChart,
    topProducts,
    lowStock,
    recentTransactions,
    loading,
    error,
    refresh,
    handleExport,
  } = useReports();

  if (loading && !summary) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center mt-12 bg-white rounded-xl border border-red-100 p-6">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header Bar */}
      <ReportHeader onRefresh={refresh} onExport={handleExport} loading={loading} />

      {/* KPI Stats */}
      <ReportStats summary={summary} />

      {/* Main Revenue Chart */}
      <SalesChart salesChart={salesChart} />

      {/* Analytics Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts products={topProducts} />
        <LowStockReport lowStockItems={lowStock} />
      </div>

      {/* Recent Transactions & Export Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>
        <div className="lg:col-span-1">
          <ExportReports onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}