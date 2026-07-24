// src/components/purchaseOrders/PurchaseOrderPagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PurchaseOrderPagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems = 0,
}) {
  // Calculate total pages safely
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Calculate entry range for display (e.g., "Showing 1-5 of 8")
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle Page Change & Prevent Out-of-Bounds
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate Page Numbers Array
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 ${
            currentPage === i
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 border border-transparent"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Range Indicator */}
      <div className="text-xs text-gray-500 font-medium">
        Showing <span className="font-semibold text-gray-800">{startItem}–{endItem}</span> of{" "}
        <span className="font-semibold text-gray-800">{totalItems}</span> purchase orders
      </div>

      {/* Right: Controls & Page Numbers */}
      <div className="flex items-center gap-6">
        {/* Entries Per Page Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page whenever page size changes
            }}
            className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-xs text-gray-500">per page</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">{renderPageNumbers()}</div>

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems === 0}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}