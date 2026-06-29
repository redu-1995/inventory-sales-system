import React from "react";
import SearchBar from "../common/SearchBar";
import { Bell, ChevronDown } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  // 1. Debug tool to safely see exactly what fields your backend is providing in the console
  console.log("Current Context User Payload Data:", user);

  // 2. Helper utility to map raw backend roles to design system colors (#2563EB, #10B981, #EF4444)
  const getRoleStyle = (role) => {
    const cleanRole = String(role || "").toUpperCase();
    
    switch (cleanRole) {
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-200";
      case "MANAGER":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CASHIER":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // 3. Normalize the string to prevent layout fallback failure issues
  const userRoleDisplay = user?.role || "Staff";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-xs">
      
      {/* Search Bar Wrapper - Pushed cleanly to the left or center based on viewport space */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* Right Section utilities */}
      <div className="flex items-center gap-6 ml-auto">

        {/* Interactive Notifications System Toggle Bell */}
        <button className="relative text-slate-500 hover:text-blue-600 transition duration-150 p-1.5 rounded-lg hover:bg-slate-50">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Separator Line split vertical gutter */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* Active Interactive User Details Profile Component */}
        <button className="flex items-center gap-3 hover:bg-slate-50 rounded-xl px-2.5 py-1.5 transition duration-150 group text-left">
          
          {/* Avatar Icon placeholder generating standard initial uppercase string letters */}
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm tracking-wide shadow-blue-200 group-hover:scale-105 transition duration-150">
            {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
          </div>

          {/* Dynamic Username Identification & Role Badge */}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.username || "Authenticated User"}
            </span>
            <div className="mt-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wider uppercase ${getRoleStyle(userRoleDisplay)}`}>
                {userRoleDisplay}
              </span>
            </div>
          </div>

          <ChevronDown
            size={14}
            className="text-slate-400 group-hover:text-slate-600 transition duration-150 ml-1"
          />
        </button>

      </div>
    </header>
  );
}