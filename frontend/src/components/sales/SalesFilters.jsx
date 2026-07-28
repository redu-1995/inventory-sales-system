import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const SalesFilters = ({ filters, onFilterChange, onResetFilters }) => {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Search Bar & Filter Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full lg:w-auto flex-1">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order ID, customer..."
              value={filters?.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
            />
          </div>

          {/* Payment Status Filter */}
          <select
            value={filters?.status || 'All'}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="All">All Payment Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={filters?.paymentMethod || 'All'}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="All">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
          </select>

          {/* Date Picker Filter */}
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={filters?.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* Right Side: Reset Action */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SalesFilters;