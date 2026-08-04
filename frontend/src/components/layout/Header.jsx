import React, { useState } from "react";
import SearchBar from "../common/SearchBar";
import { Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Header({ onSearch }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  // 1. Helper utility to map raw backend roles to design system styles
  const getRoleStyle = (role) => {
    const cleanRole = String(role || "").toUpperCase();

    switch (cleanRole) {
      case "ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "MANAGER":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CASHIER":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // 2. Search handlers
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const userRoleDisplay = user?.role || "Staff";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95 transition-all">
      {/* ------------------------------------------------------------------- */}
      {/* SEARCH BAR SECTION                                                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          {/* If your SearchBar component accepts props, pass value & onChange */}
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            placeholder="Search products, orders, SKU, or customers..."
          />
        </form>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* RIGHT UTILITIES SECTION                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center gap-4 lg:gap-6 ml-auto">
        {/* Notification Icon Button */}
        <button
          onClick={() => setHasNotifications(false)}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* Interactive User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2.5 py-1.5 transition duration-150 group text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm tracking-wide shadow-blue-200 group-hover:scale-105 transition duration-150">
              {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
            </div>

            {/* Username & Role Tag */}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                {user?.username || "Authenticated User"}
              </span>
              <div className="mt-0.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wider uppercase ${getRoleStyle(
                    userRoleDisplay
                  )}`}
                >
                  {userRoleDisplay}
                </span>
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180 text-slate-700" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">{userRoleDisplay}</p>
              </div>

              <a
                href="#profile"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
              >
                <User className="w-4 h-4" /> Profile Settings
              </a>

              {logout && (
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition border-t border-slate-100 mt-1"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}