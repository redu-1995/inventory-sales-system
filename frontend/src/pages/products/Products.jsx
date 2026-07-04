import React, { useState } from 'react';

// Import custom hook layers
import { useProducts } from '../../hooks/useProducts';
import { useDashboard } from '../../hooks/useDashboard';

// Import API services
import { productAPI } from '../../services/productService';

// Import UI presentation layouts
import ProductStats from '../../components/products/ProductStats';
import ProductModal from '../../components/products/ProductModal';
import ProductFilters from '../../components/products/ProductFilters';
import BulkActions from '../../components/products/BulkActions';
import ProductTable from '../../components/products/ProductTable';
import Pagination from '../../components/products/Pagination';
import DeleteConfirmationModal from '../../components/products/DeleteConfirmationModal';
import ProductEditModal from '../../components/products/ProductEditModal';
import ProductImportModal from '../../components/products/ProductImportModal';  
export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState('');
  
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
    selectedRowIds = [], 
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

  // ==========================================
  // ACTION HANDLERS (EDIT & DELETE TRIGGER CONFIG)
  // ==========================================
  const handleEdit = (productId) => {
    setSelectedProductId(productId);
    setIsEditOpen(true);
  };

  const handleDeleteTrigger = (productId, productName) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName || "this product");
    setIsDeleteOpen(true);
  };

  // ==========================================
  // EXPORT & IMPORT UTILITY IMPLEMENTATIONS
  // ==========================================
  // In your Products.jsx component framework:
const handleExport = async () => {
  try {
    // 1. Package the live filter states as criteria payload parameters
    const queryFilters = {
      search: searchQuery || '',
      category: categoryFilter || '',
      brand: brandFilter || '',
      stock_status: stockStatusFilter || '',
      sort_by: sortBy || ''
    };
    
    // 2. Request the binary file stream from the backend service
    const fileBlob = await productAPI.exportProducts(queryFilters);
    
    // 3. Mount a virtual link element to trigger the download prompt smoothly
    const downloadUrl = window.URL.createObjectURL(new Blob([fileBlob]));
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    
    // Construct a descriptive filename with chronological versioning
    const timestamp = new Date().toISOString().split('T')[0];
    downloadLink.setAttribute('download', `Inventory_Export_${timestamp}.xlsx`);
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Cleanup the DOM node instantly
    downloadLink.parentNode.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Export execution failed: ", err);
    alert("System encountered an error while compiling the spreadsheet file.");
  }
};
  const handleImport = async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    try {
      await productAPI.importProducts(uploadedFile);
      alert("Product inventory bulk catalog imported successfully!");
      refreshProducts();
    } catch (err) {
      console.error("Import failure: ", err);
      alert("Failed to parse and process product catalog spreadsheet.");
    } finally {
      // Reset input element value to allow identical filenames uploaded consecutively
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-5 lg:p-6 font-sans antialiased overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-5 w-full">
        
        {/* Error Notification Banner */}
        {combinedError && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 shadow-sm">
            <strong>System Error:</strong> {combinedError.message || "An issue occurred while loading data."}
          </div>
        )}

        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your inventory products and stock information.</p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button 
              onClick={() => setShowModal(true)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors"
            >
              Add Product
            </button>
            
            {/* Hidden Input field proxy mapping custom UI elements cleanly onto native import file dialog triggers */}
            <label className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 shadow-sm transition-all cursor-pointer">
              &darr; Import
              <input 
                type="file" 
                accept=".csv, .xlsx, .xls" 
                className="hidden" 
                onChange={handleImport} 
              />
            </label>

            <button 
              onClick={handleExport}
              className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 shadow-sm transition-all"
            >
              &uarr; Export
            </button>
          </div>
        </div>

        {/* ================= CORE GRID STRUCTURE ================= */}
        <div className="grid grid-cols-1 w-full min-w-0 items-start">
          <div className="space-y-4 w-full min-w-0 overflow-hidden block">
            
            <ProductStats statistics={summary} loading={dashboardLoading} />

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

            <BulkActions selectedCount={selectedRowIds?.length || 0} onDelete={deleteSelectedProducts} />

            {/* TABLE CONTAINER CONTAINER FRAME */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full overflow-hidden">
              <div className="overflow-x-auto w-full max-w-full block">
                <ProductTable 
                  products={paginatedProducts} 
                  selectedRowIds={selectedRowIds}
                  onToggleSelectRow={toggleSelectRow}
                  onToggleSelectAll={toggleSelectAllRows}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTrigger} // Triggers confirmation dialogue safely
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

      {/* ================= MODAL LIFECYCLE DIALOGUES ================= */}
      
      {/* Creation Modal */}
      <ProductModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onRefresh={refreshProducts}
      />
      
      {/* Edit Modification Modal */}
      <ProductEditModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        productId={selectedProductId}
        onProductUpdated={refreshProducts} 
      />

      {/* Structured Delete Prompt Dialogue Container */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        productId={selectedProductId}
        productName={selectedProductName}
        onProductDeleted={refreshProducts}
      />
    </div>
  );
}