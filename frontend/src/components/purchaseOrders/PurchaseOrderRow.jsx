// src/components/purchaseOrders/PurchaseOrderRow.jsx
import React, { useState } from "react";
import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";

export default function PurchaseOrderRow({
  order,
  onView,
  onReceive,
  onCancel,
  onRestore,
  onPrint,
}) {
  const [showItems, setShowItems] = useState(false);

  const status = order.status?.toUpperCase() || "PENDING";
  const isPending = status === "PENDING" || status === "DRAFT";
  const isReceived = status === "RECEIVED";
  const isCancelled = status === "CANCELLED";

  // 1. Format PO Number: e.g., PO-0006 or fallback to ID
  const formattedPoNumber = order.po_number || `PO-${String(order.id).padStart(4, "0")}`;

  // 2. Format ISO Timestamp to clean date (e.g., "25 Jul 2026")
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString.slice(0, 10);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString.slice(0, 10);
    }
  };

  const handleCancelClick = () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Purchase Order ${formattedPoNumber}?\n\nThis action will prevent the order from being received.`
    );
    if (confirmed && onCancel) {
      onCancel(order.id);
    }
  };

  const handlePrintClick = (e) => {
    e.stopPropagation();
    if (onPrint) {
      onPrint(order);
    } else {
      window.open(`/purchase-orders/${order.id}/print`, "_blank");
    }
  };

  const itemsList = order.items || [];
  const itemsCount = itemsList.length;

  return (
    <>
      <tr className="hover:bg-gray-50/50 border-b border-gray-100 text-sm">
        <td className="p-4">
          <input type="checkbox" className="rounded border-gray-300" />
        </td>
        
        {/* PO Number Column */}
        <td
          className="p-4 font-semibold text-blue-600 cursor-pointer hover:underline"
          onClick={() => onView && onView(order)}
        >
          {formattedPoNumber}
        </td>

        {/* Supplier Name (Truncated cleanly if too long) */}
        <td className="p-4 font-medium text-gray-900 max-w-[200px] truncate" title={order.supplier_name}>
          {order.supplier_name || "N/A"}
        </td>

        {/* Formatted Date Column */}
        <td className="p-4 text-gray-600 whitespace-nowrap">
          {formatDate(order.order_date || order.created_at)}
        </td>

        {/* Clickable Items Count Column */}
        <td className="p-4">
          <button
            onClick={() => setShowItems(!showItems)}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
          >
            <span>{itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}</span>
            <span className={`transform transition-transform ${showItems ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
        </td>

        {/* Right-Aligned Total Amount Column */}
        <td className="p-4 font-semibold text-gray-900 text-right whitespace-nowrap">
          {Number(order.total_amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ETB
        </td>

        {/* Status Badge */}
        <td className="p-4">
          <PurchaseOrderStatusBadge status={order.status} />
        </td>

        {/* Created By */}
        <td className="p-4 text-gray-500 text-xs truncate max-w-[120px]" title={order.user_name || order.created_by || "Admin"}>
        {order.user_name || order.created_by || "Admin"}
      </td>

        {/* Contextual Actions */}
       <td className="p-4 text-right whitespace-nowrap w-[200px]">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onView && onView(order)}
            title="View Details"
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            👁️
          </button>

          <button
            onClick={handlePrintClick}
            title="Print Order Document"
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            🖨️
          </button>

          {isPending && (
            <>
              <button
                onClick={() => onReceive && onReceive(order.id)}
                title="Receive Goods"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
              >
                📦 Receive
              </button>
              <button
                onClick={handleCancelClick}
                title="Cancel Order"
                className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
              >
                ❌
              </button>
            </>
          )}
        </div>
      </td>
      </tr>

      {/* Expandable Sub-Row for Items List Preview */}
      {showItems && (
        <tr className="bg-gray-50/80 border-b border-gray-200">
          <td colSpan="9" className="px-8 py-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Ordered Products Breakdown:
            </div>
            <div className="bg-white rounded border border-gray-200 p-3 max-w-lg shadow-sm">
              {itemsList.length > 0 ? (
                <ul className="space-y-1.5">
                  {itemsList.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-xs text-gray-700 border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                      <span className="font-medium text-gray-900">{item.product_name || "Product"}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">No items metadata loaded.</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}