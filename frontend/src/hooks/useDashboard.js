import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

export const useDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [lowStockList, setLowStockList] = useState([]);
  const [outOfStockList, setOutOfStockList] = useState([]);
  const [topMovingList, setTopMovingList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel execution matching all backend endpoints
      const [summaryRes, lowStockRes, outOfStockRes, topMovingRes] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getLowStockReport(),
        dashboardService.getOutOfStockReport(),
        dashboardService.getTopMovingReport(),
      ]);

      setSummary(summaryRes);
      setLowStockList(lowStockRes);
      setOutOfStockList(outOfStockRes);
      setTopMovingList(topMovingRes);
    } catch (err) {
      console.error("Dashboard processing error: ", err);
      setError(err.response?.data?.detail || 'Failed to capture dashboard synchronization streams.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  return {
    summary,
    lowStockList,
    outOfStockList,
    topMovingList,
    loading,
    error,
    refreshData: fetchAllDashboardData
  };
};