import React from "react";
import SearchBar from "../common/SearchBar";
import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">

      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <SearchBar />
    </div>
      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">

        {/* Notification */}

        <button className="relative text-slate-500 hover:text-blue-600 transition">

          <Bell size={20} />

          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>

        </button>

        {/* User */}

        <button className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-2 py-1 transition">

          {/* Avatar */}

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">

            {user?.username
              ? user.username.charAt(0).toUpperCase()
              : "A"}

          </div>

          <div className="hidden md:block text-left">

            <h4 className="text-sm font-semibold text-slate-800 leading-none">
              {user?.username || "Admin"}
            </h4>

            <p className="text-xs text-slate-500 mt-1">
              {user?.role || "Administrator"}
            </p>

          </div>

          <ChevronDown
            size={16}
            className="text-slate-400"
          />

        </button>

      </div>

    </header>
  );
}