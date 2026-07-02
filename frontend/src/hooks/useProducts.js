import { useState, useEffect, useCallback } from "react";
import { productAPI } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Define the fetch logic as a standalone, memoized function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear out any previous errors on manual refresh

      const data = await productAPI.getProducts();
      console.log("Products from API:", data);
      setProducts(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Call it on initial component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. Return the function as 'refreshProducts' to match your Products.jsx destructuring
  return {
    products,
    paginatedProducts: products,
    loading,
    error,
    refreshProducts: fetchProducts // <-- Fix: This property provides the callback function
  };
}