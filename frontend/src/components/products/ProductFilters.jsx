import React from 'react';

export default function ProductFilters({
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
  resetAllFilters,
  products
}) {
  // Extract unique categories and brands from our sample data array for the dropdown options
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-3">
      
      {/* 1. Search Inputs Bar */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 2. Responsive Filters Options Tray */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:space-x-2 lg:grid-cols-none">
        
        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="block w-full sm:w-44 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Brand Dropdown */}
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="block w-full sm:w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {/* Stock Status Dropdown */}
        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="block w-full sm:w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Stock Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="block w-full sm:w-44 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="best-selling">Best Selling</option>
        </select>

        {/* Reset Button Widget */}
        {(searchQuery || categoryFilter || brandFilter || stockStatusFilter || sortBy !== 'newest') && (
          <button
            onClick={resetAllFilters}
            className="col-span-2 sm:col-span-1 px-4 py-2 border border-dashed border-rose-300 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors duration-150 flex items-center justify-center space-x-1"
          >
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}