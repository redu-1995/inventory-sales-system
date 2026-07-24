// src/components/purchaseOrders/PurchaseOrderStats.jsx
import React from "react";
import { Clock, CheckCircle2, PackageCheck, XCircle } from "lucide-react";

export default function PurchaseOrderStats({ orders = [], backendStats }) {
  // Compute counts dynamically if backend stats are not directly provided
  const stats = backendStats || {
    pending: orders.filter((o) => o.status?.toLowerCase() === "pending").length,
    approved: orders.filter((o) => o.status?.toLowerCase() === "approved").length,
    received: orders.filter((o) => o.status?.toLowerCase() === "received").length,
    cancelled: orders.filter((o) => o.status?.toLowerCase() === "cancelled").length,
  };

  const statCards = [
    {
      title: "Pending Orders",
      count: stats.pending || 0,
      subtext: "Awaiting approval",
      icon: Clock,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      accentColor: "bg-amber-500",
    },
    {
      title: "Approved Orders",
      count: stats.approved || 0,
      subtext: "Ready for delivery",
      icon: CheckCircle2,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      accentColor: "bg-blue-600",
    },
    {
      title: "Received Orders",
      count: stats.received || 0,
      subtext: "Inventory updated",
      icon: PackageCheck,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
      accentColor: "bg-emerald-500",
    },
    {
      title: "Cancelled Orders",
      count: stats.cancelled || 0,
      subtext: "This month",
      icon: XCircle,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-500",
      accentColor: "bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{card.count}</h3>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.iconColor}`}>
                <Icon size={20} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-gray-400 block mb-2">{card.subtext}</span>
              <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${card.accentColor} w-2/3`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}