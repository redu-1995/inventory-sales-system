// src/components/common/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

//  MUST use curly braces { value, onChange, placeholder } to destructure props!
export default function SearchBar({ value = "", onChange, placeholder }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Search products..."}
        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-150"
      />
    </div>
  );
}