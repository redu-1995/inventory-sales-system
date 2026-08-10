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
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
        <p>Loading purchase orders...</p>
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
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          No Purchase Orders Found
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Create a purchase order to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
            <tr>
              <th className="px-3 py-3 w-[36px]">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </th>
              <th className="px-3 py-3 w-[100px]">PO Number</th>
              <th className="px-3 py-3 min-w-[160px]">Supplier</th>
              <th className="px-3 py-3 w-[110px]">Order Date</th>
              <th className="px-3 py-3 w-[90px]">Items</th>
              <th className="px-3 py-3 w-[120px] text-right">Total</th>
              <th className="px-3 py-3 w-[110px] text-center">Status</th>
              <th className="px-3 py-3 w-[100px]">Created By</th>
              <th className="px-3 py-3 w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
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