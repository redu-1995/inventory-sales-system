import React, { useState, useEffect } from 'react';

// Notice we add a default empty array fallback for products here
export default function StockAdjustmentModal({ item, products = [], onSubmit, onClose }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newQtyString, setNewQtyString] = useState(String(item?.quantity ?? 0));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync internal form states if the item object changes
  useEffect(() => {
    if (item) {
      setNewQtyString(String(item.quantity ?? 0));
      setSelectedProductId(typeof item.product === 'object' ? item.product?.id : item.product);
    } else {
      setNewQtyString('');
      setSelectedProductId('');
    }
    setErrorMsg('');
  }, [item]);

  const currentQuantity = item?.quantity ?? 0;
  const newQuantity = newQtyString === '' ? currentQuantity : Number(newQtyString);
  const difference = newQuantity - currentQuantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // If it's a new entry from the toolbar, make sure they picked a product
    const finalProductId = item ? selectedProductId : selectedProductId;
    if (!finalProductId) {
      setErrorMsg('Please select a target product.');
      return;
    }

    if (newQtyString === '' || newQuantity < 0 || !Number.isInteger(newQuantity)) {
      setErrorMsg('Please enter a valid whole number for the physical quantity.');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        product: Number(finalProductId),
        quantity: newQuantity,
        movement_type: 'ADJUST'
      });
      onClose();
    } catch (err) {
      setErrorMsg(err?.quantity?.[0] || 'Failed to complete physical audit adjustment.');
    } finally {
      setLoading(false);
    }
  };

  // --- FIX 1: REMOVE the old "if (!item) return null;" check ---
  // Instead, handle both inline line items and global toolbar button selections cleanly:
  const isGlobalAdjustment = !item;
  const productName = item ? (item.product_name || item.product?.name) : 'New Audit Entry';

  return (
  <div 
    className="fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-200"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Hardcoded fallback forces alpha transparency safely
  >
    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl text-left">
        <h3 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">
          Stock Reconciliation: {productName}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* FIX 2: Dynamic input switching */}
          {isGlobalAdjustment ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Product to Adjust</label>
              <select
                required
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Choose a Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.sku ? `(${p.sku})` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Show current metrics panel only if target item was pre-selected from row */
            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded border">
              <div>
                <span className="text-gray-500 block">System Balance:</span>
                <strong className="text-gray-800 text-sm">{currentQuantity} units</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Variance Shift:</span>
                <strong className={`text-sm ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {difference >= 0 ? `+${difference}` : difference} units
                </strong>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Physical Count on Shelf
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter exact total..."
              value={newQtyString}
              onChange={(e) => setNewQtyString(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              {loading ? 'Processing...' : 'Reconcile Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}