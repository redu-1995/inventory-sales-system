import api from './api';

const dashboardService = {
  // GET /api/dashboard/
  getDashboardSummary: async () => {
    const response = await api.get('/core/dashboard/');
    return response.data;
  },

  // GET /api/reports/low-stock/
  getLowStockReport: async () => {
    const response = await api.get('/core/reports/low-stock/');
    return response.data;
  },

  // GET /api/reports/out-of-stock/
  getOutOfStockReport: async () => {
    const response = await api.get('/core/reports/out-of-stock/');
    return response.data;
  },

  // GET /api/reports/top-moving/
  getTopMovingReport: async () => {
    const response = await api.get('/core/reports/top-moving/');
    return response.data;
  }
};

export default dashboardService;