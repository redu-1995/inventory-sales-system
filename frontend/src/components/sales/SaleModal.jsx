import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CreateSaleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  availableProducts = [], 
  availableCustomers = [],
  isSubmitting = false 
}) => {
  // --- Form State ---
  const [customerId, setCustomerId] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  // Line items structure
  const [items, setItems] = useState([
    { id: Date.now(), productId: '', quantity: 1, unitPrice: 0, total: 0, maxStock: 0 }
  ]);

  // Financial calculations
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form whenever modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCustomerId('');
      setSaleDate(new Date().toISOString().split('T')[0]);
      setPaymentStatus('PAID');
      setPaymentMethod('cash');
      setNotes('');
      setDiscount(0);
      setErrorMsg('');
      setItems([{ id: Date.now(), productId: '', quantity: 1, unitPrice: 0, total: 0, maxStock: 0 }]);
    }
  }, [isOpen]);

  // Recalculate totals whenever items or discount update
  useEffect(() => {
    const newSubtotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
    const calculatedTax = newSubtotal * 0.15; // 15% VAT standard
    const finalTotal = Math.max(0, newSubtotal + calculatedTax - discount);

    setSubtotal(newSubtotal);
    setTax(calculatedTax);
    setGrandTotal(finalTotal);
  }, [items, discount]);

  if (!isOpen) return null;

  // --- Item Event Handlers ---
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), productId: '', quantity: 1, unitPrice: 0, total: 0, maxStock: 0 }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProductChange = (id, selectedProductId) => {
    const product = availableProducts.find(
      (p) => String(p.id) === String(selectedProductId)
    );

    const unitPrice = product ? Number(product.price || product.selling_price || 0) : 0;
    const stock = product ? Number(product.stock_quantity ?? product.quantity ?? 0) : 0;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = item.quantity > stock && stock > 0 ? stock : item.quantity || 1;
          return {
            ...item,
            productId: selectedProductId,
            unitPrice,
            maxStock: stock,
            quantity: qty,
            total: qty * unitPrice,
          };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (id, qty) => {
    const parsedQty = Math.max(1, parseInt(qty, 10) || 1);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const finalQty = item.maxStock > 0 ? Math.min(parsedQty, item.maxStock) : parsedQty;
          return {
            ...item,
            quantity: finalQty,
            total: finalQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const handleUnitPriceChange = (id, price) => {
    const parsedPrice = Math.max(0, parseFloat(price) || 0);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            unitPrice: parsedPrice,
            total: item.quantity * parsedPrice,
          };
        }
        return item;
      })
    );
  };

  // --- Form Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerId) {
      setErrorMsg('Please select a customer.');
      return;
    }

    if (items.some((i) => !i.productId)) {
      setErrorMsg('Please select a valid product for every row.');
      return;
    }

    const payload = {
      customer: Number(customerId) || customerId,
      sale_date: saleDate,
      status: paymentStatus, // 'PAID', 'PARTIAL', or 'UNPAID'
      payment_method: paymentMethod,
      subtotal: Number(subtotal.toFixed(2)),
      tax_amount: Number(tax.toFixed(2)),
      discount_amount: Number(discount.toFixed(2)),
      total_amount: Number(grandTotal.toFixed(2)),
      notes: notes.trim(),
      items: items.map((item) => ({
        product: Number(item.productId) || item.productId,
        quantity: Number(item.quantity),
        unit_price: Number(item.unitPrice),
        subtotal: Number(item.total.toFixed(2)),
      })),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create New Sale</h2>
              <p className="text-xs text-gray-500">Record a transaction and adjust stock balances.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form id="create-sale-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {errorMsg && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Top Row: Customer & Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50/60 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all cursor-pointer"
              >
                <option value="" className="text-slate-500 bg-white">
                  Select Customer...
                </option>
                {availableCustomers.map((cust) => (
                  <option 
                    key={cust.id} 
                    value={cust.id} 
                    className="text-slate-900 bg-white py-1"
                  >
                    {cust.full_name || cust.email || `Customer #${cust.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sale Date</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
              >
                <option value="cash" className="text-slate-900 bg-white">Cash</option>
                <option value="bank_transfer" className="text-slate-900 bg-white">Bank Transfer (CBE / Telebirr)</option>
                <option value="card" className="text-slate-900 bg-white">Credit/Debit Card</option>
                <option value="credit" className="text-slate-900 bg-white">On Credit (Unpaid)</option>
              </select>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Products & Quantities</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Product Line
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4 w-28">Qty</th>
                    <th className="py-3 px-4 w-36">Unit Price (ETB)</th>
                    <th className="py-3 px-4 w-36 text-right">Total (ETB)</th>
                    <th className="py-3 px-4 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-4">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(item.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                        >
                          <option value="" className="text-slate-500 bg-white">Choose item...</option>
                          {availableProducts.map((prod) => {
                            const stock = prod.stock_quantity ?? prod.quantity ?? 0;
                            return (
                              <option key={prod.id} value={prod.id} disabled={stock <= 0} className="text-slate-900 bg-white">
                                {prod.name} ({stock} in stock)
                              </option>
                            );
                          })}
                        </select>
                      </td>

                      <td className="py-2.5 px-4">
                        <input
                          type="number"
                          min="1"
                          max={item.maxStock > 0 ? item.maxStock : undefined}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                        />
                      </td>

                      <td className="py-2.5 px-4">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleUnitPriceChange(item.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                        />
                      </td>

                      <td className="py-2.5 px-4 text-right font-semibold text-gray-800">
                        {item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                      </td>

                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                          className="p-1.5 text-gray-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Controls & Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Payment Status</label>
                <div className="flex items-center space-x-3">
                  {['PAID', 'PARTIAL', 'UNPAID'].map((status) => (
                    <label
                      key={status}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        paymentStatus === status
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentStatus"
                        value={status}
                        checked={paymentStatus === status}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="sr-only"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Notes / Internal References
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional note or reference number..."
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none resize-none"
                />
              </div>
            </div>

            {/* Calculations Card */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-2.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Tax (15% VAT):</span>
                <span className="font-semibold text-gray-900">
                  {tax.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Discount Amount:</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 px-2 py-1 text-right text-xs text-slate-900 bg-white border border-gray-200 rounded outline-none"
                />
              </div>
              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Grand Total:</span>
                <span className="text-lg font-black text-blue-600">
                  {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-sale-form"
            disabled={isSubmitting}
            className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-500/30 transition-all"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateSaleModal;