import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Fetch customer list with current parameters
   */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        ordering: ordering,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const data = await customerService.getCustomers(params);

      // Handles both DRF Paginated ({ results: [], count: 10 }) and Unpaginated Array responses
      if (Array.isArray(data)) {
        setCustomers(data);
        setTotalCount(data.length);
      } else if (data.results) {
        setCustomers(data.results);
        setTotalCount(data.count || data.results.length);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError(err?.response?.data?.detail || 'Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, ordering]);

  /**
   * Fetch top KPI statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await customerService.getCustomerStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch customer stats:', err);
    }
  }, []);

  /**
   * Refresh trigger
   */
  const refreshCustomers = useCallback(() => {
    fetchCustomers();
    fetchStats();
  }, [fetchCustomers, fetchStats]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, ordering]);

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setOrdering('-created_at');
    setCurrentPage(1);
  };

  /**
   * Create Customer wrapper
   */
  const createCustomer = async (formData) => {
    try {
      const newCustomer = await customerService.createCustomer(formData);
      refreshCustomers();
      return newCustomer;
    } catch (err) {
      throw err?.response?.data || err;
    }
  };

  /**
   * Update Customer wrapper
   */
  const updateCustomer = async (id, formData) => {
    try {
      const updated = await customerService.updateCustomer(id, formData);
      refreshCustomers();
      return updated;
    } catch (err) {
      throw err?.response?.data || err;
    }
  };

  /**
   * Delete Customer wrapper
   */
  const deleteCustomer = async (id) => {
    try {
      await customerService.deleteCustomer(id);
      refreshCustomers();
    } catch (err) {
      throw err?.response?.data || err;
    }
  };

  return {
    // Data
    customers,
    stats,
    loading,
    error,
    totalCount,

    // Actions
    refreshCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    exportCustomers: customerService.exportCustomers,
    resetFilters,

    // Search State
    searchQuery,
    setSearchQuery,

    // Filter State
    statusFilter,
    setStatusFilter,

    // Ordering State
    ordering,
    setOrdering,

    // Pagination State
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
  };
}

export default useCustomers;