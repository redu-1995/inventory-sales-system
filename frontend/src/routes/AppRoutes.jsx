import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Products from '../pages/products/Products';
import Inventory from '../pages/inventory/Inventory';
import PurchaseOrders from '../pages/purchaseOrders/PurchaseOrders';
import PurchaseOrderPrintPage from '../pages/purchaseOrders/PurchaseOrderPrintPage';
import Sales from '../pages/sales/Sales';

// Layout HOC to cleanly frame inner route matching targets
const AuthenticatedAppLayout = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

// Dummy temporary modules to mock layout pathing
const CustomersModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Customer Matrix</h1><p className="text-slate-500 mt-1">Profiles directory management.</p></div>;
const SalesModule = () => <div className="text-left"><h1 className="text-2xl font-bold text-slate-900">Sales Operational Ledger</h1><p className="text-slate-500 mt-1">Transaction audit compliance tracker.</p></div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Gateway Endpoint Forms */}
      <Route path="/login" element={<Login />} />
      
      {/* 2. Standard App Pages (Wrapped in Sidebar & Topbar Layout) */}
      <Route element={
        <ProtectedRoute>
          <AuthenticatedAppLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<CustomersModule />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
      </Route>

      {/* 3. Isolated Print Page (Protected, but NO Dashboard Layout) */}
      <Route 
        path="/purchase-orders/:id/print" 
        element={
          <ProtectedRoute>
            <PurchaseOrderPrintPage />
          </ProtectedRoute>
        } 
      />

      {/* 4. Wildcard Fallback routing rules (MUST BE LAST) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}