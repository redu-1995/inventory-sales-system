import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content Area with left margin for fixed sidebar */}
      <div className="ml-56 h-screen flex flex-col">
        <Header />
        
        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}