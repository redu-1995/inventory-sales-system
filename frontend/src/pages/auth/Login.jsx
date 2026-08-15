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
    <div className="min-h-screen w-full flex items-center justify-center bg-white text-slate-900 font-sans antialiased px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 sm:p-8 relative">
        <div className="w-full space-y-8 relative z-10">
          
          {/* Header */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-slate-900">StockFlow</span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-2">
              Sign in with your credentials to access the management portal.
            </p>
          </div>

          {/* API Error Alert Box */}
          {apiError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
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
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
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
              <label className="flex items-center space-x-2 cursor-pointer text-slate-500 hover:text-slate-700">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500/20 h-4 w-4" 
                />
                <span>Remember this device</span>
              </label>
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
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
          <div className="pt-6 border-t border-slate-200 text-center">
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