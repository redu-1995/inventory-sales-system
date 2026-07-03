import React from 'react';
import { useState } from 'react';

// Import custom hook layers
import { useProducts } from '../../hooks/useProducts';
import {useDashboard} from '../../hooks/useDashboard';

// Import API services
import { productAPI } from '../../services/productService';

// Import UI presentation layouts
import ProductStats from '../../components/products/ProductStats';
import ProductModal from '../../components/products/ProductModal';
import ProductFilters from '../../components/products/ProductFilters';
import BulkActions from '../../components/products/BulkActions';
import ProductTable from '../../components/products/ProductTable';
import Pagination from '../../components/products/Pagination';

export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // 1. Pull core data structure & state metrics from useProducts
  const {
    products,
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
    selectedRowIds = [], // Fallback array safely set
    toggleSelectRow,
    toggleSelectAllRows,
    deleteSelectedProducts,
    resetAllFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredCount,
    error: productError,
    loading: productLoading,
    refreshProducts
  } = useProducts();

  // 2. Fetch cross-module statistics safely from useDashboard using unique aliases
  const { 
    summary, 
    loading: dashboardLoading, 
    error: dashboardError 
  } = useDashboard();

  // Aggregate errors safely to display inside the warning template
  const combinedError = productError || dashboardError;

  // Handle edit action
  const handleEdit = (productId) => {
    setEditingProductId(productId);
    setShowModal(true);
  };

  // Handle delete action
  const handleDelete = async (productId) => {
    try {
      // Implement delete API call here
      await productAPI.deleteProduct(productId);
      refreshProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

 return (
  <div className="min-h-screen bg-gray-50/50 p-3 sm:p-5 lg:p-6 font-sans antialiased overflow-x-hidden">
    <div className="max-w-7xl mx-auto space-y-5 w-full">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your inventory products and stock information.</p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors">Add Product</button>
          <button className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 shadow-sm transition-all">&darr; Import</button>
          <button className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 shadow-sm transition-all">&uarr; Export</button>
          
        </div>
      </div>

      {/* ================= CORE GRID STRUCTURE ================= */}
      <div className="grid grid-cols-1 w-full min-w-0 items-start">
        
        {/* MAIN WORKSPACE DATA CONTAINER (Full Width) */}
        <div className="space-y-4 w-full min-w-0 overflow-hidden block">
          
          <ProductStats statistics={summary} loading={dashboardLoading} />

          <ProductFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            stockStatusFilter={stockStatusFilter}
            setStockStatusFilter={setStockStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resetAllFilters={resetAllFilters}
            products={products}
          />

          <BulkActions selectedCount={selectedRowIds?.length || 0} onDelete={deleteSelectedProducts} />

          {/* TABLE PLATFORM GRID CONTAINER FRAME */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full overflow-hidden">
            <div className="overflow-x-auto w-full max-w-full block">
              <ProductTable 
                products={paginatedProducts} 
                selectedRowIds={selectedRowIds}
                onToggleSelectRow={toggleSelectRow}
                onToggleSelectAll={toggleSelectAllRows}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={productLoading}
              />
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              filteredCount={filteredCount}
            />
          </div>
        </div>

      </div>

    </div>

    {/* Product Modal */}
    <ProductModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)}
      onRefresh={refreshProducts}
    />
  </div>
);
}