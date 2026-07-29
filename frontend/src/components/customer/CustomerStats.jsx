import React from 'react';
import { Users, UserCheck, DollarSign, CreditCard } from 'lucide-react';

/**
 * CustomerStats Component
 * Displays summary metric cards for total customers, active count, total revenue, and balances.
 * 
 * @param {Object} props
 * @param {Object} props.stats - Aggregated KPI data from the hook/API
 * @param {boolean} props.loading - Loading state
 */
export default function CustomerStats({ stats, loading = false }) {
  // Format numeric values to ETB currency representation
  const formatETB = (amount) => {
    return `ETB ${Number(amount || 0).toLocaleString()}`;
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.total_customers ?? 245,
      subtext: '+18 this month',
      subtextColor: 'text-emerald-600',
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Customers',
      value: stats?.active_customers ?? 210,
      subtext: `${stats?.active_percentage ?? 86}% of customers`,
      subtextColor: 'text-emerald-600',
      icon: UserCheck,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Total Customer Sales',
      value: formatETB(stats?.total_sales ?? 845600),
      subtext: 'All-time revenue',
      subtextColor: 'text-slate-400',
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Outstanding Balance',
      value: formatETB(stats?.total_outstanding ?? 32500),
      subtext: 'Pending customer payments',
      subtextColor: 'text-slate-400',
      icon: CreditCard,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-6 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className="text-2xl font-bold text-slate-800 mt-0.5">
                {card.value}
              </div>
              <span className={`text-xs font-medium ${card.subtextColor} mt-0.5 block`}>
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}