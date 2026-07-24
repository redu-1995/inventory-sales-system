// src/components/purchaseOrders/PurchaseOrderStatusBadge.jsx
import React from "react";

const badgeStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  RECEIVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function PurchaseOrderStatusBadge({ status }) {
  const normalizedStatus = (status || "").toUpperCase();
  const style = badgeStyles[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      • {normalizedStatus}
    </span>
  );
}