import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 1. Updated import name to match purchaseOrderService export
import { purchaseOrderService } from "../../services/purchaseOrderService";
import PurchaseOrderPrint from "../../components/purchaseOrders/PurchaseOrderPrint";

export default function PurchaseOrderPrintPage() {
  const { id } = useParams();

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Purchase Order Details
  useEffect(() => {
    setLoading(true);
    // 2. Updated API call to use purchaseOrderService
    purchaseOrderService
      .getPurchaseOrder(id)
      .then((data) => {
        setPurchaseOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load purchase order for print:", err);
        setError("Failed to load purchase order details.");
        setLoading(false);
      });
  }, [id]);

  // 2. Trigger Print Dialog once data is loaded & rendered
  useEffect(() => {
    if (purchaseOrder) {
      // 500ms delay ensures DOM & text are fully rendered before print dialog opens
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [purchaseOrder]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading purchase order document...</span>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error || !purchaseOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-sans">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200 text-center">
          <h2 className="text-lg font-bold mb-1">Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error || "Purchase order not found."}</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  // Render Printable Document Component
  return (
    <div className="min-h-screen bg-white">
      <PurchaseOrderPrint order={purchaseOrder} />
    </div>
  );
}