import { useState, useEffect, useCallback, useMemo } from "react";
import { productAPI } from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FILTER & PAGINATION STATES =================
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch logic from your Django backend API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getProducts();
      
      const rawProducts = Array.isArray(data) ? data : data?.results || [];
      setProducts(rawProducts);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || 'Failed to sync with product database registries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ================= DYNAMIC STATISTICS ENGINE =================
  const statistics = useMemo(() => {
    if (!products.length) {
      return { total_products: 0, total_categories: 0, low_stock: 0, out_of_stock: 0 };
    }

    // 1. Total Products
    const total_products = products.length;

    // 2. Count Unique Categories (handles string names or category objects)
    const uniqueCategories = new Set(
      products
        .map((p) => p.category_name || (typeof p.category === "object" ? p.category?.name : null))
        .filter(Boolean)
    );
    const total_categories = uniqueCategories.size;

    let low_stock = 0;
    let out_of_stock = 0;

    // 3. Stock Level Aggregation based on product properties
    products.forEach((product) => {
      const qty = product.quantity ?? product.inventory?.quantity ?? 0;
      const reorderLevel = product.reorder_level ?? product.inventory?.reorder_level ?? 10;

      if (qty === 0) {
        out_of_stock += 1;
      } else if (qty <= reorderLevel) {
        low_stock += 1;
      }
    });

    return {
      total_products,
      total_categories,
      low_stock,
      out_of_stock,
    };
  }, [products]);

  // ================= RESET STATE TRIGGER =================
  const resetAllFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("");
    setBrandFilter("");
    setStatusFilter("");
    setStockStatusFilter("");
    setSortBy("newest");
    setCurrentPage(1);
    setSelectedRowIds([]);
  }, []);

  // ================= BATCH PROCESSING ROW SELECTIONS =================
  const toggleSelectRow = useCallback((id) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAllRows = useCallback(
    (paginatedItems) => {
      const paginatedIds = paginatedItems.map((p) => p.id);
      const allSelected = paginatedIds.every((id) => selectedRowIds.includes(id));

      if (allSelected) {
        setSelectedRowIds((prev) => prev.filter((id) => !paginatedIds.includes(id)));
      } else {
        setSelectedRowIds((prev) => Array.from(new Set([...prev, ...paginatedIds])));
      }
    },
    [selectedRowIds]
  );

  const deleteSelectedProducts = useCallback(async () => {
    try {
      if (!selectedRowIds || selectedRowIds.length === 0) return;

      await Promise.all(
        selectedRowIds.map((id) =>
          productAPI.deleteProduct(id).catch((err) => {
            console.error(`Failed to delete product ${id}:`, err);
          })
        )
      );

      await fetchProducts();
      setSelectedRowIds([]);
    } catch (err) {
      console.error("Bulk processing dropped:", err);
    }
  }, [selectedRowIds, fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product) return false;

        const name = product.name?.toLowerCase() || "";
        const sku = product.sku?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        const matchesSearch = name.includes(query) || sku.includes(query);

        const prodCategory = product.category_name || "";
        const prodBrand =
          typeof product.brand === "object" ? product.brand?.name : product.brand;

        const matchesCategory = !categoryFilter || prodCategory === categoryFilter;
        const matchesBrand = !brandFilter || prodBrand === brandFilter;

        let matchesStatus = true;
        if (statusFilter) {
          const productStatus = String(product.status).toLowerCase();
          if (statusFilter === "true") {
            matchesStatus = productStatus === "true" || product.status === true;
          } else if (statusFilter === "false") {
            matchesStatus = productStatus === "false" || product.status === false;
          }
        }

        let stockStatusText = "In Stock";
        const quantity = product.quantity ?? product.inventory?.quantity ?? 0;
        const reorderLevel = product.reorder_level ?? product.inventory?.reorder_level ?? 10;

        if (quantity === 0) {
          stockStatusText = "Out of Stock";
        } else if (quantity <= reorderLevel) {
          stockStatusText = "Low Stock";
        } else {
          stockStatusText = "In Stock";
        }

        const matchesStock =
          !stockStatusFilter || stockStatusText === stockStatusFilter;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesBrand &&
          matchesStatus &&
          matchesStock
        );
      })
      .sort((a, b) => {
        if (sortBy === "oldest")
          return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === "price-low")
          return (a.selling_price || 0) - (b.selling_price || 0);
        if (sortBy === "price-high")
          return (b.selling_price || 0) - (a.selling_price || 0);
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [
    products,
    searchQuery,
    categoryFilter,
    brandFilter,
    statusFilter,
    stockStatusFilter,
    sortBy,
  ]);

  // ================= CLIENT PAGINATION CALCULATION =================
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedProducts = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, activePage, itemsPerPage]);

  // ================= RETURN HOOK INTERFACE =================
  return {
    products,
    statistics, // Combined live stats payload
    paginatedProducts,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    statusFilter,
    setStatusFilter,
    stockStatusFilter,
    setStockStatusFilter,
    sortBy,
    setSortBy,
    selectedRowIds,
    toggleSelectRow,
    toggleSelectAllRows: () => toggleSelectAllRows(paginatedProducts),
    deleteSelectedProducts,
    resetAllFilters,
    currentPage: activePage,
    setCurrentPage,
    totalPages,
    filteredCount: filteredProducts.length,
    loading,
    error,
    refreshProducts: fetchProducts,
    itemsPerPage,
    setItemsPerPage,
  };
}