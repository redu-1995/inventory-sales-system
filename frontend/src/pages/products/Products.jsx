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
  const {
    products,
    paginatedProducts,
    // statistics,
    // searchQuery,
    // setSearchQuery,
    // categoryFilter,
    // setCategoryFilter,
    // brandFilter,
    // setBrandFilter,
    // stockStatusFilter,
    // setStockStatusFilter,
    // sortBy,
    // setSortBy,
    // selectedRowIds,
    // toggleSelectRow,
    // toggleSelectAllRows,
    // deleteSelectedProducts,
    // resetAllFilters,
    // currentPage,
    // setCurrentPage,
    // totalPages,
    // filteredCount,
    error,
  } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-5 lg:p-6 font-sans antialiased overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* ================= 1. PAGE HEADER ROW ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your inventory products and stock information.
            </p>
          </div>
                  {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-xs">
            ⚠️ Connection Error: {error}. Please verify your backend server status.
          </div>
        )}
          
          {/* Compact Action Trigger Controls */}
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <button 
              onClick={() => alert('Import action triggered')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all shadow-sm"
            >
              &darr; Import
            </button>
            <button 
              onClick={() => alert('Export action triggered')}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all shadow-sm"
            >
              &uarr; Export
            </button>
            <button 
              onClick={() => alert('Add Product modal form opener triggered')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* ================= 2. TWO-COLUMN RESPONSIVE LAYOUT GRID ================= */}
        {/* Changed to grid-cols-12 layout to give left column more room and reduce right sidebar width */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
          
          {/* LEFT OPERATIONAL WRAPPER: Takes up 9/12ths of the horizontal spacing */}
          {/* <div className="lg:col-span-9 space-y-4 min-w-0 w-full overflow-hidden"> */}
            
            {/* A. Statistics Cards Grid */}
            {/* <ProductStats statistics={statistics} /> */}

            {/* B. Search & Filtering Toolbar */}
            {/* <ProductFilters
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
            /> */}

            {/* C. Batch Processing Area */}
            {/* <BulkActions 
              selectedCount={selectedRowIds.length} 
              onDelete={deleteSelectedProducts} 
            /> */}

            {/* D. Table Frame with Overflow Constraints */}
            {/* <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
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

          </div> */}

          {/* RIGHT SIDEBAR WRAPPER: Takes up 3/12ths space with responsive wrapping */}
          <div className="lg:col-span-3 min-w-0 w-full">
            <ProductInsights products={products} />
          </div>

        </div>

      </div>
    </div>
  );
}