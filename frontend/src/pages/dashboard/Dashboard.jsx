import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { KPISection } from '../../components/dashboard/KPISection';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { TopProducts } from '../../components/dashboard/TopProducts';
import { InventoryOverview } from '../../components/dashboard/InventoryOverview';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { LoadingSkeleton } from '../../components/dashboard/LoadingSkeleton';
import { ErrorState } from '../../components/dashboard/ErrorState';

export const DashboardPage = () => {
  const {
    summary,
    salesChart,
    lowStock,
    recentSales,
    recentPurchaseOrders,
    topProducts,
    inventorySummary,
    loading,
    error,
    refresh,
  } = useDashboard();

  if (loading && !summary) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* 1. Header */}
      <DashboardHeader onRefresh={refresh} loading={loading} />

      {/* 2. Quick Actions */}
      <QuickActions />

      {/* 3. KPI Cards */}
      <KPISection summary={summary} />

      {/* 4. Sales Chart & Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart salesChart={salesChart} />
        </div>
        <div>
          <InventoryOverview summary={inventorySummary} />
        </div>
      </div>

      {/* 5. Top Selling & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts topProducts={topProducts} />
        <LowStockTable lowStock={lowStock} />
      </div>

      {/* 6. Recent Sales & Purchase Orders */}
      <RecentTransactions
        recentSales={recentSales}
        recentPOs={recentPurchaseOrders}
      />
    </div>
  );
};

export default DashboardPage;