import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { useProductForm } from '../../hooks/useProductForm';

export default function ProductEditModal({ isOpen, onClose, product, onProductUpdated }) {
  // Integrate the unified Custom Hook, passing the current product instance to edit
  const {
    formData,
    errors,
    isSubmitting,
    categories,
    handleChange,
    handleImageChange,
    handleSubmit
  } = useProductForm(() => {
    if (onProductUpdated) onProductUpdated(); // Refresh parent table view list
    if (onClose) onClose();                    // Close modal context view
  }, product);

  // Return empty layout if modal is toggled off
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Modal Header Layout */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Modify inventory details for item SKU:{' '}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                {formData.sku || 'N/A'}
              </span>
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Validation Constraints Display */}
        {errors.server && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
            {errors.server}
          </div>
        )}

        {/* Main Entry Interactive Form Element */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name ?? ''} 
                onChange={handleChange} 
                className={`w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`} 
              />
              {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
            </div>

            {/* Read-Only Fixed SKU Definition */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">SKU (Immutable Field)</label>
              <input 
                type="text" 
                name="sku" 
                value={formData.sku ?? ''} 
                className="w-full rounded-lg border border-gray-200 p-2 text-sm bg-gray-50 text-gray-400 font-mono cursor-not-allowed select-none" 
                disabled 
              />
            </div>

            {/* Dynamic Dropdown Category Selector managed by hook context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                name="category" 
                required 
                value={formData.category?.id ?? formData.category ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition"
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="text-xs text-red-500 mt-1 block">{errors.category}</span>}
            </div>

            {/* Brand Input Entry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input 
                type="text" 
                name="brand" 
                value={formData.brand ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition" 
              />
            </div>

            {/* Cost Price Setup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                name="cost_price" 
                required 
                value={formData.cost_price ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition" 
              />
              {errors.cost_price && <span className="text-xs text-red-500 mt-1 block">{errors.cost_price}</span>}
            </div>

            {/* Selling Price Setup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                name="selling_price" 
                required 
                value={formData.selling_price ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition" 
              />
              {errors.selling_price && <span className="text-xs text-red-500 mt-1 block">{errors.selling_price}</span>}
            </div>

            {/* Physical Inventory Tracking Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                required 
                value={formData.quantity ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition" 
              />
            </div>

            {/* Reorder Threshold Value Parameters mapping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Reorder Stock Threshold</label>
              <input 
                type="number" 
                name="reorder_level" 
                required 
                value={formData.reorder_level ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition" 
              />
            </div>

            {/* Image File Multi-Part Upload Handler Selection */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Product Asset Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            {/* Product Active State Status Parameter Mapping Box */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lifecycle Tracking Status</label>
              <select 
                name="status" 
                value={formData.status === true || formData.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'} 
                onChange={(e) => {
                  const val = e.target.value === 'ACTIVE';
                  handleChange({ target: { name: 'status', value: val } });
                }} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition"
              >
                <option value="ACTIVE">In Stock / Active / Visible</option>
                <option value="INACTIVE">Archived / Out of Stock / Hidden</option>
              </select>
            </div>

            {/* Description Area Parameters */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
              <textarea 
                name="description" 
                rows="3" 
                value={formData.description ?? ''} 
                onChange={handleChange} 
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition" 
              />
            </div>
          </div>

          {/* Sticky Lower Action Controls Block */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}