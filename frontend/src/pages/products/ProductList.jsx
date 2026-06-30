import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Package, 
  Layers, 
  AlertTriangle, 
  XCircle,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function ProductsMainSection() {
  // Products listing structural mock array data
  const [products] = useState([
    { id: 1, name: "Nivea Lotion 200ml", sku: "NIV-LOT-200", category: "Skincare", brand: "Nivea", purchasePrice: 8.50, sellingPrice: 13.00, stock: 5, status: "Low Stock", updated: "2 mins ago" },
    { id: 2, name: "Lux Soap Bar Pack", sku: "LUX-SOP-6PK", category: "Personal Care", brand: "Unilever", purchasePrice: 3.10, sellingPrice: 5.50, stock: 10, status: "Low Stock", updated: "1 hour ago" },
    { id: 3, name: "Colgate Toothpaste", sku: "COL-TP-150", category: "Oral Care", brand: "Colgate", purchasePrice: 2.20, sellingPrice: 4.25, stock: 8, status: "Low Stock", updated: "3 hours ago" },
    { id: 4, name: "Head & Shoulders 400ml", sku: "HS-SHM-400", category: "Haircare", brand: "P&G", purchasePrice: 6.00, sellingPrice: 9.99, stock: 45, status: "In Stock", updated: "Yesterday" },
    { id: 5, name: "Dettol Hand Wash", sku: "DET-HW-250", category: "Hygiene", brand: "Reckitt", purchasePrice: 1.80, sellingPrice: 3.50, stock: 0, status: "Out of Stock", updated: "2 days ago" },
    { id: 6, name: "Johnson Baby Powder", sku: "JNJ-POW-500", category: "Baby Care", brand: "J&J", purchasePrice: 4.50, sellingPrice: 7.25, stock: 120, status: "In Stock", updated: "2 days ago" },
    { id: 1, name: "Nivea Lotion 200ml", sku: "NIV-LOT-200", category: "Skincare", brand: "Nivea", purchasePrice: 8.50, sellingPrice: 13.00, stock: 5, status: "Low Stock", updated: "2 mins ago" },
    { id: 2, name: "Lux Soap Bar Pack", sku: "LUX-SOP-6PK", category: "Personal Care", brand: "Unilever", purchasePrice: 3.10, sellingPrice: 5.50, stock: 10, status: "Low Stock", updated: "1 hour ago" },
    { id: 3, name: "Colgate Toothpaste", sku: "COL-TP-150", category: "Oral Care", brand: "Colgate", purchasePrice: 2.20, sellingPrice: 4.25, stock: 8, status: "Low Stock", updated: "3 hours ago" },

  ]);

  return (
    <div className="space-y-6 mx-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
      
      {/* ==================== UPPER CONTROLS & SUBHEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-xs text-slate-500 font-medium">Manage your inventory products and stock information.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Upload size={14} className="text-slate-400" />
            <span>Import</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            <Download size={14} className="text-slate-400" />
            <span>Export</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition">
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* ==================== 4 MAIN KPI PERFORMANCE CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Products</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">1,248</h3>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Categories</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">15</h3>
          </div>
          <div className="bg-purple-50 text-purple-600 p-3 rounded-xl shrink-0">
            <Layers size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Products</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">23</h3>
          </div>
          <div className="bg-amber-50 text-amber-500 p-3 rounded-xl shrink-0">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Out of Stock Products</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">7</h3>
          </div>
          <div className="bg-rose-50 text-rose-500 p-3 rounded-xl shrink-0">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* ==================== SEARCH & FILTERS CONTROLS TOOLBAR ==================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
            <span>Category</span> <ChevronDown size={12} className="text-slate-400" />
          </button>
          <button className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
            <span>Brand</span> <ChevronDown size={12} className="text-slate-400" />
          </button>
          <button className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
            <span>Stock Status</span> <ChevronDown size={12} className="text-slate-400" />
          </button>
          <button className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
            <span>Sort By</span> <ChevronDown size={12} className="text-slate-400" />
          </button>
          <button className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition" title="Advanced Filters">
            <Filter size={14} />
          </button>
          <button className="text-xs font-bold text-slate-400 hover:text-blue-600 px-2 py-2 ml-auto xl:ml-0">
            Reset
          </button>
        </div>
      </div>

      {/* ==================== EQUAL HEIGHT SPLIT CONTAINER ==================== */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        
        {/* LEFT CANVAS: NO SCROLLBAR NATURAL HEIGHT PRODUCTS TABLE */}
        <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="w-12 px-5 py-3.5 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </th>
                  <th className="px-5 py-3.5 min-w-[180px]">Product Details</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Selling Price</th>
                  <th className="px-5 py-3.5 text-center">Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="w-16 px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 transition group">
                    <td className="px-5 py-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-400 shrink-0">
                          IMG
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 block truncate">{product.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400 tracking-wide block uppercase mt-0.5">{product.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{product.category}</td>
                    <td className="px-5 py-4 font-extrabold text-slate-900">${product.sellingPrice.toFixed(2)}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{product.stock}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-md font-bold text-[10px] border tracking-wide uppercase ${
                        product.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        product.status === 'Low Stock' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center relative">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 absolute inset-0 bg-white/90 backdrop-blur-xs transition-opacity duration-150">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition" title="View details">
                          <Eye size={13} />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition" title="Edit">
                          <Edit size={13} />
                        </button>
                        <button className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition group-hover:invisible mx-auto block">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT CANVAS: EQUAL-HEIGHT ALIGNED SIDEBAR FOR INSIGHTS & ALERTS */}
        <div className="w-full lg:w-[200px] flex flex-col justify-between gap-4 shrink-0">
          
          {/* INSIGHTS BLOCK CARD */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3.5 flex flex-col justify-between">
            <h4 className="text-xs font-extrabold text-slate-800 tracking-wide uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500" />
              <span>Quick Product Insights</span>
            </h4>
            
            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              {/* Most Sold */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                  <TrendingUp size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Most Sold</span>
                  <span className="text-xs font-bold text-slate-700 block truncate">Nivea Lotion 200ml</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">412 Units sold this month</span>
                </div>
              </div>

              {/* Highest Revenue */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 mt-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                  <DollarSign size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Highest Revenue</span>
                  <span className="text-xs font-bold text-slate-700 block truncate">Head & Shoulders 400ml</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">$4,095.00 generated</span>
                </div>
              </div>

              {/* Recently Added */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 mt-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                  <Calendar size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recently Added</span>
                  <span className="text-xs font-bold text-slate-700 block truncate">Dettol Hand Wash</span>
                  <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">Added 2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* INVENTORY ALERTS PANEL WITH INTEGRATED ACTION BUTTON */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Inventory Alerts Panel</span>
              </h4>

              {/* Active Warning Stack */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">Nivea Lotion</span>
                  </span>
                  <span className="text-[10px] bg-amber-100/80 px-2 py-0.5 rounded-md text-amber-700 font-bold tracking-tight shrink-0">5 Units left</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">Lux Soap</span>
                  </span>
                  <span className="text-[10px] bg-amber-100/80 px-2 py-0.5 rounded-md text-amber-700 font-bold tracking-tight shrink-0">10 Units left</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-100 rounded-xl text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">Face Wash</span>
                  </span>
                  <span className="text-[10px] bg-rose-100/80 px-2 py-0.5 rounded-md text-rose-700 font-bold tracking-tight shrink-0">Out of Stock</span>
                </div>
              </div>
            </div>

            {/* RESTOCK PRODUCTS BUTTON */}
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 group">
              <RefreshCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>Restock Products</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}