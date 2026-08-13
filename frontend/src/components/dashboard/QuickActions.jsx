import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ShoppingCart, PackagePlus, UserPlus } from 'lucide-react';

export const QuickActions = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 tracking-tight mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* New Sale */}
        <Link
          to="/sales"
          className="flex items-center justify-center gap-2.5 p-3.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 text-blue-700 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-xs hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <ShoppingCart className="w-4 h-4 text-blue-600 shrink-0" />
          <span>New Sale</span>
        </Link>

        {/* Purchase Order */}
        <Link
          to="/purchase-orders"
          className="flex items-center justify-center gap-2.5 p-3.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 text-emerald-700 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-xs hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Purchase Order</span>
        </Link>

        {/* Add Product */}
        <Link
          to="/products"
          className="flex items-center justify-center gap-2.5 p-3.5 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/60 text-purple-700 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-xs hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <PackagePlus className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Add Product</span>
        </Link>

        {/* Add Customer */}
        <Link
          to="/customers"
          className="flex items-center justify-center gap-2.5 p-3.5 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60 text-amber-700 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-xs hover:shadow focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <UserPlus className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Add Customer</span>
        </Link>
      </div>
    </div>
  );
};