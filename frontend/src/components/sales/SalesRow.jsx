import React from 'react';
import { Eye, Printer } from 'lucide-react';
import PaymentStatusBadge from '../common/PaymentStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency'; 

const SalesRow = ({ sale, isSelected, onSelectRow, onView, onPrint }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 text-sm text-gray-700">
      {/* Selection Checkbox */}
      <td className="py-3.5 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectRow(sale.id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </td>

      {/* Invoice # */}
      <td className="py-3.5 px-4 font-semibold text-gray-900">
        {sale.invoice_number || `INV-${sale.id.toString().padStart(3, '0')}`}
      </td>

      {/* Customer */}
      <td className="py-3.5 px-4">
        <div className="font-medium text-gray-800">
          {sale.customer_name || 'Guest / Walk-in'}
        </div>
        {sale.customer_email && (
          <div className="text-xs text-gray-400">{sale.customer_email}</div>
        )}
      </td>

      {/* Date */}
      <td className="px-4 py-3 text-sm text-slate-600">
      {sale.sale_date 
        ? new Date(sale.sale_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'N/A'}
    </td>

      {/* Items */}
      <td className="py-3.5 px-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          {sale.item_count || sale.items?.length || 0} items
        </span>
      </td>

      {/* Total Amount */}
      <td className="py-3.5 px-4 font-semibold text-gray-900 whitespace-nowrap">
        {formatCurrency ? formatCurrency(sale.total_amount) : `${sale.total_amount} ETB`}
      </td>

      {/* Payment Badge */}
      <td className="px-4 py-3 text-sm">
  {(() => {
    // Django choices: 'PAID', 'PARTIAL', 'UNPAID'
    const status = (sale.status || 'UNPAID').toUpperCase();

    let badgeClasses = "bg-amber-50 text-amber-700 border-amber-200"; // default UNPAID / PARTIAL
    
    if (status === 'PAID') {
      badgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (status === 'UNPAID') {
      badgeClasses = "bg-rose-50 text-rose-700 border-rose-200";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {status}
      </span>
    );
  })()}
</td>

      {/* Action Controls */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onView(sale)}
            title="View Details"
            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPrint(sale)}
            title="Print Invoice"
            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SalesRow;