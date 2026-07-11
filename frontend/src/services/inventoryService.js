// src/services/inventoryService.js
import api from "./api"; // Your core custom Axios instance config

export const inventoryService = {
  /**
   * 1. Fetch live inventory state tracking array
   * GET /api/inventory/inventory/
   * Pass custom flags as query parameters so your backend filters or pagination hooks work seamlessly
   */
  async getInventory(filters = {}) {
    const response = await api.get("inventory/inventory/", { params: filters });
    return response.data;
  },

  /**
   * 2. Fetch aggregated metadata calculations for top KPI cards
   * GET /api/inventory/inventory/?summary=true
   * Handled by appending a query flag, or calculated on the frontend from the list data
   */
  async getInventorySummary() {
    const response = await api.get("inventory/inventory/", { params: { summary: true } });
    return response.data;
  },

  /**
   * 3. Fetch entries where quantity <= minimum_stock_level
   * GET /api/inventory/inventory/?low_stock=true
   */
  async getLowStock() {
    const response = await api.get("inventory/inventory/", { params: { low_stock: true } });
    return response.data;
  },

  /**
   * 4. Stock In operation
   * POST /api/inventory/stock-movements/
   * Maps directly into your StockMovementViewSet. The view automatically hooks up self.request.user.
   * @param {Object} payload - { product: number, quantity: number, movement_type: "IN", reference: string }
   */
  async stockIn(payload) {
    const response = await api.post("inventory/stock-movements/", {
      ...payload,
      movement_type: "IN" // Forces type flag boundary
    });
    return response.data;
  },

  /**
   * 5. Stock Out operation
   * POST /api/inventory/stock-movements/
   * Maps straight into StockMovementViewSet.
   * @param {Object} payload - { product: number, quantity: number, movement_type: "OUT", reference: string }
   */
  async stockOut(payload) {
    const response = await api.post("inventory/stock-movements/", {
      ...payload,
      movement_type: "OUT" // Forces type flag boundary
    });
    return response.data;
  },

  /**
   * 6. Adjust Stock settings or safety thresholds directly
   * PATCH /api/inventory/inventory/{id}/
   * Updates an entry inside your baseline InventoryViewSet route loop.
   * @param {number} inventoryId - DB Primary Key identifier
   * @param {Object} payload - { quantity: number, minimum_stock_level: number }
   */
/**
   * 6. Adjust Stock settings or safety thresholds directly
   * POST inventory/stock-movements/
   * Maps straight into StockMovementViewSet using the configured api instance.
   * @param {Object} payload - { product: number, quantity: number, movement_type: string }
   */
  async adjustStock(payload) {
    // We use the exact same 'api' instance and endpoint pattern as stockIn/stockOut
    const response = await api.post("inventory/stock-movements/", {
      product: payload.product,           // Expects integer Product ID
      quantity: payload.quantity,         // Count value input from forms
      movement_type: payload.movement_type // 'ADJUST'
    });
    
    return response.data;
  },

  /**
   * 7. Fetch active historical tracking timeline metrics of stock movements
   * GET /api/inventory/stock-movements/
   * Maps cleanly to your StockMovementViewSet query listings.
   */
  async getStockMovements(filters = {}) {
    const response = await api.get("inventory/stock-movements/", { params: filters });
    return response.data;
  },

  /**
   * 8. Fetch audit activity trail 
   * GET /api/inventory/stock-movements/?limit=10
   * Reuses your StockMovementViewSet log records sorted by date descending.
   */
  async getRecentActivity() {
    const response = await api.get("inventory/stock-movements/", { params: { ordering: "-created_at" } });
    return response.data;
  },

  /**
   * 9. Post/Create a brand-new official procurement Purchase Order request
   * POST /api/inventory/purchase-orders/
   * Maps straight into your PurchaseOrderViewSet container.
   * @param {Object} payload - { supplier: number, status: string }
   */
  async createPurchaseOrder(payload) {
    const response = await api.post("inventory/purchase-orders/", payload);
    return response.data;
  },

  /**
   * 10. Streaming report data generation downloads
   * GET /api/inventory/inventory/export/ or calculated client-side
   */
  async exportInventory(filters = {}) {
    const response = await api.get("inventory/inventory/", {
      params: { ...filters, export: "excel" },
      responseType: "blob", 
    });
    return response.data;
  }
};

export default inventoryService;