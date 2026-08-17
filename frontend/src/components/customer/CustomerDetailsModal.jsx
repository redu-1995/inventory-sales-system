import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { customerService } from '../../services/customerService';

export default function CustomerDetailsModal({ customer, onClose, onEdit }) {
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Close on Escape Key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch sales history when customer ID changes
  useEffect(() => {
    if (customer?.id) {
      setLoading(true);
      customerService
        .getCustomerSalesHistory(customer.id)
        .then((data) => {
          const list = Array.isArray(data) ? data : data?.results || [];
          setSalesHistory(list);
        })
        .catch((err) => {
          console.error("Failed to load customer sales:", err);
          setSalesHistory([]);
        })
        .finally(() => setLoading(false));
    }
  }, [customer?.id]);

  if (!customer) return null;

  return (
    /* Backdrop - Click outside closes modal */
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal Dialog Body - Prevent clicks inside from closing */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{customer?.full_name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {customer?.phone || 'No Phone'} • {customer?.email || 'No email'}
            </p>
          </div>
          <button 
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg p-2 transition-colors font-bold text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Sales Table Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Purchase History
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading purchase history...</span>
            </div>
          ) : salesHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              No past transactions recorded for this customer in the database.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesHistory.map((sale) => {
                    const rawDate = sale.sale_date || sale.created_at || sale.date;
                    const formattedDate = rawDate 
                      ? new Date(rawDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : '—';

                    const itemCount = sale.item_count ?? (sale.items ? sale.items.length : 0);
                    const totalAmount = Number(sale.total_amount ?? sale.total ?? 0);

                    return (
                      <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 text-slate-700 font-medium">{formattedDate}</td>
                        <td className="p-3 text-slate-600">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          ETB {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            sale.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            sale.status === 'PARTIAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {sale.status || 'PAID'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Close
          </button>
          {onEdit && customer && (
            <button
              onClick={() => {
                if (typeof onEdit === 'function') {
                  onEdit(customer);
                }
              }}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Customer
            </button>
          )}
        </div>

      </div>
    </div>
  );
}