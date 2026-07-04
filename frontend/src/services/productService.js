import api from "./api";

export const productAPI = {
  async getProduct(id) {
    const response = await api.get(`products/products/${id}/`);
    return response.data;
  },

  async getProducts() {
    const response = await api.get("products/products/");
    return response.data;
  },

  async getCategories() {
    const response = await api.get("products/categories/");
    return response.data;
  },

  async getSuppliers() {
    const response = await api.get("products/suppliers/");
    return response.data;
  },

  async createProduct(formData) {
    const response = await api.post("products/products/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ==========================================
  // 1. EDIT PRODUCT (Optimized to PATCH)
  // ==========================================
  async updateProduct(id, formData) {
    // Using PATCH instead of PUT is standard practice for form data modifications
    // in Django REST Framework to prevent parsing/validation conflicts.
    const response = await api.patch(`products/products/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ==========================================
  // 2. DELETE PRODUCT
  // ==========================================
  async deleteProduct(id) {
    const response = await api.delete(`products/products/${id}/`);
    return response.data;
  },

  // ==========================================
  // 3. EXPORT PRODUCTS
  // ==========================================
  async exportProducts(filters = {}) {
    // CRITICAL: We pass responseType: "blob" so Axios knows to treat the 
    // binary response stream from Django as a downloadable file (CSV/Excel).
    const response = await api.get("products/products/export/", {
      params: filters,
      responseType: "blob", 
    });
    return response.data;
  },

  // ==========================================
  // 4. IMPORT PRODUCTS
  // ==========================================
  async importProducts(file) {
    const formData = new FormData();
    formData.append("file", file); // Appends the selected CSV/Excel file matching backend's expected key

    const response = await api.post("products/products/import/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default productAPI;