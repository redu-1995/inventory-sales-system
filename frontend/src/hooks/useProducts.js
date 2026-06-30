import { useState, useMemo } from 'react';
import { sampleProducts } from '../data/sampleProducts';

export function useProducts() {
  const [products, setProducts] = useState(sampleProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Tracking 'all', 'active', or 'inactive'
  const [stockStatusFilter, setStockStatusFilter] = useState(''); // Tracking 'In Stock', 'Low Stock', 'Out of Stock'
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. DYNAMIC SYSTEM STATISTICS COMPUTATIONS
  const statistics = useMemo(() => {
    return {
      totalProducts: products.length,
      totalCategories: new Set(products.map(p => p.category)).size,
      lowStockCount: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      outOfStockCount: products.filter(p => p.stock === 0).length,
    };
  }, [products]);

  // 2. SEARCH, FILTER, AND SORT PATTERNS
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search query resolution (using name and SKU parameters)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
      );
    }

    // Category Filter match
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Brand Filter match
    if (brandFilter) {
      result = result.filter(p => p.brand === brandFilter);
    }

    // Django Model active/inactive configuration (status BooleanField matching)
    if (statusFilter) {
      const isTrue = statusFilter === 'active';
      result = result.filter(p => p.status === isTrue);
    }

    // Stock Level UI metric filter
    if (stockStatusFilter) {
      if (stockStatusFilter === 'In Stock') {
        result = result.filter(p => p.stock > 10);
      } else if (stockStatusFilter === 'Low Stock') {
        result = result.filter(p => p.stock > 0 && p.stock <= 10);
      } else if (stockStatusFilter === 'Out of Stock') {
        result = result.filter(p => p.stock === 0);
      }
    }

    // Sorting evaluation engines using updated Django model fields
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'price-low') return parseFloat(a.selling_price) - parseFloat(b.selling_price);
      if (sortBy === 'price-high') return parseFloat(b.selling_price) - parseFloat(a.selling_price);
      if (sortBy === 'best-selling') return b.salesCount - a.salesCount;
      return 0;
    });

    return result;
  }, [products, searchQuery, categoryFilter, brandFilter, statusFilter, stockStatusFilter, sortBy]);

  // 3. PAGINATION MATH SLICE
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  // 4. ACTION INTERFACE METHODS
  const toggleSelectRow = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllRows = (currentPageIds) => {
    const allSelectedOnPage = currentPageIds.every(id => selectedRowIds.includes(id));
    if (allSelectedOnPage) {
      setSelectedRowIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedRowIds(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const deleteSelectedProducts = () => {
    setProducts(prev => prev.filter(p => !selectedRowIds.includes(p.id)));
    setSelectedRowIds([]);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setBrandFilter('');
    setStatusFilter('');
    setStockStatusFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return {
    products,
    paginatedProducts,
    statistics,
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
    toggleSelectAllRows,
    deleteSelectedProducts,
    resetAllFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredCount: filteredAndSortedProducts.length
  };
}