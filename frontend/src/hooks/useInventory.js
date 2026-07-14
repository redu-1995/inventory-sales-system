import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useInventory = () => {
  // Core Inventory List and Metadata Arrays State
  const [inventory, setInventory] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  
  // KPI Metrics Calculation States
  const [summary, setSummary] = useState({
    total_stock_units: 0,
    low_stock: 0,
    out_of_stock: 0,
    inventory_value: 0
  });

  // UX Lifecycle Hooks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filtration Control Parameters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(''); // e.g. "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"
  const [warehouse, setWarehouse] = useState('');
  const [ordering, setOrdering] = useState('-last_updated');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Master Refresh Handler - Fetches fresh inventory dataset matrix
   */
  const refreshInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build dynamic filters corresponding to query params expected by Django filter backends
      const activeFilters = {
        page,
        ordering,
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        warehouse: warehouse || undefined
      };

      // 1. Fetch live list arrays
      const data = await inventoryService.getInventory(activeFilters);
      
      // If backend returns a standardized DRF paginated structure:
      if (data && data.results) {
        setInventory(data.results);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming default page size of 10
      } else if (Array.isArray(data)) {
        setInventory(data);
      }

      // 2. Fetch parallel contextual widget components data to fulfill dashboard requirements
      const [summaryData, lowStockData, movementsData, activitiesData] = await Promise.all([
        inventoryService.getInventorySummary().catch(() => null),
        inventoryService.getLowStock().catch(() => null),
        inventoryService.getStockMovements({ limit: 10 }).catch(() => null),
        inventoryService.getRecentActivity().catch(() => null)
      ]);

      // Safely apply response metrics or fall back to mock calculations if backend signals empty arrays
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

  // Auto-refresh layout automatically when active filters or pages switch bounds
  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  /**
   * Action Handler: Stock In Operation
   */
  const stockIn = async (payload) => {
    setLoading(true);
    try {
      const result = await inventoryService.stockIn(payload);
      await refreshInventory(); // Re-trigger update cascading
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
    // The fixed backend handles IN, OUT, and ADJUST uniformly via POST to /api/stock-movements/
    // payload shape expects: { product: productId, quantity: value, movement_type: 'ADJUST'|'IN'|'OUT' }
    const result = await inventoryService.adjustStock(payload);
    
    // Refresh your data tables and top navbar KPI summary blocks uniformly
    await refreshInventory();
    
    return result;
  } catch (err) {
    // Gracefully bubbling up parsed Django REST Framework structural field errors
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
  

  return {
    inventory,
    stockMovements,
    recentActivities,
    lowStockProducts,
    summary,
    loading,
    error,
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
    refreshInventory,
    stockIn,
    stockOut,
    adjustStock,
    createPurchaseOrder,
    exportReport
  };
  const [lowStockList, setLowStockList] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [alertsError, setAlertsError] = useState(null);

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

  // Fetch automatically on mount
  useEffect(() => {
    fetchLowStockAlerts();
  }, [fetchLowStockAlerts]);

  return {
    lowStockList,
    loadingAlerts,
    alertsError,
    refreshAlerts: fetchLowStockAlerts 
  };
};