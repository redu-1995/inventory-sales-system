import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const SalesStats = ({ stats }) => {
  // Fallback / default data based on your design mockup
  const defaultStats = {
    totalRevenue: stats?.totalRevenue ?? 128450.00,
    revenueTrend: stats?.revenueTrend ?? '+12.5%',
    isRevenuePositive: stats?.isRevenuePositive ?? true,
    
    totalOrders: stats?.totalOrders ?? 342,
    ordersTrend: stats?.ordersTrend ?? '+8.2%',
    isOrdersPositive: stats?.isOrdersPositive ?? true,
    
    avgOrderValue: stats?.avgOrderValue ?? 375.58,
    avgTrend: stats?.avgTrend ?? '-2.1%',
    isAvgPositive: stats?.isAvgPositive ?? false,
    
    pendingPayments: stats?.pendingPayments ?? 14250.00,
    pendingOrdersCount: stats?.pendingOrdersCount ?? 18
  };

  const statCards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency ? formatCurrency(defaultStats.totalRevenue) : `$${defaultStats.totalRevenue.toLocaleString()}`,
      trend: defaultStats.revenueTrend,
      isPositive: defaultStats.isRevenuePositive,
      subtitle: 'vs last month',
      icon: DollarSign,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: defaultStats.totalOrders.toLocaleString(),
      trend: defaultStats.ordersTrend,
      isPositive: defaultStats.isOrdersPositive,
      subtitle: 'vs last month',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'avg_order',
      title: 'Avg. Order Value',
      value: formatCurrency ? formatCurrency(defaultStats.avgOrderValue) : `$${defaultStats.avgOrderValue.toLocaleString()}`,
      trend: defaultStats.avgTrend,
      isPositive: defaultStats.isAvgPositive,
      subtitle: 'vs last month',
      icon: TrendingUp,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'pending',
      title: 'Pending Payments',
      value: formatCurrency ? formatCurrency(defaultStats.pendingPayments) : `$${defaultStats.pendingPayments.toLocaleString()}`,
      badgeText: `${defaultStats.pendingOrdersCount} orders`,
      isWarning: true,
      subtitle: 'requires collection',
      icon: Clock,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </h3>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs">
              {card.trend && (
                <span
                  className={`inline-flex items-center font-semibold rounded-md px-1.5 py-0.5 ${
                    card.isPositive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
                  )}
                  {card.trend}
                </span>
              )}

              {card.badgeText && (
                <span className="inline-flex items-center font-medium bg-amber-50 text-amber-700 rounded-md px-1.5 py-0.5">
                  {card.badgeText}
                </span>
              )}

              <span className="text-slate-400 font-normal">
                {card.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SalesStats;