// src/hooks/useReports.js
import { useState, useEffect, useCallback } from "react";
import { reportService } from "../services/reportService";

export function useReports() {
  const [summary, setSummary] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [purchaseReport, setPurchaseReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [customerReport, setCustomerReport] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [salesChart, setSalesChart] = useState({ labels: [], values: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    payment_status: "",
  });

  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        summaryRes,
        salesRes,
        purchaseRes,
        inventoryRes,
        customerRes,
        topProdRes,
        lowStockRes,
        recentTxRes,
        salesChartRes,
      ] = await Promise.all([
        reportService.getDashboardSummary(),
        reportService.getSalesReport(filters),
        reportService.getPurchaseReport(filters),
        reportService.getInventoryReport(),
        reportService.getCustomerReport(),
        reportService.getTopProducts(),
        reportService.getLowStock(),
        reportService.getRecentTransactions(),
        reportService.getSalesChart(),
      ]);

      setSummary(summaryRes);
      setSalesReport(salesRes);
      setPurchaseReport(purchaseRes);
      setInventoryReport(inventoryRes);
      setCustomerReport(customerRes);
      setTopProducts(topProdRes);
      setLowStock(lowStockRes);
      setRecentTransactions(recentTxRes);
      setSalesChart(salesChartRes);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError("Failed to fetch reporting analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  const handleExport = async (type, format) => {
    try {
      await reportService.exportReport(type, format);
    } catch (err) {
      console.error(`Export ${type} failed:`, err);
    }
  };

  return {
    summary,
    salesReport,
    purchaseReport,
    inventoryReport,
    customerReport,
    topProducts,
    lowStock,
    recentTransactions,
    salesChart,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchAllReports,
    handleExport,
  };
}