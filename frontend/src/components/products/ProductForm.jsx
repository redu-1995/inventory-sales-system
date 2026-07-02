import React from 'react';
import ImageUpload from './ImageUpload';

export default function ProductForm({ formData, errors, categories, suppliers, handleChange, onImageSelected }) {
  return (
    <div className="space-y-4 max-h-[65vh] overflow-y-auto px-1">
      {errors.server && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
          ⚠️ {errors.server}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Title *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`} placeholder="e.g. Nivea Body Lotion" />
          {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">SKU Code *</label>
          <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.sku ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`} placeholder="NV-10294-L" />
          {errors.sku && <p className="text-red-500 text-[11px] mt-1">{errors.sku}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Barcode</label>
          <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Optional" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`}>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-[11px] mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Supplier *</label>
          <select name="supplier" value={formData.supplier} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${errors.supplier ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`}>
            <option value="">Select Supplier</option>
            {suppliers.map(sup => (
              <option key={sup.id} value={sup.id}>{sup.name || sup.company_name}</option>
            ))}
          </select>
          {errors.supplier && <p className="text-red-500 text-[11px] mt-1">{errors.supplier}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cost Price ($) *</label>
          <input type="number" step="0.01" name="cost_price" value={formData.cost_price} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.cost_price ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`} placeholder="0.00" />
          {errors.cost_price && <p className="text-red-500 text-[11px] mt-1">{errors.cost_price}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Selling Price ($) *</label>
          <input type="number" step="0.01" name="selling_price" value={formData.selling_price} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.selling_price ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`} placeholder="0.00" />
          {errors.selling_price && <p className="text-red-500 text-[11px] mt-1">{errors.selling_price}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" placeholder="Enter product details..." />
      </div>

      <ImageUpload onImageSelected={onImageSelected} />
    </div>
  );
}