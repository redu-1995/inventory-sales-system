import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Package, 
  Layers, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  ShoppingCart,
  BarChart3,
  Users,
  Gauge,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';

// Animations CSS
const dashboardStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .stat-card-1 { animation-delay: 0s; }
  .stat-card-2 { animation-delay: 0.1s; }
  .stat-card-3 { animation-delay: 0.2s; }
  .stat-card-4 { animation-delay: 0.3s; }

  .hover-lift:hover {
    transform: translateY(-8px);
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = dashboardStyles;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}

export default function Dashboard() {
  // KPI Statistics Cards Data
  const stats = [
    { 
      title: "Total Products", 
      value: "3,842", 
      change: "+3.4%",
      comparison: "+124 vs last month",
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      trend: "up"
    },
    { 
      title: "Total Inventory Value", 
      value: "$125,000", 
      change: "+7.0%",
      comparison: "+$8,200 vs last month",
      icon: DollarSign, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      trend: "up"
    },
    { 
      title: "Today's Sales", 
      value: "$4,250", 
      change: "+171%",
      comparison: "+$620 vs yesterday",
      icon: TrendingUp, 
      color: "text-orange-500", 
      bg: "bg-orange-50",
      trend: "up"
    },
    { 
      title: "Low Stock Items", 
      value: "18", 
      change: "+20%",
      comparison: "+3 need reorder",
      icon: AlertTriangle, 
      color: "text-rose-500", 
      bg: "bg-rose-50",
      trend: "up"
    },
  ];

  // Products Table Mock Data
  const products = [
    { name: "Nivea Lotion 200ml", sku: "NIV-LOT-200", category: "Skincare", purchasePrice: "$8.50", sellingPrice: "$13.00", stock: 5, status: "Low Stock", updated: "2 mins ago" },
    { name: "Lux Soap Bar Pack", sku: "LUX-SOP-6PK", category: "Personal Care", purchasePrice: "$3.10", sellingPrice: "$5.50", stock: 10, status: "Low Stock", updated: "1 hour ago" },
    { name: "Colgate Toothpaste", sku: "COL-TP-150", category: "Oral Care", purchasePrice: "$2.20", sellingPrice: "$4.25", stock: 8, status: "Low Stock", updated: "3 hours ago" },
    { name: "Head & Shoulders 400ml", sku: "HS-SHM-400", category: "Haircare", purchasePrice: "$6.00", sellingPrice: "$9.99", stock: 14, status: "In Stock", updated: "Yesterday" },
    { name: "Dettol Hand Wash", sku: "DET-HW-250", category: "Hygiene", purchasePrice: "$1.80", sellingPrice: "$3.50", stock: 0, status: "Out of Stock", updated: "2 days ago" },
    { name: "Johnson Baby Powder", sku: "JNJ-POW-500", category: "Baby Care", purchasePrice: "$4.50", sellingPrice: "$7.25", stock: 12, status: "In Stock", updated: "2 days ago" },
  ];

  // State for Sales Performance time period
  const [timePeriod, setTimePeriod] = useState('Daily');

  // Recent Transactions Data
  const recentTransactions = [
    { invoiceId: "INV-1042", customer: "Marcus Allen", avatar: "M", avatarBg: "bg-rose-600", product: "Nivea Lotion 200ml", qty: "×4", amount: "$52.00", date: "Jun 18, 2026", status: "Completed" },
    { invoiceId: "INV-1041", customer: "Priya Nair", avatar: "P", avatarBg: "bg-yellow-500", product: "Colgate Toothpaste", qty: "×2", amount: "$18.50", date: "Jun 18, 2026", status: "Completed" },
    { invoiceId: "INV-1040", customer: "Samuel Osei", avatar: "S", avatarBg: "bg-emerald-600", product: "Lux Soap 6-Pack", qty: "×1", amount: "$14.00", date: "Jun 18, 2026", status: "Pending" },
    { invoiceId: "INV-1039", customer: "Mia Torres", avatar: "M", avatarBg: "bg-cyan-500", product: "Head & Shoulders 400ml", qty: "×3", amount: "$42.75", date: "Jun 17, 2026", status: "Completed" },
    { invoiceId: "INV-1038", customer: "Liam Chen", avatar: "L", avatarBg: "bg-blue-600", product: "Dettol Hand Wash", qty: "×5", amount: "$37.50", date: "Jun 17, 2026", status: "Cancelled" },
    { invoiceId: "INV-1037", customer: "Aisha Kamara", avatar: "A", avatarBg: "bg-purple-600", product: "Johnson Baby Powder", qty: "×2", amount: "$24.00", date: "Jun 17, 2026", status: "Pending" },
    { invoiceId: "INV-1036", customer: "David Okonkwo", avatar: "D", avatarBg: "bg-red-600", product: "Nivea Lotion 200ml", qty: "×6", amount: "$78.00", date: "Jun 16, 2026", status: "Completed" },
    { invoiceId: "INV-1035", customer: "Fatima Al-Rashid", avatar: "F", avatarBg: "bg-yellow-600", product: "Colgate Toothpaste", qty: "×4", amount: "$37.00", date: "Jun 16, 2026", status: "Completed" },
  ];

  // Low Stock Alerts Data
  const lowStockAlerts = [
    { name: "Nivea Lotion 200ml", status: "Critical", stock: "5/20", color: "text-rose-600", bg: "bg-rose-50", badgeBg: "bg-rose-100" },
    { name: "Lux Soap Bar Pack", status: "Low", stock: "10/25", color: "text-orange-500", bg: "bg-orange-50", badgeBg: "bg-orange-100" },
    { name: "Colgate Toothpaste", status: "Critical", stock: "8/20", color: "text-rose-600", bg: "bg-rose-50", badgeBg: "bg-rose-100" },
    { name: "Head & Shoulders 400ml", status: "Low", stock: "14/25", color: "text-orange-500", bg: "bg-orange-50", badgeBg: "bg-orange-100" },
    { name: "Dettol Hand Wash", status: "Critical", stock: "7/15", color: "text-rose-600", bg: "bg-rose-50", badgeBg: "bg-rose-100" },
    { name: "Johnson Baby Powder", status: "Low", stock: "12/20", color: "text-orange-500", bg: "bg-orange-50", badgeBg: "bg-orange-100" },
  ];

  // Utilization Data
  const utilizationData = [
    { title: "In Stock Products", value: "3,614", total: "of 3,842 total", utilization: 94, icon: Package, color: "text-emerald-600", barColor: "bg-emerald-500" },
    { title: "Out of Stock", value: "228", total: "of 3,842 total", utilization: 6, icon: AlertTriangle, color: "text-rose-600", barColor: "bg-rose-500" },
    { title: "Categories", value: "24", total: "Categories", utilization: 72, icon: Layers, color: "text-blue-600", barColor: "bg-blue-500" },
    { title: "Suppliers", value: "38", total: "Suppliers", utilization: 88, icon: Users, color: "text-purple-600", barColor: "bg-purple-500" },
  ];

  // Quick Actions Data
  const quickActions = [
    { title: "Add Product", description: "Register a new product to inventory", icon: Plus, color: "text-blue-600", bg: "bg-blue-50", action: "Add" },
    { title: "Create Sale", description: "Record a new sales transaction", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50", action: "Create" },
    { title: "Generate Report", description: "Export business performance report", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", action: "Export" },
    { title: "Add Customer", description: "Register a new customer profile", icon: Users, color: "text-orange-600", bg: "bg-orange-50", action: "Register" },
  ];

  // Activity Timeline Data
  const activityTimeline = [
    { title: "Product Added", description: '"Dove Shampoo 500ml" added to inventory — 150 units stocked', icon: Package, color: "text-blue-600", bg: "bg-blue-50", time: "2 minutes ago" },
    { title: "Sale Completed", description: "Invoice #INV-1042 — Marcus Allen - $52.00 · 4 items", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50", time: "18 minutes ago" },
    { title: "Low Stock Alert", description: "Nivea Lotion 200ml is critically low — only 5 units remaining", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", time: "34 minutes ago" },
    { title: "Inventory Updated", description: "Stock count adjusted for 12 products after quarterly audit", icon: Package, color: "text-orange-500", bg: "bg-orange-50", time: "2 hours ago" },
    { title: "Customer Registered", description: "Mia Torres joined as a new customer — Lagos, Nigeria", icon: Users, color: "text-purple-600", bg: "bg-purple-50", time: "3 hours ago" },
    { title: "Report Generated", description: "Monthly inventory report for May 2026 exported as PDF", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", time: "5 hours ago" },
  ];

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6 p-8">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex items-start justify-between animate-fadeInUp">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Welcome back, Admin <span className="text-4xl animate-float">👋</span>
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Here's an overview of your business today.</p>
        </div>
        <div className="text-right animate-slideInLeft">
          <p className="text-sm font-semibold text-slate-600 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">{getFormattedDate()}</p>
        </div>
      </div>

      {/* 2. PRODUCT STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          const isPositive = stat.trend === "up";
          const cardClasses = `stat-card-${idx + 1}`;
          return (
            <div 
              key={idx} 
              className={`${cardClasses} animate-fadeInUp bg-gradient-to-br from-white to-slate-50 border-l-4 border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift cursor-pointer group overflow-hidden relative`}
              style={{borderLeftColor: stat.color.includes('blue') ? '#2563eb' : stat.color.includes('emerald') ? '#059669' : stat.color.includes('orange') ? '#f97316' : '#ef4444'}}>
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 group-hover:text-slate-600 transition-colors">{stat.title}</span>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">{stat.value}</h3>
                  <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors font-medium">{stat.comparison}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={20} strokeWidth={2} />
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-opacity-10 ${isPositive ? 'bg-emerald-500 text-emerald-700' : 'bg-rose-500 text-rose-700'}`}>
                  {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SALES PERFORMANCE & LOW STOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Performance Chart */}
        <div className="lg:col-span-2 animate-slideInLeft bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sales Performance</h3>
              <p className="text-sm text-slate-500 mt-0.5">Revenue & order volume overview</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
              {['Daily', 'Weekly', 'Monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    timePeriod === period
                      ? 'bg-white text-blue-600 border border-blue-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-xs font-medium text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-xs font-medium text-slate-600">Orders</span>
            </div>
          </div>

          {/* Simplified Chart Visualization */}
          <div className="relative h-64 flex items-end justify-between px-4 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 rounded-lg p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 font-semibold">
              <span>6000</span>
              <span>4500</span>
              <span>3000</span>
              <span>1500</span>
              <span>0</span>
            </div>

            {/* Chart bars/lines representation */}
            <div className="flex-1 ml-12 flex items-end justify-around gap-2 h-full">
              {[45, 60, 50, 65, 70, 55, 65].map((value, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 justify-end gap-1 group cursor-pointer" style={{animation: `fadeInUp 0.6s ease-out ${0.1 * idx}s both`}}>
                  <div className="w-full bg-gradient-to-t from-cyan-500 via-cyan-400 to-cyan-300 rounded-t opacity-80 group-hover:opacity-100 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-y-110" style={{height: `${(value / 100) * 200}px`}}></div>
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-12 right-0 flex justify-around text-[11px] text-slate-400 font-medium">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Sidebar */}
        <div className="animate-scaleIn bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-3 bg-rose-100 rounded-lg text-rose-600 shrink-0 group-hover:scale-110 transition-transform duration-300">
              <AlertCircle size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Low Stock Alerts</h3>
              <p className="text-xs text-slate-500 mt-0.5">6 items need attention</p>
            </div>
          </div>

          {/* Scrollable Alert List */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-96">
            {lowStockAlerts.map((item, idx) => (
              <div key={idx} className={`${item.bg} rounded-lg p-3 border border-slate-100 hover:border-slate-300 transition-all duration-200 hover:shadow-md transform hover:scale-105`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-900 flex-1">{item.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.badgeBg} ${item.color}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden mr-3 shadow-inner">
                    <div 
                      className={`h-full transition-all duration-500 ${item.status === 'Critical' ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`}
                      style={{width: item.stock.split('/')[0] / item.stock.split('/')[1] * 100 + '%'}}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{item.stock}</span>
                </div>
              </div>
            ))}
          </div>

          {/* View Inventory Button */}
          <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transform group">
            View Inventory
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* 4. RECENT TRANSACTIONS */}
      <div className="animate-fadeInUp bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500 mt-1">8 entries</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition w-40"
              />
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
              <span>All Status</span> <ChevronDown size={12} className="text-slate-400" />
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
              <Filter size={12} /> <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition">
              View All
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200">
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Invoice ID</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Customer</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Product</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Qty</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Amount</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Date</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wide text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((transaction, idx) => (
                <tr key={idx} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group hover:shadow-md" style={{animation: `fadeInUp 0.5s ease-out ${0.05 * idx}s both`}}>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer group-hover:scale-105 transition-transform inline-block">{transaction.invoiceId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`${transaction.avatarBg} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        {transaction.avatar}
                      </div>
                      <span className="font-semibold text-slate-900">{transaction.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{transaction.product}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{transaction.qty}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{transaction.amount}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{transaction.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                      transaction.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      transaction.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. UTILIZATION METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {utilizationData.map((item, idx) => {
          const IconComponent = item.icon;
          const cardClasses = `stat-card-${idx + 1}`;
          return (
            <div key={idx} className={`${cardClasses} animate-fadeInUp bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: item.barColor.split('-')[1]}}></div>
                    <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">{item.title}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: item.bg}}>
                  <IconComponent size={18} className={item.color} />
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300" style={{backgroundImage: item.color.includes('emerald') ? 'linear-gradient(135deg, #059669, #047857)' : item.color.includes('rose') ? 'linear-gradient(135deg, #ef4444, #dc2626)' : item.color.includes('blue') ? 'linear-gradient(135deg, #2563eb, #1e40af)' : 'linear-gradient(135deg, #a855f7, #9333ea)'}}>{item.value}</h3>
                <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-700 transition-colors">{item.total}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`${item.barColor} transition-all duration-1000 ease-out`}
                    style={{width: `${item.utilization}%`}}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item.utilization}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. QUICK ACTIONS */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const IconComponent = action.icon;
            const cardDelay = `animate-fadeInUp`;
            return (
              <button key={idx} className={`${cardDelay} group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 shadow-lg hover:shadow-2xl hover:border-slate-300 transition-all duration-300 text-left hover-lift overflow-hidden relative`} style={{animationDelay: `${idx * 0.1}s`}}>
                
                {/* Background glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-purple-500"></div>
                
                <div className="relative flex items-start justify-between mb-4">
                  <div className={`${action.bg} ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={24} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2 group-hover:text-slate-700 transition-colors">{action.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-all duration-300">
                  <span>{action.action}</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. ACTIVITY TIMELINE */}
      <div className="animate-slideInLeft bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Activity Timeline</h3>
            <p className="text-xs text-slate-500 mt-1">Latest system activity</p>
          </div>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">View all</button>
        </div>

        <div className="space-y-6">
          {activityTimeline.map((activity, idx) => {
            const IconComponent = activity.icon;
            return (
              <div key={idx} className="flex gap-4 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                {/* Timeline Line and Icon */}
                <div className="flex flex-col items-center">
                  <div className={`${activity.bg} ${activity.color} p-2.5 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <IconComponent size={18} strokeWidth={2} />
                  </div>
                  {idx < activityTimeline.length - 1 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-slate-300 to-slate-100 mt-4 rounded-full"></div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 pt-1 bg-slate-50 p-3 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                  <h4 className="font-bold text-slate-900">{activity.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                  <span className="text-xs text-slate-400 mt-2 block">{activity.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. FOOTER */}
      <div className="border-t border-slate-200 pt-6 mt-12 animate-fadeInUp">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <p>© 2026 <span className="font-semibold text-slate-700 group hover:text-blue-600 transition-colors cursor-default">IMS Pro</span> — Inventory & Sales Management System</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-blue-600 hover:underline transition-all duration-300 hover:scale-110">Privacy</button>
            <button className="hover:text-blue-600 hover:underline transition-all duration-300 hover:scale-110">Terms</button>
            <button className="hover:text-blue-600 hover:underline transition-all duration-300 hover:scale-110">Support</button>
          </div>
        </div>
      </div>

    </div>
  );
}