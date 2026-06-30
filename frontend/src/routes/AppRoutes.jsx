import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Products from '../pages/products/Products';

// Layout HOC to cleanly frame inner route matching targets
const AuthenticatedAppLayout = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

// Dummy temporary modules to mock layout pathing
const OverviewModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Dashboard Metrics Matrix</h1><p className="text-slate-500 mt-1">Realtime core indicators stream.</p></div>;
const ProductsModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Products Catalog</h1><p className="text-slate-500 mt-1">Add and manage structural SKUs.</p></div>;
const InventoryModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Inventory Stocks</h1><p className="text-slate-500 mt-1">Stock adjustments logging.</p></div>;
const CustomersModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Customer Matrix</h1><p className="text-slate-500 mt-1">Profiles directory management.</p></div>;
const SalesModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Sales Operational Ledger</h1><p className="text-slate-500 mt-1">Transaction audit compliance tracker.</p></div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Gateway Endpoint Forms */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Layout Infrastructure Routes Nested Frame */}
      <Route element={
        <ProtectedRoute>
          <AuthenticatedAppLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<InventoryModule />} />
        <Route path="/customers" element={<CustomersModule />} />
        <Route path="/sales" element={<SalesModule />} />
      </Route>

      {/* Wildcard Fallback routing rules redirects */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}