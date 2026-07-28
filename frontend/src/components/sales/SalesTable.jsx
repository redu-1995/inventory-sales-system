import React, { useState } from 'react';
import SalesRow from './SalesRow';
import { PackageOpen, RefreshCw, Download, Trash2 } from 'lucide-react';

// Sub-component: Loading Skeleton
const LoadingSkeleton = () => (
  <div className="p-6 space-y-4 animate-pulse bg-white rounded-xl border border-gray-200">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between space-x-4">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);

// Sub-component: Empty State
const EmptyState = ({ onResetFilters }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-gray-200 my-4">
    <div className="p-4 bg-blue-50 rounded-full text-blue-500 mb-4">
      <PackageOpen className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">No sales records found</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-6">
      We couldn't find any sales matching your current filter criteria or search query.
    </p>
    {onResetFilters && (
      <button
        onClick={onResetFilters}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset Filters
      </button>
    )}
  </div>
);

const SalesTable = ({
  sales = [],
  loading = false,
  error = null,
  onViewSale = () => {},
  onPrintInvoice = () => {},
  onResetFilters,
  onDeleteSale,
  onExportSales
}) => {
  // Local state for row selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Safely extract array out of sales (handles DRF paginated object vs array)
  const salesList = Array.isArray(sales) ? sales : (sales?.results || []);

  // Checkbox Handlers
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === salesList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(salesList.map((s) => s.id));
    }
  };

  // Delete Handlers
  const handleDeleteSingle = async (id) => {
    if (window.confirm(`Delete Sale #${id}? Stock will be automatically returned to inventory.`)) {
      if (onDeleteSale) await onDeleteSale(id);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} sale(s)?`)) {
      return;
    }
    try {
      if (onDeleteSale) {
        await Promise.all(selectedIds.map((id) => onDeleteSale(id)));
      }
      setSelectedIds([]);
    } catch (err) {
      alert('Failed to delete some records.');
    }
  };

  const isAllSelected = salesList.length > 0 && selectedIds.length === salesList.length;

  if (loading && salesList.length === 0) {
    return <LoadingSkeleton />;
  }

  if (!loading && salesList.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="space-y-4">
      {/* Table Toolbar / Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-600">
          Total Sales: <span className="font-semibold text-gray-900">{salesList.length}</span>
          {selectedIds.length > 0 && (
            <span className="ml-2 text-blue-600">({selectedIds.length} selected)</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Selected
            </button>
          )}

          {onExportSales && (
            <button
              onClick={() => onExportSales('sales_report.csv')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          Failed to load sales: {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      )}

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {salesList.map((sale) => (
                <SalesRow
                  key={sale.id}
                  sale={sale}
                  isSelected={selectedIds.includes(sale.id)}
                  onSelectRow={handleSelectRow}
                  onView={onViewSale}
                  onPrint={onPrintInvoice}
                  onDelete={handleDeleteSingle}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;