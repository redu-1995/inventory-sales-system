import React from "react";
import { Search, RotateCcw } from "lucide-react";

export default function PurchaseOrderFilters({
  filters,
  setFilters,
  suppliers = [],
  products = [], 
  onReset,
}) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search PO number, supplier..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Suppliers Dropdown */}
        <select
          value={filters.supplier || ""}
          onChange={(e) => handleFilterChange("supplier", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Suppliers</option>
          {suppliers.map((sup, idx) => (
            <option key={sup.id || idx} value={sup.id || sup}>
              {sup.name || sup}
            </option>
          ))}
        </select>

        {/* 👈 2. NEW: Products Dropdown */}
        <select
          value={filters.product || ""}
          onChange={(e) => handleFilterChange("product", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Products</option>
          {products.map((prod, idx) => (
            <option key={prod.id || idx} value={prod.id || prod}>
              {prod.name || prod.title || prod}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={filters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Received">Received</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          value={filters.ordering || "newest"}
          onChange={(e) => handleFilterChange("ordering", e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Highest Amount</option>
          <option value="amount_low">Lowest Amount</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
      >
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  );
}