import React, { useState } from 'react';
import { AlertTriangle, Loader2, Archive, Trash2 } from 'lucide-react';
import { productAPI } from '../../services/productService';

/**
 * Delete / Archive Confirmation Modal
 * * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to close the modal
 * @param {string|number} productId - ID of the product to delete/archive
 * @param {string} productName - Name of the product to delete/archive
 * @param {function} onProductDeleted - Callback after successful deletion/archiving
 * @param {boolean} isSoftDelete - (Optional) If true, performs soft-delete/archive instead of permanent delete
 */
export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  onProductDeleted,
  isSoftDelete = true 
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAction = async () => {
    setDeleting(true);
    setError(null);

    try {
      if (isSoftDelete && productAPI.archiveProduct) {
        await productAPI.archiveProduct(productId);
      } else {
        await productAPI.deleteProduct(productId);
      }
      
      onProductDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete/archive product:", err);
      setError(err?.response?.data?.detail || "An unexpected error occurred. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return; // Prevent closing while API request is pending
    setError(null);
    onClose();
  };

  return (
    <div 
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4 border border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isSoftDelete ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
          }`}>
            {isSoftDelete ? <Archive className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {isSoftDelete ? 'Archive Product' : 'Delete Product'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to {isSoftDelete ? 'archive' : 'permanently delete'}{' '}
              <span className="font-semibold text-gray-800">"{productName}"</span>?
            </p>
            <p className="mt-1.5 text-xs text-gray-400">
              {isSoftDelete 
                ? 'This will archive the product and preserve its history for restoration and reporting.'
                : 'This action cannot be undone and will immediately erase all item record data.'}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={handleClose} 
            disabled={deleting} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            onClick={handleAction} 
            disabled={deleting} 
            className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg transition focus:outline-none focus:ring-2 disabled:opacity-50 ${
              isSoftDelete 
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/20' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20'
            }`}
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSoftDelete ? 'Archiving...' : 'Deleting...'}
              </>
            ) : (
              <>
                {isSoftDelete ? <Archive className="mr-1.5 h-4 w-4" /> : <Trash2 className="mr-1.5 h-4 w-4" />}
                {isSoftDelete ? 'Confirm Archive' : 'Confirm Delete'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}