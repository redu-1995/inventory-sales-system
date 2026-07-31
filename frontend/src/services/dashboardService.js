import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard/');
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/dashboard/summary/');
    return response.data;
  },

  getSalesChart: async () => {
    const response = await api.get('/dashboard/sales-chart/');
    return response.data;
  },

  getTopProducts: async () => {
    const response = await api.get('/dashboard/top-products/');
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/dashboard/low-stock/');
    return response.data;
  },

  getRecentTransactions: async () => {
    const response = await api.get('/dashboard/recent-transactions/');
    return response.data;
  },

  getInventoryOverview: async () => {
    const response = await api.get('/dashboard/inventory-summary/');
    return response.data;
  },
};

export { dashboardService };
export default dashboardService;