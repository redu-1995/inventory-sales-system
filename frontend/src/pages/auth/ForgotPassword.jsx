import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setSuccess('');

      const response = await forgotPassword(
        data.username,
        data.newPassword,
        data.confirmPassword
      );

      setSuccess(response.detail || 'Password reset successful.');

      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err) {
      setApiError(
        err.response?.data?.detail || 'We could not reset your password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/15 text-indigo-300 ring-1 ring-indigo-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-indigo-300/80">Account recovery</p>
              <h1 className="text-2xl font-bold text-white">Reset password</h1>
            </div>
          </div>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {apiError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            id="username"
            label="Username"
            placeholder="Enter your username"
            error={errors.username?.message}
            {...register('username', { required: 'Username is required' })}
          />

          <div className="relative">
            <Input
              id="newPassword"
              label="New password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a new password"
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-200"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              id="confirmPassword"
              label="Confirm new password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value, formValues) =>
                  value === formValues.newPassword || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-200"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-200">
            <ShieldCheck className="h-4 w-4" />
            Use a unique password you have not used before.
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              'Update password'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
