import React from "react";
import { Printer, X } from "lucide-react";

export default function PurchaseOrderPrint({ order }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white p-4 sm:p-8 print:p-0">
      
      {/* Control Action Bar (Hidden automatically when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="text-sm font-medium text-gray-700">
            Print Preview Mode — PO #{order.id}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          <button
            onClick={handleClose}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Close Tab
          </button>
        </div>
      </div>

      {/* Printable Document Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-md print:shadow-none print:max-w-none print:p-0 text-gray-800">
        
        {/* Document Header */}
        <div className="flex justify-between items-start pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Yetem Trading PLC
            </h1>
            <p className="text-sm text-gray-500 mt-1">Addis Ababa, Ethiopia</p>
            <p className="text-sm text-gray-500">Issued By: {order.user_name || "System Admin"}</p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-extrabold uppercase tracking-wider text-blue-600">
              PURCHASE ORDER
            </h2>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              PO Number: <span className="text-gray-900">PO-#{order.id}</span>
            </p>
            <p className="text-sm text-gray-500">
              Order Date: {order.order_date || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Expected Delivery: {order.expected_delivery || "N/A"}
            </p>
          </div>
        </div>

        {/* Vendor & Status Summary */}
        <div className="grid grid-cols-2 gap-8 my-8">
          <div className="bg-gray-50 print:bg-transparent p-4 rounded-lg print:p-0">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Supplier Details
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {order.supplier_name || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 print:bg-transparent p-4 rounded-lg print:p-0 text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Order Status
            </h3>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 print:border print:border-gray-300">
              {order.status}
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50 print:bg-gray-100">
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-600">
                  Product Description
                </th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-center">
                  Qty
                </th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">
                  Unit Cost (ETB)
                </th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">
                  Subtotal (ETB)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <tr key={item.id || item.product} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-right text-gray-700">
                      {Number(item.cost_price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-right font-medium text-gray-900">
                      {(item.subtotal
                        ? Number(item.subtotal)
                        : item.quantity * item.cost_price
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 text-sm">
                    No line items found for this purchase order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end pt-6 mt-4 border-t-2 border-gray-200">
          <div className="w-full sm:w-1/2 space-y-2">
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
              <span>Grand Total:</span>
              <span className="text-lg text-blue-600">
                {Number(order.total_amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ETB
              </span>
            </div>
          </div>
        </div>

        {/* Notes & Terms Section */}
        {order.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Notes & Instructions
            </h4>
            <p className="text-sm text-gray-700 bg-gray-50 print:bg-transparent p-3 rounded print:p-0 whitespace-pre-wrap">
              {order.notes}
            </p>
          </div>
        )}

        {/* Signature & Footer Block */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-sm text-gray-500">
          <div>
            <div className="border-b border-gray-400 w-48 mb-2"></div>
            <p className="font-medium text-gray-700">Authorized Signature</p>
            <p className="text-xs text-gray-400">Yetem Trading PLC</p>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="italic text-gray-600">Thank you for your business!</p>
            <p className="text-xs text-gray-400 mt-1">Generated by Inventory Management System</p>
          </div>
        </div>

      </div>
    </div>
  );
}