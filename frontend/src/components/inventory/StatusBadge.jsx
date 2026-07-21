import React from 'react';

export default function StatusBadge({ quantity, minimumLevel }) {
  const isOut = quantity === 0;
  const isLow = quantity <= minimumLevel;

  let badgeClasses = "bg-green-100 text-green-800 border-green-200";
  let statusText = "In Stock";

  if (isOut) {
    badgeClasses = "bg-red-100 text-red-800 border-red-200";
    statusText = "Out of Stock";
  } else if (isLow) {
    badgeClasses = "bg-amber-100 text-amber-800 border-amber-200";
    statusText = "Low Stock";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-green-500'}`} />
      {statusText}
    </span>
  );
}
