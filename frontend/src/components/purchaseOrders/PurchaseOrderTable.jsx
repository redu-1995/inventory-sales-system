// src/components/purchaseOrders/PurchaseOrderTable.jsx
import React from "react";
import PurchaseOrderRow from "./PurchaseOrderRow";

export default function PurchaseOrderTable({
  orders,
  loading,
  onView,
  onReceive,
  onCancel,
  onRestore,
  onPrint,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Loading purchase orders...
      </div>
    );
  }

  const ordersList = Array.isArray(orders)
    ? orders
    : orders && Array.isArray(orders.results)
    ? orders.results
    : [];

  if (ordersList.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">📦</div>
        <h3 className="text-base font-semibold text-gray-900">
          No Purchase Orders Found
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Create a purchase request to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        {/* Added table-fixed & min-w-[950px] to ensure clean proportions */}
        <table className="w-full table-fixed text-left border-collapse min-w-[1000px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="p-4 w-[40px]">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              {/* Defined proportional widths for every column */}
              <th className="p-4 w-[110px]">PO Number</th>
              <th className="p-4 min-w-[180px]">Supplier</th>
              <th className="p-4 w-[130px]">Order Date</th>
              <th className="p-4 w-[110px]">Items</th>
              <th className="p-4 w-[140px] text-right">Total</th>
              <th className="p-4 w-[130px] text-center">Status</th>
              <th className="p-4 w-[100px]">Created By</th>
              <th className="p-4 w-[140px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ordersList.map((order) => (
              <PurchaseOrderRow
                key={order.id}
                order={order}
                onView={onView}
                onReceive={onReceive}
                onCancel={onCancel}
                onRestore={onRestore}
                onPrint={onPrint}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}