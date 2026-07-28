import React, { useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const SalesStats = ({ stats, salesData = [] }) => {
  // Extract and format stats from the DRF sales_report endpoint response or calculate from salesData array
  const calculatedStats = useMemo(() => {
    // 1. Primary: Use the backend GET /api/sales/report/ response structure
    if (stats && (stats.total_revenue !== undefined || stats.totalRevenue !== undefined)) {
      return {
        totalRevenue: Number(stats.total_revenue ?? stats.totalRevenue ?? 0),
        revenueTrend: stats.revenue_trend ?? stats.revenueTrend ?? '+0.0%',
        isRevenuePositive: !(stats.revenue_trend ?? '').startsWith('-'),

        totalOrders: Number(stats.total_orders ?? stats.totalOrders ?? stats.total_sales ?? 0),
        ordersTrend: stats.orders_trend ?? stats.ordersTrend ?? '+0.0%',
        isOrdersPositive: !(stats.orders_trend ?? '').startsWith('-'),

        avgOrderValue: Number(stats.avg_order_value ?? stats.avgOrderValue ?? 0),
        avgTrend: stats.avg_trend ?? stats.avgTrend ?? '+0.0%',
        isAvgPositive: !(stats.avg_trend ?? '').startsWith('-'),

        pendingPayments: Number(stats.pending_payments ?? stats.pendingPayments ?? 0),
        pendingOrdersCount: Number(stats.pending_orders_count ?? stats.pendingOrdersCount ?? 0)
      };
    }

    // 2. Fallback: Aggregate client-side if a raw sales array is passed instead of report endpoint
    if (Array.isArray(salesData) && salesData.length > 0) {
      let revenue = 0;
      let pendingAmount = 0;
      let pendingCount = 0;

      salesData.forEach((sale) => {
        const statusUpper = (sale.status || '').toUpperCase();
        const total = Number(sale.total_amount ?? sale.total ?? 0);
        const paid = Number(sale.paid_amount ?? sale.paid ?? 0);
        const remaining = Number(
          sale.remaining_amount ?? sale.remaining ?? (total - paid)
        );

        if (statusUpper !== 'CANCELLED') {
          revenue += total;
        }

        // Account for 'PENDING', 'PARTIAL', or 'PARTIALLY_PAID' states
        if (
          statusUpper === 'PENDING' ||
          statusUpper === 'PARTIAL' ||
          statusUpper === 'PARTIALLY_PAID' ||
          remaining > 0
        ) {
          pendingAmount += remaining > 0 ? remaining : total;
          pendingCount += 1;
        }
      });

      const totalCount = salesData.length;
      const avgValue = totalCount > 0 ? revenue / totalCount : 0;

      return {
        totalRevenue: revenue,
        revenueTrend: '+0.0%',
        isRevenuePositive: true,

        totalOrders: totalCount,
        ordersTrend: '+0.0%',
        isOrdersPositive: true,

        avgOrderValue: avgValue,
        avgTrend: '+0.0%',
        isAvgPositive: true,

        pendingPayments: pendingAmount,
        pendingOrdersCount: pendingCount
      };
    }

    // 3. Default empty state
    return {
      totalRevenue: 0,
      revenueTrend: '0.0%',
      isRevenuePositive: true,
      totalOrders: 0,
      ordersTrend: '0.0%',
      isOrdersPositive: true,
      avgOrderValue: 0,
      avgTrend: '0.0%',
      isAvgPositive: true,
      pendingPayments: 0,
      pendingOrdersCount: 0
    };
  }, [stats, salesData]);

  // Safe Currency Formatter Helper
  const safeFormat = (val) => {
    if (typeof formatCurrency === 'function') {
      return formatCurrency(val);
    }
    return `${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ETB`;
  };

  const statCards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: safeFormat(calculatedStats.totalRevenue),
      trend: calculatedStats.revenueTrend,
      isPositive: calculatedStats.isRevenuePositive,
      subtitle: 'vs last month',
      icon: DollarSign,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: calculatedStats.totalOrders.toLocaleString(),
      trend: calculatedStats.ordersTrend,
      isPositive: calculatedStats.isOrdersPositive,
      subtitle: 'vs last month',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'avg_order',
      title: 'Avg. Order Value',
      value: safeFormat(calculatedStats.avgOrderValue),
      trend: calculatedStats.avgTrend,
      isPositive: calculatedStats.isAvgPositive,
      subtitle: 'vs last month',
      icon: TrendingUp,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'pending',
      title: 'Pending Payments',
      value: safeFormat(calculatedStats.pendingPayments),
      badgeText: `${calculatedStats.pendingOrdersCount} pending / partial`,
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