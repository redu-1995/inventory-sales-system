import { formatCurrency } from './formatCurrency';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTrend = (percentage) => {
  if (percentage === undefined || percentage === null) return null;
  const isPositive = percentage >= 0;
  return {
    text: `${isPositive ? '▲' : '▼'} ${Math.abs(percentage)}%`,
    isPositive,
  };
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'received':
    case 'in stock':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'partial':
    case 'pending':
    case 'low stock':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'unpaid':
    case 'cancelled':
    case 'out of stock':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};