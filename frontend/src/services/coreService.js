import api from "./api";

export const coreService = {
  /**
   * Performs global search across multiple domain endpoints
   * @param {string} query Search keyword
   */
  search: async (query) => {
    const response = await api.get(`/core/search/`, {
      params: { q: query },
    });
    return response.data;
  },
};