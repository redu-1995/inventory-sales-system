import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center border border-slate-200">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          Inventory System Frontend
        </h1>
        <p className="text-slate-600 mb-4">
          Vite, React, and Tailwind CSS are successfully configured!
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
          ● Ready for API Integration
        </span>
      </div>
    </div>
  );
}

export default App;