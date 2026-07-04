import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { productAPI } from '../../services/productService';

export default function DeleteConfirmationModal({ isOpen, onClose, productId, productName, onProductDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productAPI.deleteProduct(productId);
      onProductDeleted(); // Refresh the product table listing
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            <p className="mt-1 text-sm text-gray-500">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{productName}"</span>? 
              This action cannot be undone and will immediately clear it from stock lists.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={deleting} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} disabled={deleting} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50">
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}