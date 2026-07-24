import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../../services/api'; // Standard axios instance
import { purchaseOrderService } from '../../services/purchaseOrderService';

export const PurchaseOrderModal = ({ isOpen, onClose, onOrderCreated }) => {
  // Form State
  const [supplier, setSupplier] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { product: '', quantity: 1, cost_price: '' }
  ]);

  // Status & Validation State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dropdown options state
  const [suppliersList, setSuppliersList] = useState([]);
  const [productsList, setProductsList] = useState([]);

  // Fetch Suppliers and Products when the modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      const fetchData = async () => {
        try {
          const [suppliersRes, productsRes] = await Promise.all([
            api.get('products/suppliers/'), // Removed leading slash for consistency
            api.get('products/products/')
          ]);

          // Support both DRF paginated responses ({ results: [...] }) and standard arrays
          const suppliers = suppliersRes.data?.results || suppliersRes.data || [];
          const products = productsRes.data?.results || productsRes.data || [];

          setSuppliersList(suppliers);
          setProductsList(products);
        } catch (err) {
          console.error("Failed to load dropdown data:", err);
          setError("Failed to load suppliers or products list. Please check server connections.");
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setSupplier('');
    setExpectedDelivery('');
    setNotes('');
    setItems([{ product: '', quantity: 1, cost_price: '' }]);
    setError(null);
  };

  const handleCloseModal = () => {
    handleResetForm();
    onClose();
  };

  // Add a new line item row
  const handleAddItemRow = () => {
    setItems([...items, { product: '', quantity: 1, cost_price: '' }]);
  };

  // Remove a line item row
  const handleRemoveItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Update specific fields in dynamic array
  const handleItemFieldChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Auto-fill cost price if product selected
    if (field === 'product' && value) {
      const selectedProduct = productsList.find(p => p.id === parseInt(value, 10));
      if (selectedProduct && (selectedProduct.cost_price || selectedProduct.price)) {
        updatedItems[index].cost_price = selectedProduct.cost_price || selectedProduct.price;
      }
    }

    setItems(updatedItems);
  };

  // Calculate Running Grand Total
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
    setError(null);

    if (!supplier) {
      setError("Please select a supplier.");
      return;
    }

    const hasInvalidItem = items.some(
      (item) => !item.product || item.quantity <= 0 || item.cost_price === '' || parseFloat(item.cost_price) < 0
    );

    if (hasInvalidItem) {
      setError("Please complete all line items with valid products, quantities, and cost prices.");
      return;
    }

    // Assemble payload expected by DRF Purchase Order Endpoint
    const payload = {
      supplier: parseInt(supplier, 10),
      expected_delivery: expectedDelivery || null,
      notes: notes.trim() || "",
      items: items.map((item) => ({
        product: parseInt(item.product, 10),
        quantity: parseInt(item.quantity, 10),
        cost_price: parseFloat(item.cost_price).toFixed(2)
      }))
    };

    setLoading(true);
    try {
      // Use the service created for purchase orders
      const createdOrder = await purchaseOrderService.createPurchaseOrder(payload);
      
      if (onOrderCreated) {
        onOrderCreated(createdOrder);
      }
      handleResetForm();
      onClose();
    } catch (err) {
      console.error("Error creating purchase order:", err);
      
      // Parse detailed Django field errors
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          const formattedErrors = Object.entries(data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
          setError(formattedErrors);
        } else {
          setError(String(data));
        }
      } else {
        setError("Failed to create Purchase Order. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15),_0_0_1px_rgba(0,0,0,0.1)] transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Create Purchase Order</h3>
            <p className="text-xs text-slate-500">Issue a new formal purchase order to a supplier.</p>
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
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Submission Error:</span>
                <p className="mt-0.5 text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Supplier Select */}
            <div>
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

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Line Items Section Header */}
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">Purchase Order Items</h4>
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
          <div className="max-h-60 overflow-y-auto space-y-3 mb-5 pr-1">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                
                {/* Select Product */}
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Product <span className="text-red-500">*</span>
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
                        {prod.name} {prod.sku ? `(SKU: ${prod.sku})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="w-24">
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Qty <span className="text-red-500">*</span>
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

                {/* Unit Cost Price */}
                <div className="w-32">
                  <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Unit Cost ($) <span className="text-red-500">*</span>
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

                {/* Calculated Line Subtotal */}
                <div className="w-24 text-right pr-2">
                  <span className="block text-[11px] font-medium text-slate-400 uppercase mb-2">
                    Total
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    ${((parseFloat(item.quantity) || 0) * (parseFloat(item.cost_price) || 0)).toFixed(2)}
                  </span>
                </div>

                {/* Delete line button */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItemRow(index)}
                    disabled={loading}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md mb-0.5"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Optional Notes Input */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Order Notes / Terms (Optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Deliver to Warehouse Gate 2, Net 30 payment terms..."
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
            />
          </div>

          {/* Total & Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Total Order Amount</span>
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
                {loading ? 'Creating Order...' : 'Create Purchase Order'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;