import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

/**
 * CustomerRow Component
 * Renders a single customer table row with mapped fields and actions.
 */
export default function CustomerRow({
  customer,
  onView,
  onEdit,
  onDelete,
}) {
  // Format currency values
  const formatETB = (amount) => `ETB ${Number(amount || 0).toLocaleString()}`;

  // Get two-letter initials for avatar
  const getInitials = (name) => {
    if (!name) return 'CU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isInactive = customer.status?.toUpperCase() === 'INACTIVE';
  const totalSpent = customer.total_spent ?? customer.total_purchases ?? 0;
  const balance = customer.outstanding_balance ?? customer.balance ?? 0;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      {/* Checkbox */}
      <td className="p-4">
        <input 
          type="checkbox" 
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
        />
      </td>

      {/* Customer Name & Initials Avatar */}
      <td className="p-4 font-medium text-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
            {getInitials(customer.full_name || customer.name)}
          </div>
          <span className="font-semibold text-slate-900">{customer.full_name || customer.name}</span>
        </div>
      </td>

      {/* Phone Number */}
      <td className="p-4 text-slate-600 font-mono text-xs">{customer.phone || '—'}</td>

      {/* Email Address */}
      <td className="p-4">
        {customer.email ? (
          <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
            {customer.email}
          </a>
        ) : (
          '—'
        )}
      </td>

      {/* Total Purchases / Spent */}
      <td className="p-4 font-semibold text-slate-800">
        {formatETB(totalSpent)}
      </td>

      {/* Outstanding Balance */}
      <td className="p-4 font-semibold text-slate-800">
        {formatETB(balance)}
      </td>

      {/* Status Badge */}
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
            isInactive
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
          }`}
        >
          {customer.status ? customer.status.toLowerCase() : 'active'}
        </span>
      </td>

      {/* Action Buttons */}
      <td className="p-4">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onView(customer)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(customer)}
            title="Edit Customer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(customer.id, customer.full_name || customer.name)}
            title="Delete Customer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}