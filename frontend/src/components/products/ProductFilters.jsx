import React, { useState } from "react";

export default function ProductFilters({
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
  resetAllFilters,
  products = [],
  itemsPerPage = 10,
  setItemsPerPage,
  selectedCount = 0,
  onDeleteSelected = null,
  onUpdateCategory = null,
  categories = []
}) {
  const [showEntries, setShowEntries] = useState(itemsPerPage);
  const [updateCategoryValue, setUpdateCategoryValue] = useState("");

  const handleShowEntriesChange = (value) => {
    setShowEntries(value);
    if (setItemsPerPage) setItemsPerPage(value);
  };

  const isFiltered = searchQuery || categoryFilter || brandFilter || statusFilter || stockStatusFilter;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full">
      {/* Filter Row */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3 w-full">
          
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">Category</option>
            {Array.from(new Set(products.map(p => p.category_name).filter(Boolean))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>


          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Stock Status Filter */}
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">Sort</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={resetAllFilters}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}

          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={showEntries}
              onChange={(e) => handleShowEntriesChange(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Section - Delete Selected & Update Category */}
      {selectedCount > 0 && (
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm font-medium text-blue-900">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Update Category Section */}
              {onUpdateCategory && (
                <div className="flex items-center gap-2">
                  <select
                    value={updateCategoryValue}
                    onChange={(e) => setUpdateCategoryValue(e.target.value)}
                    className="bg-white border border-blue-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <option value="">Update Category</option>
                    {(categories || []).map(cat => (
                      <option key={cat.id || cat.name} value={cat.id || cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (updateCategoryValue) {
                        onUpdateCategory(updateCategoryValue);
                        setUpdateCategoryValue("");
                      }
                    }}
                    disabled={!updateCategoryValue}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Update
                  </button>
                </div>
              )}

              {/* Delete Selected Button */}
              {onDeleteSelected && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedCount} item${selectedCount !== 1 ? 's' : ''}?`)) {
                      onDeleteSelected();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}