import { useState, useEffect, useCallback } from "react";
import { purchaseOrderService } from "../services/purchaseOrderService";
import { productAPI } from "../services/productService"; 

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
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
    product: "",
    status: "",
    ordering: "newest",
  });

  // Centralized Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch Dropdown Options on Mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        // Fetch products via productAPI
        if (productAPI?.getProducts) {
          const prodData = await productAPI.getProducts();
          const prodList = Array.isArray(prodData) ? prodData : prodData?.results || [];
          setProducts(prodList);
        }

        // Fetch suppliers if available on productAPI or purchaseOrderService
        if (productAPI?.getSuppliers) {
          const suppData = await productAPI.getSuppliers();
          setSuppliers(Array.isArray(suppData) ? suppData : suppData?.results || []);
        } else if (purchaseOrderService?.getSuppliers) {
          const suppData = await purchaseOrderService.getSuppliers();
          setSuppliers(Array.isArray(suppData) ? suppData : suppData?.results || []);
        }
      } catch (err) {
        console.error("Error fetching dropdown values:", err);
      }
    };

    fetchDropdowns();
  }, []);

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
        product: filters.product,
        status: filters.status,
        ordering: filters.ordering,
      });

      const results = Array.isArray(data) ? data : data?.results || [];
      setPurchaseOrders(results);
      setTotalItems(data?.count || results.length);

      // Compute stats
      if (data?.stats) {
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

  // Reset to Page 1 on Filter Changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Actions
  const handleCreateOrder = async (orderData) => {
    const createdOrder = await purchaseOrderService.createPurchaseOrder(orderData);
    setIsCreateModalOpen(false);
    await fetchOrders();
    return createdOrder;
  };

  const handleExportOrders = async () => {
    try {
      const blob = await purchaseOrderService.exportPurchaseOrders(filters);
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

  const handleReceive = async (id) => {
    const updatedOrder = await purchaseOrderService.receivePurchaseOrder(id);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(updatedOrder);
    }
    await fetchOrders();
  };

  const handleCancel = async (id) => {
    const updatedOrder = await purchaseOrderService.cancelPurchaseOrder(id);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(updatedOrder);
    }
    await fetchOrders();
  };

  const handleDelete = async (id) => {
    await purchaseOrderService.deletePurchaseOrder(id);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(null);
    }
    await fetchOrders();
  };

  return {
    purchaseOrders,
    suppliers,
    products,
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