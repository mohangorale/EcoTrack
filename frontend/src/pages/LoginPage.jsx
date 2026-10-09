import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../constants/demoAccounts';

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'CUSTOMER') {
        navigate('/dashboard');
      } else {
        navigate('/stakeholder');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setLoading(true);
    setError('');
    try {
      const user = await quickLogin(demoEmail);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'CUSTOMER') {
        navigate('/dashboard');
      } else {
        navigate('/stakeholder');
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Logo & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#166534] flex items-center justify-center text-white shadow-xs">
            <Leaf size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold text-[#0F172A]">Eco</span>
          <span className="text-2xl font-bold text-[#166534]">Track</span>
        </Link>
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Welcome Back</h2>
        <p className="text-sm text-[#64748B] mt-1">Login to your EcoTrack account</p>
      </div>

      {/* Card Form */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-[#E2E8F0] sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#166534] focus:ring-[#166534] border-[#E2E8F0]"
                />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password is Password123!'); }} className="text-[#166534] font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#166534] font-semibold hover:underline">
              Sign Up
            </Link>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              Instant Demo Sign In:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('rahul@gmail.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] border border-[#E2E8F0] text-slate-700 transition-colors text-left"
              >
                👤 Customer (Rahul)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@ecotrack.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] border border-[#E2E8F0] text-slate-700 transition-colors text-left"
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('priya@recycle.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] border border-[#E2E8F0] text-slate-700 transition-colors text-left"
              >
                ♻️ Recycler (Priya)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('amit@inspect.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-[#166534] border border-[#E2E8F0] text-slate-700 transition-colors text-left"
              >
                🔬 Inspector (Amit)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
