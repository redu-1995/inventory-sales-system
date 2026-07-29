import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

/**
 * CustomerFilters Component
 * Controls searching, status filtering, sorting, and resetting filters.
 */
export default function CustomerFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  ordering,
  setOrdering,
  resetFilters,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden lg:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden lg:inline">Sort By:</span>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="-created_at">Newest</option>
            <option value="created_at">Oldest</option>
            <option value="full_name">Name (A-Z)</option>
            <option value="-full_name">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        type="button"
        onClick={resetFilters}
        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}