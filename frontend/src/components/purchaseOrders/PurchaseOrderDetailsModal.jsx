// src/components/purchaseOrders/PurchaseOrderDetailsModal.jsx
import React from "react";
import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";

export default function PurchaseOrderDetailsModal({
  order,
  onClose,
  onReceive,
  onCancel,
}) {
  if (!order) return null;

  const isPending = order.status?.toUpperCase() === "PENDING";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900">{order.po_number || `#${order.id}`}</h2>
              <PurchaseOrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Supplier: {order.supplier_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-gray-500 block text-xs">Created By</span>
              <span className="font-medium text-gray-900">{order.created_by || "Admin"}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Order Date</span>
              <span className="font-medium text-gray-900">{order.order_date || order.created_at?.slice(0, 10)}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Line Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Cost</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(order.items || []).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="p-3 font-medium text-gray-900">{item.product_name}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{Number(item.unit_cost || item.cost || 0).toLocaleString()} ETB</td>
                      <td className="p-3 text-right font-semibold">
                        {(item.quantity * (item.unit_cost || item.cost || 0)).toLocaleString()} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <div className="text-right">
              <span className="text-sm text-gray-500">Total Amount: </span>
              <span className="text-lg font-bold text-blue-600">
                {Number(order.total_amount || 0).toLocaleString()} ETB
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>

          {isPending && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onCancel(order.id);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                Cancel Order
              </button>
              <button
                onClick={() => {
                  onReceive(order.id);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
              >
                Receive Goods
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}