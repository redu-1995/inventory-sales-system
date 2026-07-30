// src/services/reportService.js
import api from "./api"; // Your configured Axios instance

export const reportService = {
  getDashboardSummary: async () => {
    const response = await api.get("/reports/dashboard-summary/");
    return response.data;
  },

  getSalesReport: async (filters = {}) => {
    const response = await api.get("/reports/sales/", { params: filters });
    return response.data;
  },

  getPurchaseReport: async (filters = {}) => {
    const response = await api.get("/reports/purchases/", { params: filters });
    return response.data;
  },

  getInventoryReport: async () => {
    const response = await api.get("/reports/inventory/");
    return response.data;
  },

  getCustomerReport: async () => {
    const response = await api.get("/reports/customers/");
    return response.data;
  },

  getTopProducts: async () => {
    const response = await api.get("/reports/top-products/");
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get("/reports/low-stock/");
    return response.data;
  },

  getRecentTransactions: async () => {
    const response = await api.get("/reports/recent-transactions/");
    return response.data;
  },

  getSalesChart: async () => {
    const response = await api.get("/reports/sales-chart/");
    return response.data;
  },

  exportReport: async (type, format = "excel") => {
  const response = await api.get(`/reports/export/${type}/`, {
    params: { file_format: format },
    responseType: "blob",
  });

  // Explicitly set the MIME type so Excel can parse the binary data
  const mimeType = format === "excel"
    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    : "text/csv";

  const blob = new Blob([response.data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${type}_report.${format === "excel" ? "xlsx" : "csv"}`);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);
},
};