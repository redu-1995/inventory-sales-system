import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const statusLabels = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
};

export default function InventoryFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  categories = [],
  statuses = []
}) {
  const renderedStatuses = statuses.length > 0 ? statuses : [
    { value: 'IN_STOCK', label: statusLabels.IN_STOCK },
    { value: 'LOW_STOCK', label: statusLabels.LOW_STOCK },
    { value: 'OUT_OF_STOCK', label: statusLabels.OUT_OF_STOCK }
  ];

  const hasActiveFilters = Boolean(search || category || status);

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setStatus('');
  };

  const selectClass = 'h-9 px-3 border border-slate-200 rounded-lg text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors cursor-pointer';

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <h2 className="text-base font-bold text-slate-900 tracking-tight">Current Inventory</h2>

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto items-stretch sm:items-center">
        {/* Search Input */}
        <label className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full pl-9 pr-3 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors"
          />
        </label>

        {/* Category Filter */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Stock Status Filter */}
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="">All Stock Statuses</option>
          {renderedStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Reset Filters Button */}
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className={`h-9 inline-flex items-center justify-center gap-1.5 px-3 border rounded-lg text-xs font-medium transition-all ${
            hasActiveFilters
              ? 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'
              : 'border-slate-200 bg-white text-slate-400 cursor-not-allowed opacity-60'
          }`}
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}