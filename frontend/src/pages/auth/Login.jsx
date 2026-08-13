import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Modern Lucide Icons for high-end SaaS UX
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3,
  Loader2
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const from = location.state?.from?.pathname || '/dashboard';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setApiError('');
      await login(data.username, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Invalid username or password credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* LEFT SIDE: Visual Branding & Value Prop (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-12 flex-col justify-between border-r border-slate-800/60">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo / Brand */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ApexSales <span className="text-indigo-400 font-normal text-sm">ERP</span></span>
        </div>

        {/* Middle Feature Showcase */}
        <div className="relative z-10 max-w-lg my-auto space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>v2.4 Enterprise Release</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Manage stock, track logs, and scale your revenue.
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            Real-time sales analytics, inventory tracking, and seamless order management built for high-performance teams.
          </p>

          {/* Social Proof / Stats Pill */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-indigo-400 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Performance</span>
              </div>
              <p className="text-2xl font-bold text-white">+34.8%</p>
              <p className="text-xs text-slate-500">Sales velocity this month</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Security</span>
              </div>
              <p className="text-2xl font-bold text-white">Encrypted</p>
              <p className="text-xs text-slate-500">Role-based access control</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} ApexSales Inc. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-slate-950">
        
        {/* Subtle background mesh for right panel */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Header */}
          <div>
            {/* Mobile Logo Only */}
            <div className="flex lg:hidden items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white">ApexSales</span>
            </div>

            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-2">
              Sign in with your credentials to access the management portal.
            </p>
          </div>

          {/* API Error Alert Box */}
          {apiError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-snug">{apiError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username Input Container */}
            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="username"
                  label="Username"
                  placeholder="e.g. jsmith_admin"
                  error={errors.username?.message}
                  {...register('username', { required: 'Username is required' })}
                />
              </div>
            </div>

            {/* Password Input Container with Toggle */}
            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  error={errors.password?.message}
                  {...register('password', { required: 'Password is required' })}
                />
                
                {/* Password Eye Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Helper Links */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 h-4 w-4" 
                />
                <span>Remember this device</span>
              </label>
              <Link to="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </Button>
          </form>

          {/* Security Badge */}
          <div className="pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center space-x-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Protected by enterprise end-to-end encryption</span>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}