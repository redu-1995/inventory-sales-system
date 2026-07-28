import React, { useEffect } from 'react';
import { Printer, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PrintInvoice = ({ sale, companyInfo, onClose }) => {
  // 1. Trigger print & listen for when print finishes/cancels
  useEffect(() => {
    if (!sale) return;

    const timer = setTimeout(() => {
      window.print();
    }, 300);

    // Close invoice modal automatically after printing or canceling print prompt
    const handleAfterPrint = () => {
      if (onClose) onClose();
    };

    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [sale, onClose]);

  // 2. Listen for 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!sale) return null;

  // --- Fallback & Parsing Logic ---
  const company = companyInfo || {
    name: 'ABC COSMETICS PLC',
    address: 'Addis Ababa, Ethiopia',
    phone: '+251 911 000 000',
    email: 'info@abccosmetics.com',
    tin: '0012345678',
  };

  const invoiceNo = sale.invoice_number || `INV-2026-${String(sale.id).padStart(4, '0')}`;
  
  const saleDateObj = sale.sale_date ? new Date(sale.sale_date) : new Date();
  const formattedDate = saleDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = saleDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const cashierName = sale.user_name || (typeof sale.user === 'object' ? sale.user?.username : '') || 'Admin';
  
  const customerObj = typeof sale.customer === 'object' ? sale.customer : null;
  const customerName = sale.customer_name || customerObj?.full_name || 'Walk-in Customer';
  const customerPhone = sale.customer_phone || customerObj?.phone || null;

  const items = sale.items || sale.sale_items || [];

  const subtotal = items.reduce((acc, item) => {
    const qty = item.quantity || 1;
    const price = parseFloat(item.unit_price || item.price || 0);
    return acc + (qty * price);
  }, 0);

  const discountAmount = parseFloat(sale.discount_amount) || 0;
  const taxAmount = parseFloat(sale.tax_amount) || 0;
  const grandTotal = parseFloat(sale.total_amount) || (subtotal + taxAmount - discountAmount);

  const statusUpper = (sale.status || 'UNPAID').toUpperCase();
  
  const rawPaid = sale.paid_amount ?? sale.amount_paid;
  const paidAmount = rawPaid !== undefined && rawPaid !== null
    ? parseFloat(rawPaid)
    : (statusUpper === 'PAID' ? grandTotal : 0);

  const remainingBalance = Math.max(0, grandTotal - paidAmount);

  return (
    <div>
      {/* Dynamic Print CSS */}
      <style>{`
        @media print {
          /* Hide non-printable elements */
          body * {
            visibility: hidden !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Backdrop: Clicking outside now triggers onClose */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      >
        {/* Modal Container: Prevents clicks inside from closing */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-6 overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Top Bar Actions */}
          <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-800 text-white border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <Printer className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold">Print Preview — #{invoiceNo}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                title="Cancel / Close (Esc)"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PRINTABLE INVOICE CONTENT */}
          <div id="printable-invoice" className="p-8 text-slate-800 font-sans text-xs leading-relaxed">
            {/* Header & Company Info */}
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
              <h1 className="text-lg font-bold tracking-wider text-slate-900 uppercase">
                {company.name}
              </h1>
              <p className="text-slate-600">{company.address}</p>
              <p className="text-slate-600">Phone: {company.phone}</p>
              <p className="text-slate-600">Email: {company.email}</p>
              {company.tin && <p className="text-slate-500 text-[11px]">TIN/VAT Reg: {company.tin}</p>}
            </div>

            {/* Title */}
            <div className="text-center py-3">
              <h2 className="text-base font-extrabold uppercase tracking-widest text-slate-900">
                Sales Invoice
              </h2>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-200 bg-slate-50/50 px-3 rounded-lg mb-4 text-slate-700">
              <div>
                <p><span className="font-semibold text-slate-900">Invoice No:</span> {invoiceNo}</p>
                <p><span className="font-semibold text-slate-900">Cashier:</span> {cashierName}</p>
              </div>
              <div className="text-right">
                <p><span className="font-semibold text-slate-900">Date:</span> {formattedDate}</p>
                <p><span className="font-semibold text-slate-900">Time:</span> {formattedTime}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-4 pb-3 border-b border-dashed border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Customer Details
              </span>
              <p className="text-sm font-bold text-slate-900">{customerName}</p>
              {customerPhone && <p className="text-slate-600">{customerPhone}</p>}
            </div>

            {/* Products Table */}
            <div className="mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase text-slate-800">
                    <th className="py-2">Product</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.length > 0 ? (
                    items.map((item, index) => {
                      const name = item.product_name || item.product?.name || `Product #${index + 1}`;
                      const qty = item.quantity || 1;
                      const price = parseFloat(item.unit_price || item.price || 0);
                      const lineTotal = parseFloat(item.subtotal) || (qty * price);

                      return (
                        <tr key={index}>
                          <td className="py-2 font-medium text-slate-900 pr-2">{name}</td>
                          <td className="py-2 text-center text-slate-700">{qty}</td>
                          <td className="py-2 text-right text-slate-700">{price.toLocaleString()}</td>
                          <td className="py-2 text-right font-semibold text-slate-900">{lineTotal.toLocaleString()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-slate-400 italic">
                        No product items listed
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="border-t-2 border-slate-800 pt-3 space-y-1.5 text-right font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>ETB {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span>- ETB {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax (VAT)</span>
                  <span>+ ETB {taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-base font-extrabold text-slate-900 border-y-2 border-slate-900 py-2 mt-2">
                <span>GRAND TOTAL</span>
                <span>ETB {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Payment Method:</span>
                <span className="capitalize font-bold text-slate-900">{sale.payment_method || 'Cash'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Payment Status:</span>
                <span className="font-bold flex items-center gap-1">
                  {statusUpper === 'PAID' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 no-print" />}
                  {statusUpper === 'PARTIAL' && <Clock className="w-3.5 h-3.5 text-amber-600 no-print" />}
                  {statusUpper === 'UNPAID' && <AlertCircle className="w-3.5 h-3.5 text-rose-600 no-print" />}
                  {statusUpper}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-800">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-700">
                  ETB {paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-800 pt-1 border-t border-slate-200 font-bold">
                <span>Remaining Balance:</span>
                <span className={remainingBalance > 0 ? 'text-rose-600' : 'text-slate-900'}>
                  ETB {remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-dashed border-slate-300 text-center text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">Thank you for shopping with us!</p>
              <p>Please keep this invoice for warranty & exchange purposes.</p>
              <p>Goods sold can be exchanged within 7 days with original receipt.</p>
              <p className="text-[10px] text-slate-400 pt-2 font-mono uppercase tracking-wider">
                Powered by Inventory Management System
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;