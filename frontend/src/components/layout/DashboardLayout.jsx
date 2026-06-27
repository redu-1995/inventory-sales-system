import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased">
      {/* Sidebar - Stays fixed on the left */}
      <Sidebar />

      {/* Main Structural View Panel Container Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Dynamic Inner Component Content Target Mount viewport */}
        <main className="flex-1 overflow-y-auto p-8 animate-fadeIn">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}