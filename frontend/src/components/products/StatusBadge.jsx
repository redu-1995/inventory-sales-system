import React from 'react';

export default function StatusBadge({ status, stock }) {
  // Determine text and color configurations based on product status and stock levels
  let badgeText = "In Stock";
  let badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let dotColor = "bg-emerald-500";

  // If product is inactive (status = false)
  if (status === false) {
    badgeText = "Inactive";
    badgeStyles = "bg-gray-100 text-gray-600 border-gray-200";
    dotColor = "bg-gray-400";
  } 
  // If product is active (status = true), check stock levels
  else if (status === true) {
    if (stock === 0 || stock === null || stock === undefined) {
      badgeText = "Out of Stock";
      badgeStyles = "bg-rose-50 text-rose-700 border-rose-200";
      dotColor = "bg-rose-500";
    } else if (stock <= 10) {
      badgeText = "Low Stock";
      badgeStyles = "bg-amber-50 text-amber-700 border-amber-200";
      dotColor = "bg-amber-500";
    }
    // else it stays "In Stock" (green)
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles}`}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {badgeText}
    </span>
  );
}