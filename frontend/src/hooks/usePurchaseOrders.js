import { useState, useEffect, useCallback } from "react";
import { purchaseOrderService } from "../services/purchaseOrderService";

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats State
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    received: 0,
    cancelled: 0,
  });

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    supplier: "",
    status: "",
    ordering: "newest",
  });

  // Centralized Modal States
  const [selectedOrder, setSelectedOrder] = useState(null); // For View/Details Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // For Create Modal

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await purchaseOrderService.getPurchaseOrders({
        page: currentPage,
        page_size: itemsPerPage,
        search: filters.search,
        supplier: filters.supplier,
        status: filters.status,
        ordering: filters.ordering,
      });

      const results = data.results || data;
      setPurchaseOrders(results);
      setTotalItems(data.count || results.length);

      // Compute stats client-side if not sent by backend payload
      if (data.stats) {
        setStats(data.stats);
      } else {
        setStats({
          pending: results.filter((o) => o.status?.toUpperCase() === "PENDING").length,
          approved: results.filter((o) => o.status?.toUpperCase() === "APPROVED").length,
          received: results.filter((o) => o.status?.toUpperCase() === "RECEIVED").length,
          cancelled: results.filter((o) => o.status?.toUpperCase() === "CANCELLED").length,
        });
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.detail || "Failed to load purchase orders.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Order Creation via Service
  const handleCreateOrder = async (orderData) => {
    try {
      const createdOrder = await purchaseOrderService.createPurchaseOrder(orderData);
      setIsCreateModalOpen(false);
      await fetchOrders(); // Refresh table data & stats
      return createdOrder;
    } catch (err) {
      throw err;
    }
  };

  // Handle Export Action
  const handleExportOrders = async () => {
    try {
      const blob = await purchaseOrderService.exportPurchaseOrders(filters);
      // Create downloadable link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Purchase_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  // Receive Purchase Order
  const handleReceive = async (id) => {
    try {
      const updatedOrder = await purchaseOrderService.receivePurchaseOrder(id);
      // If modal is open for this order, update selectedOrder state
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(updatedOrder);
      }
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  // Cancel Purchase Order
  const handleCancel = async (id) => {
    try {
      const updatedOrder = await purchaseOrderService.cancelPurchaseOrder(id);
      // If modal is open for this order, update selectedOrder state
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(updatedOrder);
      }
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  // Delete Purchase Order
  const handleDelete = async (id) => {
    try {
      await purchaseOrderService.deletePurchaseOrder(id);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
      }
      await fetchOrders();
    } catch (err) {
      throw err;
    }
  };

  return {
    purchaseOrders,
    loading,
    error,
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
    refreshOrders: fetchOrders,
  };
}