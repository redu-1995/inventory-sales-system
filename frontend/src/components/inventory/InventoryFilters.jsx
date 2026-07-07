import React from 'react';

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

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
      <input
        type="text"
        placeholder="Search inventory by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="">All Statuses</option>
          {renderedStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}