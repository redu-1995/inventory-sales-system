import React from 'react';

export default function ProductStats({ statistics, loading }) {
  // 1. Handle the loading skeleton state cleanly
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="bg-gray-100 h-28 rounded-xl border border-gray-200/60 p-5"></div>
        ))}
      </div>
    );
  }

  // 2. Map backend response variables seamlessly 
  const statCards = [
    {
      id: 1,
      title: "Total Products",
      value: statistics?.total_products ?? 0,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgIcon: "bg-blue-50",
      trend: "Live database tracking",
      trendColor: "text-emerald-600"
    },
    {
      id: 2,
      title: "Total Categories",
      value: statistics?.total_categories ?? 0, // Fallback if your core endpoint doesn't aggregate categories yet
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      bgIcon: "bg-purple-50",
      trend: "Active structural groups",
      trendColor: "text-gray-500"
    },
    {
      id: 3,
      title: "Low Stock Products",
      value: statistics?.low_stock ?? 0,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgIcon: "bg-amber-50",
      trend: "Requires attention",
      trendColor: "text-amber-600"
    },
    {
      id: 4,
      title: "Out of Stock",
      value: statistics?.out_of_stock ?? 0,
      icon: (
        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgIcon: "bg-rose-50",
      trend: "Critical depletion level",
      trendColor: "text-rose-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((card) => (
        <div
          key={card.id}
          className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border border-gray-100 p-5 flex items-center space-x-4 group"
        >
          <div className={`p-3 rounded-xl transition-colors duration-200 ${card.bgIcon}`}>
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{card.title}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {card.value}
              </span>
            </div>
            <p className={`text-xs font-medium truncate mt-0.5 ${card.trendColor}`}>
              {card.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}