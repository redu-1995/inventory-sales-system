import { useState, useCallback } from 'react';
import salesService from '../services/salesService';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentSale, setCurrentSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Helper to reset error state before initiating an API request
   */
  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  /**
   * 1. Fetch List of Sales
   */
  const fetchSales = useCallback(async (params = {}) => {
    startLoading();
    try {
      const data = await salesService.fetchSales(params);
      
      // Check if DRF pagination was used (data.results) or direct list (data)
      const salesList = Array.isArray(data) ? data : (data.results || []);
      
      setSales(salesList);
      return salesList;
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to fetch sales.';
      setError(errorMessage);
      setSales([]); // Fallback to empty array so .map() won't crash
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 2. Fetch Aggregated Sales Report / Analytics Stats
   */
  const fetchSalesReport = useCallback(async () => {
    try {
      const reportData = await salesService.fetchSalesReport();
      setStats(reportData);
      return reportData;
    } catch (err) {
      console.error('Failed to fetch sales report:', err);
      // Keep existing stats or set default fallback
    }
  }, []);

  /**
   * 3. Fetch Single Sale Details
   */
  const fetchSaleById = useCallback(async (id) => {
    startLoading();
    try {
      const data = await salesService.fetchSaleById(id);
      setCurrentSale(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data || `Failed to fetch sale #${id}.`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 4. Create Sale
   */
  const createSale = async (saleData) => {
    startLoading();
    try {
      const newSale = await salesService.createSale(saleData);
      setSales((prev) => [newSale, ...prev]);
      
      // Automatically refresh summary stats on change
      fetchSalesReport();
      
      return newSale;
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to create sale.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 5. Update Sale
   */
  const updateSale = async (id, saleData) => {
    startLoading();
    try {
      const updatedSale = await salesService.updateSale(id, saleData);
      setSales((prev) =>
        prev.map((sale) => (sale.id === id ? updatedSale : sale))
      );
      if (currentSale?.id === id) {
        setCurrentSale(updatedSale);
      }

      // Automatically refresh summary stats on change
      fetchSalesReport();

      return updatedSale;
    } catch (err) {
      const errorMessage = err.response?.data || `Failed to update sale #${id}.`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 6. Delete Sale
   */
  const deleteSale = async (id) => {
    startLoading();
    try {
      await salesService.deleteSale(id);
      setSales((prev) => prev.filter((sale) => sale.id !== id));
      if (currentSale?.id === id) {
        setCurrentSale(null);
      }

      // Automatically refresh summary stats on change
      fetchSalesReport();
    } catch (err) {
      const errorMessage = err.response?.data || `Failed to delete sale #${id}.`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 7. Receive Payment
   * Adds payment record & updates sale locally in state
   */
  const receivePayment = async (paymentData) => {
    startLoading();
    try {
      const newPayment = await salesService.receivePayment(paymentData);
      
      // Re-fetch affected sale or update local state to reflect new payment/status
      if (paymentData.sale) {
        const updatedSale = await salesService.fetchSaleById(paymentData.sale);
        setSales((prev) =>
          prev.map((sale) => (sale.id === paymentData.sale ? updatedSale : sale))
        );
        if (currentSale?.id === paymentData.sale) {
          setCurrentSale(updatedSale);
        }
      }

      // Refresh report stats to update pending payments & status counts
      fetchSalesReport();

      return newPayment;
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to process payment.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 8. Export Sales CSV
   */
  const exportSales = async (filename) => {
    startLoading();
    try {
      await salesService.exportSales(filename);
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to export sales CSV.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sales,
    stats,
    currentSale,
    loading,
    error,
    fetchSales,
    fetchSalesReport,
    fetchSaleById,
    createSale,
    updateSale,
    deleteSale,
    receivePayment,
    exportSales,
  };
};

export default useSales;