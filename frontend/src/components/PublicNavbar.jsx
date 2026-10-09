import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PublicNavbar() {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'CUSTOMER' ? '/dashboard' : '/stakeholder';

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#166534] text-white">
              <Leaf size={20} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#0F172A]">Eco</span>
              <span className="text-[#166534]">Track</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {user ? (
              <Link to={dashboardPath} className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 no-underline">
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 no-underline inline-flex">
                  <LogIn size={14} />
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 no-underline">
                  <UserPlus size={14} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
