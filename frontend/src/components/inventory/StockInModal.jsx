import React, { useMemo, useState } from 'react';

export default function StockInModal({ products = [], suppliers = [], optionsLoading = false, onSubmit, onClose }) {
  const [form, setForm] = useState({ 
    supplier: '',
    product: '',
    quantity: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const availableProducts = useMemo(
    () => products.filter((product) => !form.supplier || String(product.supplier) === form.supplier),
    [products, form.supplier]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const qty = Number(form.quantity);
    if (!form.product) {
      setErrorMsg('Please select a valid product.');
      return;
    }
    if (!form.quantity || qty <= 0 || !Number.isInteger(qty)) {
      setErrorMsg('Quantity must be a positive whole number.');
      return;
    }

    setLoading(true);

    const payload = {
      product: Number(form.product),
      quantity: qty,
      movement_type: 'IN' 
    };

    try {
      await onSubmit(payload);
      onClose(); 
    } catch (err) {
      console.error("Submission Error Details:", err);
      setErrorMsg(err?.message || err?.detail || 'Failed to successfully commit stock adjustment entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xl w-full max-w-md space-y-4">
        
        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-base font-bold text-slate-800">📥 Inbound Stock Entry Log</h3>
          <p className="text-xs text-slate-400">Increase available physical inventory stock counts directly.</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Supplier filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Supplier</label>
          <select 
            disabled={loading || optionsLoading}
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value, product: '' })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 disabled:bg-slate-50"
          >
            <option value="">All suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Product selection */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Select Product</label>
          <select 
            required 
            disabled={loading || optionsLoading}
            value={form.product} 
            onChange={e => setForm({...form, product: e.target.value})} 
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 disabled:bg-slate-50"
          >
            <option value="">-- Choose a Product --</option>
            {availableProducts.length > 0 ? (
              availableProducts.map((p) => {
                // Defensive key parsing to ensure options display no matter what layout variant is passed
                const id = p.id ?? p.product;
                const displayTitle = p.name ?? p.product_name ?? 'Unnamed Item';
                const currentStock = p.current_quantity ?? p.quantity ?? 0;
                const code = p.sku ? ` (${p.sku})` : '';

                return (
                  <option key={id} value={id}>
                    {displayTitle}{code} — Stock: {currentStock}
                  </option>
                );
              })
            ) : (
              <option disabled value="">⚠️ No products available to load</option>
            )}
          </select>
        </div>

        {/* Quantity Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Enter Received Quantity</label>
          <input 
            type="number" 
            required 
            min="1" 
            step="1"
            disabled={loading || optionsLoading}
            value={form.quantity} 
            onChange={e => setForm({...form, quantity: e.target.value})} 
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 disabled:bg-slate-50" 
            placeholder="e.g. 50" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 text-sm pt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading || optionsLoading}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500/20 shadow-md font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Receive Stock'}
          </button>
        </div>
      </form>
    </div>
  );
}
