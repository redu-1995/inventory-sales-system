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
  
  const ITEMS_PER_PAGE = 10; // Set standard datagrid page sizes

  // Fetch logic from your Django backend API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getProducts();
      
      // Handle instances where data comes nested in an results array or flat directly
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
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAllRows = useCallback((paginatedItems) => {
    const paginatedIds = paginatedItems.map(p => p.id);
    const allSelected = paginatedIds.every(id => selectedRowIds.includes(id));
    
    if (allSelected) {
      // Uncheck only those on the active page view
      setSelectedRowIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    } else {
      // Add missing IDs cleanly without breaking duplicates
      setSelectedRowIds(prev => Array.from(new Set([...prev, ...paginatedIds])));
    }
  }, [selectedRowIds]);

  const deleteSelectedProducts = useCallback(async () => {
    try {
      if (!selectedRowIds || selectedRowIds.length === 0) return;

      // Delete each selected product in parallel and wait for completion
      await Promise.all(
        selectedRowIds.map((id) => productAPI.deleteProduct(id).catch(err => {
          console.error(`Failed to delete product ${id}:`, err);
        }))
      );

      // Refresh after deletions and clear selection
      await fetchProducts(); // Force a fresh state reconciliation loop
      setSelectedRowIds([]);
    } catch (err) {
      console.error("Bulk processing dropped:", err);
    }
  }, [selectedRowIds, fetchProducts]);


const filteredProducts = useMemo(() => {
  return products.filter(product => {
    if (!product) return false;

    // 1. Search filter normalization
    const name = product.name?.toLowerCase() || '';
    const sku = product.sku?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    const matchesSearch = name.includes(query) || sku.includes(query);

    // 2. Dropdown category & brand text mappings
    const prodCategory = product.category_name || '';
    const prodBrand = typeof product.brand === 'object' ? product.brand?.name : product.brand;

    const matchesCategory = !categoryFilter || prodCategory === categoryFilter;
    const matchesBrand = !brandFilter || prodBrand === brandFilter;

    // 3. Status filter (Active/Inactive)
    let matchesStatus = true;
    if (statusFilter) {
      const productStatus = String(product.status).toLowerCase();
      if (statusFilter === "true") {
        matchesStatus = productStatus === "true" || product.status === true;
      } else if (statusFilter === "false") {
        matchesStatus = productStatus === "false" || product.status === false;
      }
    }

    // ================= 4. SYNCED STOCK STATUS ENGINE =================
    // Calculate stock status based on inventory quantity, not product status
    let stockStatusText = "In Stock";
    const quantity = product.quantity || product.inventory?.quantity || 0;
    const reorderLevel = product.inventory?.reorder_level || 10;

    // Determine stock status based on actual quantity
    if (quantity === 0) {
      stockStatusText = "Out of Stock";
    } else if (quantity <= reorderLevel) {
      stockStatusText = "Low Stock";
    } else {
      stockStatusText = "In Stock";
    }

    // Direct string match against your dropdown choices ("In Stock", "Out of Stock", "Low Stock")
    const matchesStock = !stockStatusFilter || stockStatusText === stockStatusFilter;

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesStock;
  }).sort((a, b) => {
    if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === "price-low") return (a.selling_price || 0) - (b.selling_price || 0);
    if (sortBy === "price-high") return (b.selling_price || 0) - (a.selling_price || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });
}, [products, searchQuery, categoryFilter, brandFilter, statusFilter, stockStatusFilter, sortBy]);

  // ================= CLIENT PAGINATION CALCULATION =================
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  
  // Safely adjust out-of-bounds current pages when filtering shrinks list sizes
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedProducts = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, activePage]);

  // ================= OBJECT LAYER RECONCILIATION =================
  return {
    products,                         // Global list data array
    paginatedProducts,                 // Active chunk array fed into tables
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
    refreshProducts: fetchProducts
  };
}