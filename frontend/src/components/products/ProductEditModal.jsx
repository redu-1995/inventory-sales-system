import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import  { productAPI }  from '../../services/productService';

export default function ProductEditModal({ isOpen, onClose, productId, onProductUpdated }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', category_name: '', brand: '',
    cost_price: '', selling_price: '', quantity: '',
    min_stock_level: '', status: 'ACTIVE', description: ''
  });

  // Fetch product data when modal opens with a specific ID
 // Fetch product data when modal opens with a specific ID
useEffect(() => {
  if (isOpen && productId) {
    setLoading(true);
    productAPI.getProduct(productId)
      .then((data) => { // <-- Changed 'res' to 'data' for clarity
        setFormData(data); // <-- Removed '.data' because it is already unwrapped in the service
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details", err);
        setLoading(false);
        onClose();
      });
  }
}, [isOpen, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await productAPI.updateProduct(productId, formData);
      onProductUpdated(); // Trigger parent table refresh
      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Loading product information...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" name="category_name" required value={formData.category_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price ($)</label>
                <input type="number" step="0.01" name="cost_price" required value={formData.cost_price} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
                <input type="number" step="0.01" name="selling_price" required value={formData.selling_price} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Quantity</label>
                <input type="number" name="quantity" required value={formData.quantity} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level</label>
                <input type="number" name="min_stock_level" required value={formData.min_stock_level} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="ACTIVE">In Stock / Active</option>
                  <option value="INACTIVE">Out of Stock / Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}