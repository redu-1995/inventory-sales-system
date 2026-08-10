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

  // 1. Format PO Number
  const formattedPoNumber = order.po_number || `PO-${String(order.id).padStart(4, "0")}`;

  // 2. Date Formatter
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
      <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs text-slate-700">
        {/* Checkbox */}
        <td className="px-3 py-2.5 align-middle">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
        </td>

        {/* PO Number */}
        <td className="px-3 py-2.5 font-semibold text-slate-900 align-middle whitespace-nowrap">
          {formattedPoNumber}
        </td>

        {/* Supplier Name */}
        <td className="px-3 py-2.5 align-middle font-medium text-slate-800 truncate max-w-[200px]" title={order.supplier_name}>
          {order.supplier_name || "N/A"}
        </td>

        {/* Order Date */}
        <td className="px-3 py-2.5 align-middle text-slate-500 whitespace-nowrap">
          {formatDate(order.order_date || order.created_at)}
        </td>

        {/* Items Count Pill */}
        <td className="px-3 py-2.5 align-middle">
          <button
            onClick={() => setShowItems(!showItems)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200/60 transition-colors"
          >
            <span>{itemsCount} {itemsCount === 1 ? "Item" : "Items"}</span>
            <svg
              className={`w-3 h-3 text-slate-500 transform transition-transform ${showItems ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </td>

        {/* Total Amount */}
        <td className="px-3 py-2.5 align-middle font-semibold text-slate-900 text-right whitespace-nowrap">
          {Number(order.total_amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          <span className="text-[10px] font-normal text-slate-400">ETB</span>
        </td>

        {/* Status Badge */}
        <td className="px-3 py-2.5 align-middle text-center whitespace-nowrap">
          <PurchaseOrderStatusBadge status={order.status} />
        </td>

        {/* Created By */}
        <td className="px-3 py-2.5 align-middle text-slate-500 truncate max-w-[100px]" title={order.user_name || order.created_by || "Admin"}>
          {order.user_name || order.created_by || "Admin"}
        </td>

        {/* Compact Actions Column (Max ~120px) */}
        <td className="px-3 py-2.5 align-middle text-right whitespace-nowrap w-[120px]">
          <div className="flex items-center justify-end gap-1">
            {/* View Details Icon */}
            <button
              onClick={() => onView && onView(order)}
              title="View Details"
              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Print Document Icon */}
            <button
              onClick={handlePrintClick}
              title="Print Order"
              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            {/* Contextual Actions (Pending Orders Only) */}
            {isPending && (
              <>
                {/* Receive Icon Button */}
                <button
                  onClick={() => onReceive && onReceive(order.id)}
                  title="Receive Goods"
                  className="w-7 h-7 flex items-center justify-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </button>

                {/* Cancel Icon Button */}
                <button
                  onClick={handleCancelClick}
                  title="Cancel Order"
                  className="w-7 h-7 flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Expandable Sub-Row */}
      {showItems && (
        <tr className="bg-slate-50/70 border-b border-slate-200">
          <td colSpan="9" className="px-8 py-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Ordered Products Breakdown:
            </div>
            <div className="bg-white rounded border border-slate-200 p-3 max-w-md shadow-sm">
              {itemsList.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {itemsList.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center py-1 text-xs">
                      <span className="font-medium text-slate-800">{item.product_name || "Product"}</span>
                      <span className="text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        x{item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No items metadata loaded.</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}