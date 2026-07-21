import React from 'react';
import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck, XCircle } from 'lucide-react';

export default function InventoryStats({ summary }) {
  const totalUnits = summary?.total_stock_units || 0;
  const lowStock = summary?.low_stock || 0;
  const outOfStock = summary?.out_of_stock || 0;
  const inventoryValue = summary?.inventory_value || 0;
  const healthyUnits = Math.max(totalUnits - lowStock - outOfStock, 0);
  const healthScore = totalUnits ? Math.round((healthyUnits / totalUnits) * 100) : 100;

  const cards = [
    {
      title: 'Total Stock Units',
      value: totalUnits.toLocaleString(),
      delta: '3.4% vs last month',
      tone: 'text-emerald-600',
      icon: Boxes,
      iconClass: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Low Stock Products',
      value: lowStock.toLocaleString(),
      delta: '7% vs last month',
      tone: 'text-amber-600',
      icon: AlertTriangle,
      iconClass: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Out of Stock Products',
      value: outOfStock.toLocaleString(),
      delta: '2% vs last month',
      tone: 'text-red-600',
      icon: XCircle,
      iconClass: 'bg-red-50 text-red-600'
    },
    {
      title: 'Inventory Value',
      value: `$${inventoryValue.toLocaleString()}`,
      delta: '1.7% vs last month',
      tone: 'text-emerald-600',
      icon: CircleDollarSign,
      iconClass: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Inventory Health',
      value: `${healthScore}%`,
      delta: healthScore >= 80 ? 'Excellent cover' : 'Needs attention',
      tone: healthScore >= 80 ? 'text-emerald-600' : 'text-amber-600',
      icon: PackageCheck,
      iconClass: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.title} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 min-h-32 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.iconClass}`}>
              <Icon size={24} strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight mt-2">{card.value}</h3>
              <p className="text-xs text-slate-500 mt-3">
                <span className={`font-bold ${card.tone}`}>^ {card.delta.split(' ')[0]}</span>{' '}
                {card.delta.replace(card.delta.split(' ')[0], '').trim()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
