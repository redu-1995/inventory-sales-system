// src/components/Header/SearchDropdown.jsx
import React from "react";
import { Link } from "react-router-dom";
import { User, Package, FileText, Loader2 } from "lucide-react";

export default function SearchDropdown({ results, loading, query, onClose }) {
  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 p-4 z-50 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-sm">Searching...</span>
      </div>
    );
  }

  const hasResults =
    (results?.customers?.length || 0) > 0 ||
    (results?.products?.length || 0) > 0 ||
    (results?.sales?.length || 0) > 0;

  if (!hasResults && query.trim().length >= 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 p-4 z-50 text-center text-slate-500 text-sm">
        No results found for "{query}"
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 max-h-96 overflow-y-auto divide-y divide-slate-100">
      {/* CUSTOMERS SECTION */}
      {results?.customers?.length > 0 && (
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 tracking-wider uppercase">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customers</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {results.customers.map((customer) => {
              const name = customer.name || customer.full_name || "Customer";
              return (
                <Link
                  key={customer.id}
                  to={`/customers?search=${encodeURIComponent(name)}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-slate-800">{name}</span>
                    {customer.phone && (
                      <span className="text-xs text-slate-400">{customer.phone}</span>
                    )}
                  </div>
                  {customer.email && (
                    <span className="text-xs text-slate-400 ml-4 truncate">{customer.email}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* PRODUCTS SECTION */}
      {results?.products?.length > 0 && (
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 tracking-wider uppercase">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            <span>Products</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {results.products.map((product) => (
              <Link
                key={product.id}
                to={`/products?search=${encodeURIComponent(product.name)}`}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">{product.name}</span>
                  <span className="text-xs text-slate-400">SKU: {product.sku || "N/A"}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  ${Number(product.selling_price || 0).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SALES / INVOICES SECTION */}
      {results?.sales?.length > 0 && (
        <div className="p-2">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 tracking-wider uppercase">
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Sales & Invoices</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {results.sales.map((sale) => (
              <Link
                key={sale.id}
                to={`/sales?search=${sale.id}`}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition text-left"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">Sale #{sale.id}</span>
                  <span className="text-xs text-slate-400">
                    {sale.customer_name || sale.customer?.full_name || "Guest"}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  ${Number(sale.total_amount || 0).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}