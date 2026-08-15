// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, X, ChevronDown, User, LogOut } from "lucide-react";
import { useSearch } from "../../hooks/useSearch";
import { useNotifications } from "../../hooks/useNotifications";
import useAuth from "../../hooks/useAuth";
import SearchDropdown from "../../components/Header/SearchDropdown";
import NotificationDropdown from "../../components/Header/NotificationDropdown";

export default function Header() {
  // Auth state
  const { user, logout } = useAuth();

  // Local UI states
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Custom Data Hooks
  const { results, loading } = useSearch(query);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Click-outside refs
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const userRoleDisplay = user?.role || "Staff";

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
      {/* ------------------------------------------------------------------- */}
      {/* GLOBAL SEARCH SECTION                                               */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative w-full max-w-md" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => query.trim().length >= 2 && setIsSearchOpen(true)}
            placeholder="Search products, customers, invoices..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsSearchOpen(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isSearchOpen && (
          <SearchDropdown
            results={results}
            loading={loading}
            query={query}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* RIGHT UTILITIES SECTION                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-center gap-4 lg:gap-6 ml-auto">
        {/* Notification Bell Container */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationDropdown
              notifications={notifications}
              onMarkRead={markAsRead}
              onMarkAllRead={markAllAsRead}
            />
          )}
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2.5 py-1.5 transition group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm tracking-wide shadow-blue-200 group-hover:scale-105 transition">
              {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
            </div>

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

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">{userRoleDisplay}</p>
              </div>

             
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