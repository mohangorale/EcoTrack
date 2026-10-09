import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogIn, UserPlus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* EcoTrack Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="w-9 h-9 rounded-lg bg-[#166534] flex items-center justify-center text-white shadow-xs">
            <Leaf size={20} className="stroke-[2.5]" />
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">Eco</span>
            <span className="text-xl font-bold text-[#166534] tracking-tight">Track</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-700 hover:text-[#166534] transition-colors">
            Home
          </Link>
          <Link to="/track" className="text-sm font-medium text-slate-700 hover:text-[#166534] transition-colors flex items-center gap-1.5">
            <Search size={14} />
            Track Item
          </Link>
          <a href="#how-it-works" className="text-sm font-medium text-slate-700 hover:text-[#166534] transition-colors">
            How It Works
          </a>
          <a href="#impact" className="text-sm font-medium text-slate-700 hover:text-[#166534] transition-colors">
            Impact
          </a>
          <a href="#contact" className="text-sm font-medium text-slate-700 hover:text-[#166534] transition-colors">
            Contact
          </a>
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'CUSTOMER' ? '/dashboard' : '/stakeholder'}
                className="btn-primary text-sm font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <LogIn size={15} />
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-[#166534] hover:bg-[#14532D] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus size={15} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
