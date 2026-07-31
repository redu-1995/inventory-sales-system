import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ShoppingCart, PackagePlus, UserPlus } from 'lucide-react';

export const QuickActions = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/sales"
          className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> + New Sale
        </Link>
        <Link
          to="/purchase-orders"
          className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm hover:bg-emerald-100 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> + Purchase Order
        </Link>
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm hover:bg-purple-100 transition-colors"
        >
          <PackagePlus className="w-4 h-4" /> + Add Product
        </Link>
        <Link
          to="/customers"
          className="flex items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg font-medium text-sm hover:bg-amber-100 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> + Add Customer
        </Link>
      </div>
    </div>
  );
};