// src/components/purchaseOrders/PurchaseOrderTable.jsx
import React from "react";
import PurchaseOrderRow from "./PurchaseOrderRow";

export default function PurchaseOrderTable({
  orders,
  loading,
  onView,
  onReceive,
  onCancel,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Loading purchase orders...
      </div>
    );
  }

  // Ensure ordersList is always a valid Array
  const ordersList = Array.isArray(orders) 
    ? orders 
    : (orders && Array.isArray(orders.results) ? orders.results : []);

  if (ordersList.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">📦</div>
        <h3 className="text-base font-semibold text-gray-900">No Purchase Orders Found</h3>
        <p className="text-sm text-gray-500 mt-1">Create a purchase request to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="p-4 w-10">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="p-4">PO Number</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Order Date</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created By</th>
              <th className="p-4">Actions</th>
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
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}