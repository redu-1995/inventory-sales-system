import api from "./api";

export const productAPI = {
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
};