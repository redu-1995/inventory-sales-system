import api from './api';

export const customerService = {
  /**
   * Fetch all customers with optional query filters (search, status, ordering, page)
   * @param {Object} params - Query parameters like { search, status, ordering, page }
   */
  getCustomers: async (params = {}) => {
    const response = await api.get('/customers/customers/', { params });
    return response.data;
  },

  /**
   * Fetch a single customer by ID
   * @param {number|string} id
   */
  getCustomer: async (id) => {
    const response = await api.get(`/customers/customers/${id}/`);
    return response.data;
  },

  /**
   * Fetch aggregated customer KPI statistics
   */
  getCustomerStats: async () => {
    const response = await api.get('/customers/customers/stats/');
    return response.data;
  },

  /**
   * Create a new customer profile
   * @param {Object} customerData
   */
  createCustomer: async (customerData) => {
    const response = await api.post('/customers/customers/', customerData);
    return response.data;
  },

  /**
   * Update an existing customer profile
   * @param {number|string} id
   * @param {Object} customerData
   */
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/customers/${id}/`, customerData);
    return response.data;
  },

  /**
   * Delete a customer profile
   * @param {number|string} id
   */
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/customers/${id}/`);
    return response.data;
  },

  /**
   * Download exported customer CSV file
   */
  exportCustomers: async () => {
    const response = await api.get('/customers/customers/export/', {
      responseType: 'blob',
    });

    // Create trigger link for downloading file blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customers_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Fetch purchase history for a specific customer
   * @param {number|string} id
   */
  getCustomerSalesHistory: async (id) => {
    const response = await api.get(`/customers/customers/${id}/sales/`);
    return response.data;
  },
};

export default customerService;