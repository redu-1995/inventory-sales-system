import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useInventory = () => {
  // --- 1. CORE STATE ---
  const [inventory, setInventory] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [lowStockList, setLowStockList] = useState([]); // Moved up
  
  // KPI Metrics Calculation States
  const [summary, setSummary] = useState({
    total_stock_units: 0,
    low_stock: 0,
    out_of_stock: 0,
    inventory_value: 0
  });

  // UX Lifecycle Hooks
  const [loading, setLoading] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false); // Moved up
  const [error, setError] = useState(null);
  const [alertsError, setAlertsError] = useState(null); // Moved up
  const [success, setSuccess] = useState(false);

  // Search & Filtration Control Parameters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(''); // e.g. "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"
  const [warehouse, setWarehouse] = useState('');
  const [ordering, setOrdering] = useState('-last_updated');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- 2. CALLBACKS AND OPERATIONS ---

  /**
   * Master Refresh Handler - Fetches fresh inventory dataset matrix
   */
  const refreshInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = {
        page,
        ordering,
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        warehouse: warehouse || undefined
      };

      const data = await inventoryService.getInventory(activeFilters);
      
      if (data && data.results) {
        setInventory(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      } else if (Array.isArray(data)) {
        setInventory(data);
      }

      const [summaryData, lowStockData, movementsData, activitiesData] = await Promise.all([
        inventoryService.getInventorySummary().catch(() => null),
        inventoryService.getLowStock().catch(() => null),
        inventoryService.getStockMovements({ limit: 10 }).catch(() => null),
        inventoryService.getRecentActivity().catch(() => null)
      ]);

      if (summaryData) setSummary(summaryData);
      if (lowStockData) setLowStockProducts(lowStockData.results || lowStockData);
      if (movementsData) setStockMovements(movementsData.results || movementsData);
      if (activitiesData) setRecentActivities(activitiesData.results || activitiesData);

    } catch (err) {
      console.error("Failed fetching complete inventory cluster states:", err);
      setError(err.response?.data?.detail || "An unexpected error occurred while fetching inventory records.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, warehouse, ordering]);

  /**
   * Fetch Low Stock Alert Records
   */
  const fetchLowStockAlerts = useCallback(async () => {
    try {
      setLoadingAlerts(true);
      const data = await inventoryService.getLowStockAlerts();
      setLowStockList(data);
      setAlertsError(null);
    } catch (err) {
      console.error("Error fetching stock alert records:", err);
      setAlertsError("Failed to fetch urgent stock alerts.");
    } finally {
      setLoadingAlerts(false);
    }
  }, []);

  /**
   * Action Handler: Stock In Operation
   */
  const stockIn = async (payload) => {
    setLoading(true);
    try {
      const result = await inventoryService.stockIn(payload);
      await refreshInventory();
      return result;
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action Handler: Stock Out Operation
   */
  const stockOut = async (payload) => {
    setLoading(true);
    try {
      const result = await inventoryService.stockOut(payload);
      await refreshInventory();
      return result;
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action Handler: Adjust/Patch explicit stock properties manually
   */
  const adjustStock = async (payload) => {
    setLoading(true);
    try {
      const result = await inventoryService.adjustStock(payload);
      await refreshInventory();
      return result;
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action Handler: Process automated supplier procurement order
   */
  const createPurchaseOrder = async (payload) => {
    setLoading(true);
    try {
      return await inventoryService.createPurchaseOrder(payload);
    } catch (err) {
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Action Handler: Submits a purchase order request to the backend.
   */
  const createPurchaseRequest = useCallback(async (purchaseData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await inventoryService.createPurchaseRequest(purchaseData);
      setSuccess(true);
      return data;
    } catch (err) {
      const errorMsg = err.detail || err || "Failed to submit purchase request.";
      setError(errorMsg);
      setSuccess(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Action Handler: Handle streaming Excel downloads directly
   */
  const exportReport = async () => {
    try {
      const blob = await inventoryService.exportInventory({ search, category, status });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Excel Report streaming generation failure:", err);
    }
  };

  /**
   * Resets the status states of the hook (useful when closing modals or changing forms)
   */
  const resetStatus = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  // --- 3. LIFECYCLE EFFECTS ---
  
  // Auto-refresh layout automatically when active filters or pages switch bounds
  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  // Fetch alerts automatically on mount
  useEffect(() => {
    fetchLowStockAlerts();
  }, [fetchLowStockAlerts]);


  // --- 4. SINGLE UNIFIED EXPORT RETURN ---
  return {
    // Inventory Data & Summary States
    inventory,
    stockMovements,
    recentActivities,
    lowStockProducts,
    summary,
    
    // Alerts states
    lowStockList,
    loadingAlerts,
    alertsError,
    refreshAlerts: fetchLowStockAlerts,

    // UX States
    loading,
    error,
    success,

    // Controls
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    warehouse,
    setWarehouse,
    ordering,
    setOrdering,
    page,
    setPage,
    totalPages,

    // Core Actions
    refreshInventory,
    stockIn,
    stockOut,
    adjustStock,
    createPurchaseOrder,
    createPurchaseRequest, // Now visible!
    exportReport,
    resetStatus           // Now visible!
  };
};