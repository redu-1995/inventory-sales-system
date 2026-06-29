import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Tags,
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
      name: "Categories",
      path: "/categories",
      icon: Tags,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: Boxes,
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
    {
      name: "Users",
      path: "/users",
      icon: Users,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#111827] flex flex-col shadow-lg fixed left-0 top-0 overflow-hidden">

      {/* Logo & Menu */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="h-16 flex items-center px-6 border-b border-slate-700">

          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            I
          </div>

          <div className="ml-3">
            <h1 className="text-white font-bold text-lg">
              IMS <span className="text-blue-400">Pro</span>
            </h1>
          </div>

        </div>

        {/* Menu Title */}

        <p className="px-6 mt-6 mb-3 text-[11px] tracking-widest text-slate-500 uppercase font-semibold">
          Main Menu
        </p>

        {/* Navigation */}

        <nav className="px-3 space-y-0.5 overflow-y-auto flex-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={16}
                  className={`mr-2 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                <span className="flex-1 text-left truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout - Sticky at bottom */}

      <div className="p-4 border-t border-slate-700 shrink-0">

        <button
          onClick={logout}
          className="group flex items-center w-full px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <LogOut size={16} className="mr-2 shrink-0" />

          <span className="truncate">Logout</span>
        </button>

      </div>

    </aside>
  );
}