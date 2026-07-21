import React from 'react';

export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-500">
      <span>Page {page} of {totalPages || 1}</span>
      <div className="flex gap-1">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}