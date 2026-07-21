import api from "./api";

export const productAPI = {
  // Fetch a single product by ID
  async getProduct(id) {
    const response = await api.get(`products/products/${id}/`);
    return response.data;
  },

  // Fetch all products (with optional filter parameters: search, category, stock_status)
  async getProducts(params = {}) {
    const response = await api.get("products/products/", { params });
    return response.data;
  },

  // Fetch categories
  async getCategories() {
    const response = await api.get("products/categories/");
    return response.data;
  },

  // Fetch suppliers
  async getSuppliers() {
    const response = await api.get("products/suppliers/");
    return response.data;
  },

  // Create a new product (handles both JSON and multipart FormData for images)
  async createProduct(data) {
    const isFormData = data instanceof FormData;
    const response = await api.post("products/products/", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  // Edit/Update product (PATCH)
  async updateProduct(id, data) {
    const isFormData = data instanceof FormData;
    const response = await api.patch(`products/products/${id}/`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  // Delete product
  async deleteProduct(id) {
    const response = await api.delete(`products/products/${id}/`);
    return response.data;
  },

  // EXPORT PRODUCTS (Fixed URL path to standalone APIView endpoint)
  async exportProducts(filters = {}) {
    const response = await api.get("products/export/", {
      params: filters,
      responseType: "blob", // Returns binary blob stream for file downloading
    });
    return response.data;
  },

  // IMPORT PRODUCTS (Fixed URL path to standalone APIView endpoint)
  async importProducts(file) {
    const formData = new FormData();
    formData.append("file", file); // Key 'file' matches request.FILES.get('file') in backend

    const response = await api.post("products/import/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default productAPI;