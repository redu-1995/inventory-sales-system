import React from 'react';
import { Plus, Download } from 'lucide-react';

/**
 * CustomerHeader Component
 * Renders the primary page title, subtitle description, and top-right action buttons.
 *
 * @param {Object} props
 * @param {Function} props.onAddCustomer - Handler for opening the Add Customer modal/drawer
 * @param {Function} props.onExport - Handler for exporting customer data (e.g., CSV/Excel)
 */
export default function CustomerHeader({ onAddCustomer, onExport }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage customer information and purchase history.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAddCustomer}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}