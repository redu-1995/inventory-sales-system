// src/pages/PurchaseOrders.jsx
import React from "react";
import { Download, Plus, ShoppingCart } from "lucide-react";
import { usePurchaseOrders } from "../../hooks/usePurchaseOrders";
import PurchaseOrderStats from "../../components/purchaseOrders/PurchaseOrderStats";
import PurchaseOrderFilters from "../../components/purchaseOrders/PurchaseOrderFilters";
import PurchaseOrderTable from "../../components/purchaseOrders/PurchaseOrderTable";
import PurchaseOrderPagination from "../../components/purchaseOrders/PurchaseOrderPagination";
import PurchaseOrderDetailsModal from "../../components/purchaseOrders/PurchaseOrderDetailsModal";
import PurchaseOrderModal from "../../components/purchaseOrders/PurchaseOrderModal"; 

export default function PurchaseOrders() {
  const {
    purchaseOrders,
    loading,
    stats,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    filters,
    setFilters,
    selectedOrder,
    setSelectedOrder,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreateOrder,
    handleExportOrders,
    handleReceive,
    handleCancel,
    handleDelete,
  } = usePurchaseOrders();

  const handleResetFilters = () => {
    setFilters({
      search: "",
      supplier: "",
      status: "",
      ordering: "newest",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-xs text-gray-500">
              Manage supplier purchase requests, approvals, and inventory receiving.
            </p>
          </div>
        </div>

        {/* Action Buttons Connected directly to usePurchaseOrders */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportOrders}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} />
            Export Purchase Orders
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            Create Purchase Request
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <PurchaseOrderStats orders={purchaseOrders} backendStats={stats} />

      {/* Filters Section */}
      <PurchaseOrderFilters
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Table Section */}
      <PurchaseOrderTable
        orders={purchaseOrders}
        loading={loading}
        onView={setSelectedOrder}
        onReceive={handleReceive}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      {/* Pagination Section */}
      <PurchaseOrderPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
      />

      {/* View Details Modal */}
      {selectedOrder && (
        <PurchaseOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReceive={handleReceive}
          onCancel={handleCancel}
        />
      )}

      {/* Create Purchase Request Modal (Driven by Hook State) */}
      {isCreateModalOpen && (
      <PurchaseOrderModal
        isOpen={isCreateModalOpen} // 👈 1. Pass isOpen so the modal doesn't return null
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleCreateOrder} // 👈 2. Match the prop name defined in PurchaseOrderModal
      />
    )}
    </div>
  );
}