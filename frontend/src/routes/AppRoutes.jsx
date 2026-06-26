import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';

// Basic temporary layout view for verification
const TemporaryDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Endpoint Views */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Endpoint System Views */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <TemporaryDashboard />
        </ProtectedRoute>
      } />

      {/* Wildcard Fallbacks */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}