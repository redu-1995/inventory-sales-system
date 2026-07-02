import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';
import { useProductForm } from '../../hooks/useProductForm';

export default function ProductModal({ isOpen, onClose, onRefresh }) {
  const { formData, errors, isSubmitting, categories, suppliers, handleChange, handleImageChange, handleSubmit } = useProductForm(
    () => {
      onRefresh(); // Refresh table view directly upon completion
      onClose();   // Close modal cleanly
    }
  );

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">Add New Product</h3>
            <p className="text-xs text-gray-500">Insert database entry for live batch metrics processing.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <ProductForm 
              formData={formData} 
              errors={errors} 
              categories={categories}
              suppliers={suppliers}
              handleChange={handleChange} 
              onImageSelected={handleImageChange} 
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}