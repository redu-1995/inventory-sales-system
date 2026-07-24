// src/components/purchaseOrders/PurchaseOrderRow.jsx
import React from "react";
import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";

export default function PurchaseOrderRow({
  order,
  onView,
  onReceive,
  onCancel,
  onDelete,
}) {
  const isPending = order.status?.toUpperCase() === "PENDING";

  return (
    <tr className="hover:bg-gray-50/50 border-b border-gray-100 text-sm">
      <td className="p-4">
        <input type="checkbox" className="rounded border-gray-300" />
      </td>
      <td className="p-4 font-semibold text-blue-600 cursor-pointer" onClick={() => onView(order)}>
        {order.po_number || `#${order.id}`}
      </td>
      <td className="p-4 font-medium text-gray-900">{order.supplier_name || "N/A"}</td>
      <td className="p-4 text-gray-600">{order.order_date || order.created_at?.slice(0, 10)}</td>
      <td className="p-4 text-gray-600">{order.items?.length || order.items_count || 0} items</td>
      <td className="p-4 font-semibold text-gray-900">
        {Number(order.total_amount || 0).toLocaleString()} ETB
      </td>
      <td className="p-4">
        <PurchaseOrderStatusBadge status={order.status} />
      </td>
      <td className="p-4 text-gray-500 text-xs">{order.created_by || "Admin"}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {/* View Details */}
          <button
            onClick={() => onView(order)}
            title="View Details"
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            👁️
          </button>

          {/* Receive & Cancel are only permitted if Pending */}
          {isPending && (
            <>
              <button
                onClick={() => onReceive(order.id)}
                title="Receive Goods"
                className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                ✅
              </button>
              <button
                onClick={() => onCancel(order.id)}
                title="Cancel Order"
                className="p-1 text-amber-600 hover:text-amber-800 transition-colors"
              >
                🚫
              </button>
              <button
                onClick={() => onDelete(order.id)}
                title="Delete Order"
                className="p-1 text-rose-600 hover:text-rose-800 transition-colors"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}