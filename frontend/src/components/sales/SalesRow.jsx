import React from 'react';
import { Eye, Printer, CreditCard, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

const SalesRow = ({
  sale,
  isSelected = false,
  onSelectRow,
  onView,
  onPrint,
  onReceivePayment,
  onDelete
}) => {
  const statusUpper = (sale.status || 'UNPAID').toUpperCase();
  const total = parseFloat(sale.total_amount) || 0;
  const paid = parseFloat(sale.paid_amount || 0);
  const remaining = Math.max(0, total - paid);

  const customerName =
    sale.customer_name ||
    (typeof sale.customer === 'object' ? sale.customer?.full_name : '') ||
    'Walk-in Customer';

  const formattedDate = sale.sale_date
    ? new Date(sale.sale_date).toLocaleDateString()
    : 'N/A';

  // Ensures prefix isn't lost if invoice_number exists or falls back cleanly
  const invoiceDisplay = sale.invoice_number
    ? sale.invoice_number
    : `INV-${String(sale.id).padStart(4, '0')}`;

  return (
    <tr
      onClick={() => onView(sale)}
      className={`hover:bg-slate-50/80 transition-colors cursor-pointer border-b border-slate-100 text-xs ${
        isSelected ? 'bg-blue-50/40' : ''
      }`}
    >
      {/* 1. CHECKBOX COLUMN (Matches <th className="w-10"> in SalesTable) */}
      <td className="py-3 px-4 w-10" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectRow(sale.id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {/* 2. INVOICE # */}
      <td className="py-3 px-4 font-semibold text-slate-900">
        {invoiceDisplay}
      </td>

      {/* 3. DATE */}
      <td className="py-3 px-4 text-slate-600">{formattedDate}</td>

      {/* 4. CUSTOMER */}
      <td className="py-3 px-4">
        <div className="font-medium text-slate-800">{customerName}</div>
        <div className="text-[10px] text-slate-400 capitalize">
          {sale.payment_method || 'Cash'}
        </div>
      </td>

      {/* 5. TOTAL */}
      <td className="py-3 px-4 font-semibold text-slate-900">
        {total.toLocaleString()} ETB
      </td>

      {/* 6. PAID / REMAINING */}
      <td className="py-3 px-4 text-slate-600">
        <span className="text-emerald-600 font-medium">
          {paid.toLocaleString()}
        </span>{' '}
        /{' '}
        <span
          className={
            remaining > 0 ? 'text-rose-500 font-medium' : 'text-slate-400'
          }
        >
          {remaining.toLocaleString()} ETB
        </span>
      </td>

      {/* 7. STATUS */}
      <td className="py-3 px-4">
        {statusUpper === 'PAID' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        )}
        {statusUpper === 'PARTIAL' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Partial
          </span>
        )}
        {statusUpper === 'UNPAID' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Unpaid
          </span>
        )}
      </td>

      {/* 8. ACTIONS */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end space-x-1">
          {remaining > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReceivePayment(sale);
              }}
              title="Receive Payment"
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView(sale);
            }}
            title="View Sale Details"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrint(sale);
            }}
            title="Print Invoice"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>

         
        </div>
      </td>
    </tr>
  );
};

export default SalesRow;