// src/services/inventoryService.js
import api from "./api"; // core custom Axios instance config

export const inventoryService = {
  /**
   * 1. Fetch live inventory state tracking array
   * GET /api/inventory/inventory/
   */
  async getInventory(filters = {}) {
    const response = await api.get("inventory/inventory/", { params: filters });
    return response.data;
  },

  /**
   * 2. Fetch aggregated metadata calculations for top KPI cards
   * GET /api/inventory/inventory/?summary=true
   */
  async getInventorySummary() {
    const response = await api.get("inventory/inventory/", { params: { summary: true } });
    return response.data;
  },

  /**
   * 3. Fetch entries where quantity <= reorder_level
   * GET /api/inventory/inventory/?low_stock=true
   */
  async getLowStock() {
    const response = await api.get("inventory/inventory/", { params: { low_stock: true } });
    return response.data;
  },

  /**
   * 4. Stock In operation
   * POST /api/inventory/stock-movements/
   */
  async stockIn(payload) {
    const response = await api.post("inventory/stock-movements/", {
      ...payload,
      movement_type: "IN"
    });
    return response.data;
  },

  /**
   * 5. Stock Out operation
   * POST /api/inventory/stock-movements/
   */
  async stockOut(payload) {
    const response = await api.post("inventory/stock-movements/", {
      ...payload,
      movement_type: "OUT"
    });
    return response.data;
  },

  /**
   * 6. Adjust Stock settings or safety thresholds directly
   * POST /api/inventory/stock-movements/
   */
  async adjustStock(payload) {
    const response = await api.post("inventory/stock-movements/", {
      product: payload.product,
      quantity: payload.quantity,
      movement_type: payload.movement_type // 'ADJUST'
    });
    return response.data;
  },

  /**
   * 7. Fetch active historical tracking timeline metrics of stock movements
   * GET /api/inventory/stock-movements/
   */
  async getStockMovements(filters = {}) {
    const response = await api.get("inventory/stock-movements/", { params: filters });
    return response.data;
  },

  /**
   * 8. Fetch audit activity trail 
   * GET /api/inventory/stock-movements/?ordering=-created_at
   */
  async getRecentActivity() {
    const response = await api.get("inventory/stock-movements/", { params: { ordering: "-created_at" } });
    return response.data;
  },

  /**
   * 9. Post/Create a brand-new official procurement Purchase Order request
   * POST /api/inventory/purchase-orders/
   */
  async createPurchaseOrder(payload) {
    const response = await api.post("inventory/purchase-orders/", payload);
    return response.data;
  },

  /**
   * 10. Streaming report data generation downloads
   * GET /api/inventory/exports/export-{format}/
   */
  async exportData(format) {
    const response = await api.get(`inventory/exports/export-${format}/`, {
      responseType: 'blob' 
    });
    
    const blob = new Blob([response.data], { 
      type: format === 'pdf' 
        ? 'application/pdf' 
        : (format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv') 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventory_export_${new Date().toISOString().slice(0,10)}.${format === 'excel' ? 'xlsx' : format}`);
    document.body.appendChild(link);
    link.click();                  
    link.parentNode.removeChild(link);
  },
  
  /**
   * 11. Fetch low stock alert priorities
   * GET /api/inventory/low-stock-alerts/
   */
  async getLowStockAlerts() {
    const response = await api.get("inventory/low-stock-alerts/");
    return response.data;
  },

  /**
   * 12. Creates a new Purchase Order with nested item lines.
   */
  async createPurchaseRequest(purchaseData) {
    try {
      if (!purchaseData.supplier) {
        throw new Error("Supplier is required.");
      }
      if (!purchaseData.items || purchaseData.items.length === 0) {
        throw new Error("At least one purchase item is required.");
      }

      const payload = {
        supplier: purchaseData.supplier,
        status: purchaseData.status || 'PENDING', 
        items: purchaseData.items.map(item => ({
          product: item.product,
          quantity: parseInt(item.quantity, 10),
          cost_price: parseFloat(item.cost_price).toFixed(2),
        })),
      };

      const response = await api.post('inventory/purchase-orders/', payload);
      return response.data;
    } catch (error) {
      console.error("Error in createPurchaseRequest:", error);
      throw error.response?.data || { detail: error.message || "An unexpected error occurred." };
    }
  },

  /**
   * 13. Fetch compiled system-wide analytics
   * GET /api/inventory/analytics/
   */
  async getInventoryAnalytics() {
    // Removed the leading slash to ensure correct baseURL resolution
    const response = await api.get("inventory/analytics/");
    return response.data;
  }
};

export default inventoryService;