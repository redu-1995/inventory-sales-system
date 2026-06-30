const API_URL = 'http://localhost:8000/api/products/';

export const productService = {
  async getAllProducts() {
    return new Promise((resolve) => setTimeout(resolve, 200));
  },

  async createProduct(productData) {
    console.log("POST request payload prepared for Django API:", productData);
    return new Promise((resolve) => setTimeout(resolve, 300));
  },

  async deleteBulkProducts(productIds) {
    console.log("Bulk DELETE payload ready for Django API:", productIds);
    return new Promise((resolve) => setTimeout(resolve, 300));
  }
};