import api from './api'; // Import your configured Axios instance

export const salesService = {
  /**
   * 1. Fetch Sales List
   * Supports optional query parameters (e.g., status, search, date filters)
   * GET /api/sales/?status=PAID&search=John
   */
  async fetchSales(params = {}) {
    const response = await api.get('/sales/sales/', { params });
    return response.data;
  },

  /**
   * Fetch Single Sale Details by ID
   * GET /api/sales/:id/
   */
  async fetchSaleById(id) {
    const response = await api.get(`/sales/sales/${id}/`);
    return response.data;
  },

  /**
   * 2. Create Sale
   * Payload format:
   * {
   *   customer: 1, // Customer ID
   *   payment_method: 'CASH', // or 'CARD', 'TRANSFER'
   *   status: 'PAID', // or 'UNPAID', 'PARTIAL'
   *   items: [
   *     { product: 10, quantity: 2 },
   *     { product: 14, quantity: 1 }
   *   ]
   * }
   * POST /api/sales/
   */
  async createSale(saleData) {
    const response = await api.post('/sales/sales/', saleData);
    return response.data;
  },

  /**
   * 3. Update Sale
   * Updates customer, payment method, or line items.
   * Modifying items automatically restores & adjusts stock on the backend.
   * PUT /api/sales/:id/ or PATCH /api/sales/:id/
   */
  async updateSale(id, saleData) {
    const response = await api.patch(`/sales/sales/${id}/`, saleData);
    return response.data;
  },

  /**
   * 4. Delete Sale
   * Deleting a sale automatically restores inventory stock on the backend.
   * DELETE /api/sales/:id/
   */
  async deleteSale(id) {
    const response = await api.delete(`/sales/sales/${id}/`);
    return response.data;
  },

  /**
   * 5. Receive Payment
   * Adds a payment record to a sale.
   * Updates sale status automatically (e.g., UNPAID -> PARTIAL -> PAID).
   * Payload format:
   * {
   *   sale: 5, // Sale ID
   *   amount: "150.00",
   *   payment_method: "CARD"
   * }
   * POST /api/payments/
   */
  async receivePayment(paymentData) {
    const response = await api.post('/sales/payments/', paymentData);
    return response.data;
  },

  /**
   * 6. Export Sales CSV
   * Triggers file download in the user's browser.
   * GET /api/sales/export/
   */
  async exportSales(filename = 'sales_report.csv') {
    const response = await api.get('/sales/sales/export/', {
      responseType: 'blob', // Crucial for receiving binary file data
    });

    // Create a temporary download link in the browser DOM
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Cleanup DOM
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default salesService;