import React from 'react';

const STATUS_STYLES = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  partially_paid: 'bg-blue-50 text-blue-700 border-blue-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
};

const PaymentStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  const badgeClass =
    STATUS_STYLES[normalizedStatus] || 'bg-gray-50 text-gray-700 border-gray-200';

  const label = normalizedStatus.replace('_', ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {label}
    </span>
  );
};

export default PaymentStatusBadge;