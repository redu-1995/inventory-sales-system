import React from 'react';

export default function StatusBadge({ active, stock }) {
  // Determine text and color configurations based on inventory stock levels
  let badgeText = "In Stock";
  let badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (!active) {
    badgeText = "Inactive";
    badgeStyles = "bg-gray-100 text-gray-600 border-gray-200";
  } else if (stock === 0) {
    badgeText = "Out of Stock";
    badgeStyles = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (stock <= 10) {
    badgeText = "Low Stock";
    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles}`}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
        badgeText === "In Stock" ? "bg-emerald-500" :
        badgeText === "Low Stock" ? "bg-amber-500" :
        badgeText === "Out of Stock" ? "bg-rose-500" : "bg-gray-400"
      }`} />
      {badgeText}
    </span>
  );
}