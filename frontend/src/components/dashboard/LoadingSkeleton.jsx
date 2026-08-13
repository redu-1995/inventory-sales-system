import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse p-2 sm:p-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded-xl w-48 sm:w-64" />
          <div className="h-4 bg-slate-200 rounded-lg w-32" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-24" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200/80 rounded-2xl border border-slate-100 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-300 rounded w-20" />
              <div className="h-9 w-9 bg-slate-300 rounded-xl" />
            </div>
            <div className="h-7 bg-slate-300 rounded-lg w-28" />
          </div>
        ))}
      </div>

      {/* Charts & Secondary Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-200/80 rounded-2xl border border-slate-100 p-6" />
        <div className="h-80 bg-slate-200/80 rounded-2xl border border-slate-100 p-6" />
      </div>
    </div>
  );
};