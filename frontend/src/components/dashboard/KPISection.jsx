import React from 'react';
import { KPICard } from './KPICard';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, Boxes } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const KPISection = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-5">
      <KPICard
        title="Revenue Today"
        value={formatCurrency(summary.revenueToday)}
        icon={DollarSign}
        color="emerald"
      />
      <KPICard
        title="Today's Sales"
        value={`${summary.todaySalesCount} Orders`}
        icon={ShoppingBag}
        color="blue"
      />
      <KPICard
        title="Inventory Value"
        value={formatCurrency(summary.inventoryValue)}
        icon={Boxes}
        color="indigo"
      />
      <KPICard
        title="Products"
        value={summary.totalProducts}
        icon={Package}
        color="purple"
      />
      <KPICard
        title="Customers"
        value={summary.totalCustomers}
        icon={Users}
        color="amber"
      />
      <KPICard
        title="Low Stock"
        value={summary.lowStockCount}
        icon={AlertTriangle}
        color="rose"
      />
    </div>
  );
};