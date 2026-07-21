import React, { useState, useEffect } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const PurchaseOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
  const { createPurchaseRequest, loading, error, success } = useInventory();

  // Form State
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([
    { product: '', quantity: 1, cost_price: '' }
  ]);
  const [localError, setLocalError] = useState(null);

  // Dropdown options state
  const [suppliersList, setSuppliersList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  // Fetch Suppliers and Products when the modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      const fetchData = async () => {
        try {
          const [suppliersRes, productsRes] = await Promise.all([
            api.get('/products/suppliers/'), // Adjust endpoint if needed
            api.get('/products/products/')
          ]);
          setSuppliersList(suppliersRes.data || []);
          setProductsList(productsRes.data || []);
        } catch (err) {
          console.error("Failed to load select dropdown dependencies:", err);
          setLocalError("Failed to load suppliers or products list.");
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Reset local form state when successfully submitted or closed
  useEffect(() => {
    if (success && isOpen) {
      handleResetForm();
      onClose();
    }
  }, [success, isOpen, onClose]);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setSupplier('');
    setItems([{ product: '', quantity: 1, cost_price: '' }]);
    setLocalError(null);
  };

  const handleCloseModal = () => {
    handleResetForm();
    onClose();
  };

  // Add a new row to the nested purchase items array
  const handleAddItemRow = () => {
    setItems([...items, { product: '', quantity: 1, cost_price: '' }]);
  };

  // Remove a row from the items array
  const handleRemoveItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update specific fields in nested dynamic array
  const handleItemFieldChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Calculate Running Grand Total for UX
  const calculateTotal = () => {
    return items
      .reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.cost_price) || 0;
        return sum + qty * price;
      }, 0)
      .toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!supplier) {
      setLocalError("Please select a supplier.");
      return;
    }

    const hasInvalidItem = items.some(
      (item) => !item.product || item.quantity <= 0 || item.cost_price === ''
    );

    if (hasInvalidItem) {
      setLocalError("Please complete all product line items with valid quantities and prices.");
      return;
    }

    // Assemble clean payload with explicit type conversions for Django DRF
    const payload = {
      supplier: parseInt(supplier, 10),
      items: items.map((item) => ({
        product: parseInt(item.product, 10),
        quantity: parseInt(item.quantity, 10),
        cost_price: parseFloat(item.cost_price).toFixed(2)
      }))
    };

    try {
      const result = await createPurchaseRequest(payload);
      if (result) {
        if (onOrderCreated) onOrderCreated(result);
        handleResetForm();
        onClose();
      }
    } catch (err) {
      console.error("Error creating purchase request:", err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15),_0_0_1px_rgba(0,0,0,0.1)] transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Create Purchase Request</h3>
            <p className="text-xs text-slate-500">Create order records and restock inventory.</p>
          </div>
          <button 
            type="button"
            onClick={handleCloseModal} 
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Error Banner */}
          {displayError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Failed to submit request:</span>
                <p className="mt-0.5 text-xs">
                  {typeof displayError === 'object' ? JSON.stringify(displayError) : displayError}
                </p>
              </div>
            </div>
          )}

          {/* Supplier Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Supplier <span className="text-red-500">*</span>
            </label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
            >
              <option value="">-- Choose Supplier --</option>
              {suppliersList.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.company_name || sup.name} {sup.contact_person ? `(${sup.contact_person})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Nested Order Lines Header */}
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Order Lines</h4>
            <button
              type="button"
              onClick={handleAddItemRow}
              disabled={loading}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-blue-700 focus:outline-none"
            >
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>

          {/* Dynamic Item Grid */}
          <div className="max-h-60 overflow-y-auto space-y-3 mb-6 pr-1">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                
                {/* Select Product */}
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Product
                  </label>
                  <select
                    value={item.product}
                    onChange={(e) => handleItemFieldChange(index, 'product', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Choose item...</option>
                    {productsList.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (SKU: {prod.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="w-24">
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemFieldChange(index, 'quantity', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Cost Price */}
                <div className="w-32">
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Cost Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={item.cost_price}
                    onChange={(e) => handleItemFieldChange(index, 'cost_price', e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Total Column Row */}
                <div className="w-24 text-right pr-2">
                  <span className="block text-[11px] font-medium text-slate-400 uppercase mb-2">
                    Total
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    ${((parseFloat(item.quantity) || 0) * (parseFloat(item.cost_price) || 0)).toFixed(2)}
                  </span>
                </div>

                {/* Delete button */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(index)}
                    disabled={loading}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md mb-0.5"
                    title="Remove line item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Running Total & Action Buttons Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Estimated Total Amount</span>
              <p className="text-2xl font-bold text-slate-900">${calculateTotal()}</p>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Submitting Order...' : 'Submit Request'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};