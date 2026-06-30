import React from 'react';
export default function BulkActions({ selectedCount, onDelete }) {
  if (selectedCount === 0) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center mb-4 animate-fade-in">
      <span className="text-sm text-blue-800 font-medium">{selectedCount} items selected</span>
      <button onClick={onDelete} className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
        Delete Selected
      </button>
    </div>
  );
}