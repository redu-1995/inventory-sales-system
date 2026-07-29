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
      tone: 'text-rose-600',
      icon: XCircle,
      iconClass: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Inventory Value',
      value: `$${inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
      iconClass: healthScore >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const deltaParts = card.delta.split(' ');
        const deltaVal = deltaParts[0];
        const deltaRest = deltaParts.slice(1).join(' ');

        return (
          <div 
            key={card.title} 
            className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-start gap-3 hover:border-slate-300 transition-colors min-w-0"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconClass}`}>
              <Icon size={18} strokeWidth={2} />
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 truncate" title={card.title}>
                {card.title}
              </p>
              
              {/* Dynamic text sizing prevents currency overflow */}
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 truncate">
                {card.value}
              </h3>
              
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <span className={`font-semibold shrink-0 ${card.tone}`}>↑ {deltaVal}</span>
                <span className="truncate">{deltaRest}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}