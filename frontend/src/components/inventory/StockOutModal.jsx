import React, { useMemo, useState } from 'react';

export default function StockOutModal({ inventoryItems = [], optionsLoading = false, onSubmit, onClose }) {
  const [form, setForm] = useState({ product: '', quantity: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedItem = useMemo(
    () => inventoryItems.find((item) => String(item.product) === form.product),
    [inventoryItems, form.product]
  );
  const currentStock = selectedItem?.quantity ?? 0;
  const reorderLevel = selectedItem?.reorder_level ?? selectedItem?.minimum_stock_level ?? 0;

  const handleProductChange = (event) => {
    setForm({ product: event.target.value, quantity: '' });
    setErrorMsg('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    const quantity = Number(form.quantity);

    if (!selectedItem) return setErrorMsg('Please select a valid product.');
    if (!Number.isInteger(quantity) || quantity <= 0) return setErrorMsg('Quantity must be a positive whole number.');
    if (quantity > currentStock) {
      return setErrorMsg(`Not enough stock. Only ${currentStock} unit${currentStock === 1 ? '' : 's'} available.`);
    }

    setSubmitting(true);
    try {
      await onSubmit({ product: Number(form.product), quantity, movement_type: 'OUT' });
      onClose();
    } catch (error) {
      const apiError = error?.response?.data?.quantity || error?.response?.data?.detail;
      setErrorMsg(Array.isArray(apiError) ? apiError.join(' ') : apiError || 'Unable to remove stock. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-base font-bold text-slate-800">Stock Out</h3>
          <p className="text-xs text-slate-400">Remove units from available inventory.</p>
        </div>

        {errorMsg && <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-xs font-medium text-red-600">{errorMsg}</div>}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Product *</label>
          <select required disabled={submitting || optionsLoading} value={form.product} onChange={handleProductChange} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50">
            <option value="">{optionsLoading ? 'Loading products...' : '-- Choose a Product --'}</option>
            {inventoryItems.map((item) => <option key={item.id} value={item.product}>{item.product_name}{item.sku ? ` (${item.sku})` : ''} — Stock: {item.quantity}</option>)}
          </select>
        </div>

        {selectedItem && (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
            <div><p className="text-xs font-medium text-slate-500">Current Stock</p><p className="mt-1 font-bold text-slate-900">{currentStock} Units</p></div>
            <div><p className="text-xs font-medium text-slate-500">Reorder Level</p><p className="mt-1 font-bold text-slate-900">{reorderLevel} Units</p></div>
            <div className="col-span-2"><p className="text-xs font-medium text-slate-500">SKU</p><p className="mt-1 font-semibold text-slate-700">{selectedItem.sku || 'Not set'}</p></div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Quantity to Remove *</label>
          <input type="number" required min="1" max={currentStock || undefined} step="1" disabled={submitting || optionsLoading || !selectedItem} value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50" placeholder="e.g. 5" />
          {selectedItem && <p className="text-xs text-slate-400">Maximum removable quantity: {currentStock}.</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-2 text-sm">
          <button type="button" onClick={onClose} disabled={submitting} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={submitting || optionsLoading || !selectedItem} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white shadow-md hover:bg-red-700 disabled:opacity-50">{submitting ? 'Processing...' : 'Stock Out'}</button>
        </div>
      </form>
    </div>
  );
}
