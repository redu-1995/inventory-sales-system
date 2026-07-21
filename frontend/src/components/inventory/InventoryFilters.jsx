import React from 'react';
import { Filter, Search } from 'lucide-react';

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

  const selectClass = 'h-9 px-3 border border-slate-200 rounded-md text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <h2 className="text-lg font-bold text-slate-950">Current Inventory</h2>

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <label className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full pl-9 pr-3 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="">Category</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="">Stock Status</option>
          {renderedStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select className={selectClass} defaultValue="">
          <option value="">Warehouse</option>
          <option>Main Warehouse</option>
          <option>Store Branch</option>
        </select>

        <button
          type="button"
          className="h-9 inline-flex items-center justify-center gap-2 px-3 border border-slate-200 rounded-md bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Filter size={14} />
          Filters
        </button>
      </div>
    </div>
  );
}
