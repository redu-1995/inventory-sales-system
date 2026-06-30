import React from 'react';

// Import our custom state engine
import { useProducts } from '../../hooks/useProducts';

// Import UI presentation layouts
import ProductStats from '../../components/products/ProductStats';
import ProductFilters from '../../components/products/ProductFilters';
import BulkActions from '../../components/products/BulkActions';
import ProductTable from '../../components/products/ProductTable';
import Pagination from '../../components/products/Pagination';

// Import Right Side Insight Component
import ProductInsights from '../../components/products/ProductInsights';

export default function Products() {
  // Destructure state handlers out of our hook engine
  const {
    products,
    paginatedProducts,
    statistics,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
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
    filteredCount
  } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= PAGE HEADER ROW ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your inventory products and stock information.
            </p>
          </div>
          
          {/* Action Trigger Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button 
              onClick={() => alert('Import action triggered')}
              className="inline-flex items-center px-3.5 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all shadow-sm"
            >
              &darr; Import
            </button>
            <button 
              onClick={() => alert('Export action triggered')}
              className="inline-flex items-center px-3.5 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all shadow-sm"
            >
              &uarr; Export
            </button>
            <button 
              onClick={() => alert('Add Product modal form opener triggered')}
              className="inline-flex items-center px-4 py-2 border border-transparent bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* ================= STATS SECTION ================= */}
        <ProductStats statistics={statistics} />

        {/* ================= FILTERING BAR ================= */}
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          brandFilter={brandFilter}
          setBrandFilter={setBrandFilter}
          stockStatusFilter={stockStatusFilter}
          setStockStatusFilter={setStockStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetAllFilters={resetAllFilters}
          products={products}
        />

        {/* ================= TWO-COLUMN EQUAL HEIGHT SPLIT CONTAINER ================= */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          
          {/* LEFT COLUMN: CONTEXT ACTIONS, TABLE & PAGINATION */}
          <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <BulkActions 
                selectedCount={selectedRowIds.length} 
                onDelete={deleteSelectedProducts} 
              />

              <ProductTable 
                products={paginatedProducts} 
                selectedRowIds={selectedRowIds}
                onToggleSelectRow={toggleSelectRow}
                onToggleSelectAll={toggleSelectAllRows}
              />
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              filteredCount={filteredCount}
            />
          </div>

          {/* RIGHT COLUMN: REAL-TIME ANALYTICS INSIGHTS SIDEBAR */}
          <ProductInsights products={products} />

        </div>

      </div>
    </div>
  );
}