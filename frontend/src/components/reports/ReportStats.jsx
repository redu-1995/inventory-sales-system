// src/components/reports/ReportStats.jsx
import React from "react";
import { Coins, ShoppingBag, Package, Users, AlertTriangle, TrendingUp } from "lucide-react";

export function ReportStats({ summary }) {
  if (!summary) return null;

  const statCards = [
    {
      title: "Total Revenue",
      value: `ETB ${Number(summary.total_revenue).toLocaleString()}`,
      icon: Coins,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Purchases",
      value: `ETB ${Number(summary.total_purchases).toLocaleString()}`,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Inventory Value",
      value: `ETB ${Number(summary.inventory_value).toLocaleString()}`,
      icon: Package,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Products Sold",
      value: summary.products_sold.toLocaleString(),
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Active Customers",
      value: summary.customers,
      icon: Users,
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "Low Stock Items",
      value: summary.low_stock,
      icon: AlertTriangle,
      color: summary.low_stock > 0 ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold text-gray-900">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}