import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getDashboardData();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData: data,
    summary: data ? {
      revenueToday: data.revenue_today,
      todaySalesCount: data.today_sales_count,
      inventoryValue: data.inventory_value,
      totalProducts: data.total_products,
      totalCustomers: data.total_customers,
      lowStockCount: data.low_stock_count,
    } : null,
    salesChart: data?.sales_chart || { labels: [], values: [] },
    lowStock: data?.low_stock_items || [],
    recentSales: data?.recent_sales || [],
    recentPurchaseOrders: data?.recent_purchase_orders || [],
    topProducts: data?.top_products || [],
    paymentSummary: data?.payment_summary || { paid: 0, partial: 0, unpaid: 0 },
    inventorySummary: data?.inventory_summary || { in_stock: 0, low_stock: 0, out_of_stock: 0 },
    recentActivity: data?.recent_activity || [],
    loading,
    error,
    refresh: fetchDashboardData,
  };
};