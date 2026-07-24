import api from "./api"; // Your custom axios wrapper (base URL typically includes /api/)

export const purchaseOrderService = {
  // Fetch paginated purchase orders with query params
  getPurchaseOrders: async (params = {}) => {
    const response = await api.get("purchase-orders/purchase-orders/", { params });
    return response.data;
  },

  // Fetch a single purchase order by ID
  getPurchaseOrder: async (id) => {
    const response = await api.get(`purchase-orders/purchase-orders/${id}/`);
    return response.data;
  },

  // Create purchase order
  createPurchaseOrder: async (data) => {
    const response = await api.post("purchase-orders/purchase-orders/", data);
    return response.data;
  },

  // Export purchase orders (e.g. CSV/Excel)
  exportPurchaseOrders: async (params = {}) => {
    const response = await api.get("purchase-orders/purchase-orders/export/", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  // Delete purchase order (Pending state only)
  deletePurchaseOrder: async (id) => {
    const response = await api.delete(`purchase-orders/purchase-orders/${id}/`);
    return response.data;
  },

  // Receive purchase order (Triggers inventory increase + StockMovement)
  receivePurchaseOrder: async (id) => {
    const response = await api.post(`purchase-orders/purchase-orders/${id}/receive/`);
    return response.data;
  },

  // Cancel purchase order
  cancelPurchaseOrder: async (id) => {
    const response = await api.post(`purchase-orders/purchase-orders/${id}/cancel/`);
    return response.data;
  },
};