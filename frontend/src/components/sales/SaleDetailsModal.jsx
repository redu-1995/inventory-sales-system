import React from 'react';
import { X, Printer, User, Calendar, CreditCard, ShoppingBag, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ViewSaleModal = ({ isOpen, onClose, sale, onPrint }) => {
  if (!isOpen || !sale) return null;

  // --- Safe Parsing & Defaults ---
  const statusUpper = (sale.status || 'UNPAID').toUpperCase();
 // --- Safe Parsing ---
    const totalAmount = parseFloat(sale.total_amount) || 0;

    // Read computed paid_amount from backend serializer
    const paidAmount = parseFloat(sale.paid_amount || 0);

    // Calculate remaining balance dynamically
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

  const customerName = sale.customer_name || (typeof sale.customer === 'object' ? sale.customer?.full_name : '') || 'Walk-in Customer';
  const userName = sale.user_name || (typeof sale.user === 'object' ? sale.user?.username : '') || 'Admin';
  const formattedDate = sale.sale_date ? new Date(sale.sale_date).toLocaleString() : 'N/A';
  const items = sale.items || sale.sale_items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* --- Header Section --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">Sale #{sale.id || sale.invoice_number}</h2>
                
                {/* Status Badge */}
                {statusUpper === 'PAID' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Paid
                  </span>
                )}
                {statusUpper === 'PARTIAL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3 h-3" /> Partial
                  </span>
                )}
                {statusUpper === 'UNPAID' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3 h-3" /> Unpaid
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Detailed view of order items and payment history</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- Modal Body --- */}
        <div className="p-6 space-y-6 max-h-[calc(80vh-120px)] overflow-y-auto">
          
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Customer Information</span>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-800">{customerName}</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Order Meta</span>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">{sale.payment_method || 'Cash'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Purchased Items Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Product</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.length > 0 ? (
                    items.map((item, index) => {
                      const productName = item.product_name || item.product?.name || `Item #${index + 1}`;
                      const qty = item.quantity || 1;
                      const price = parseFloat(item.unit_price || item.price || 0);
                      const subtotal = parseFloat(item.subtotal || item.total_price) || (qty * price);

                      return (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-medium text-slate-800">{productName}</td>
                          <td className="py-3 px-4 text-center text-slate-600">{qty}</td>
                          <td className="py-3 px-4 text-right text-slate-600">{price.toLocaleString()} ETB</td>
                          <td className="py-3 px-4 text-right font-semibold text-slate-800">{subtotal.toLocaleString()} ETB</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-400 text-xs">
                        No individual items specified for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Amount</span>
              <span className="text-sm font-semibold text-white">{totalAmount.toLocaleString()} ETB</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Amount Paid</span>
              <span className="text-sm font-semibold text-emerald-400">{paidAmount.toLocaleString()} ETB</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Remaining Balance</span>
              <span className="text-base font-bold text-rose-400">{remainingAmount.toLocaleString()} ETB</span>
            </div>
          </div>

        </div>

        {/* --- Modal Footer Actions --- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => onPrint && onPrint(sale)}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-2 text-slate-500" />
            Print Invoice
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewSaleModal;