import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  FileText, 
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: Boxes,
    },
    {
      name: "Purchase Orders",
      path: "/purchase-orders",
      icon: FileText,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-60 h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col shadow-2xl fixed left-0 top-0 overflow-hidden z-40 select-none">

      {/* Header / Brand Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center space-x-3">
          {/* Logo Badge */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
            <Boxes className="w-5 h-5 text-white" />
          </div>

          {/* System Name */}
          <div className="flex flex-col">
            <h1 className="text-white font-black text-lg tracking-tight leading-none flex items-center">
              Stock<span className="text-indigo-400 font-extrabold">Flow</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">
              Sales & Inventory
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden py-5">

        {/* Section Label */}
        <p className="px-5 mb-2.5 text-[10px] tracking-widest text-slate-500 uppercase font-bold">
          Main Menu
        </p>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group relative flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                {/* Active Left Indicator Strip */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                )}

                <Icon
                  size={18}
                  className={`mr-3 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-400"
                  }`}
                />

                <span className="flex-1 text-left truncate tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sticky Logout */}
      <div className="p-3 border-t border-slate-800/80 shrink-0 bg-slate-950">
        <button
          onClick={logout}
          className="group flex items-center w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all duration-200"
        >
          <LogOut size={18} className="mr-3 shrink-0 text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>

    </aside>
  );
}