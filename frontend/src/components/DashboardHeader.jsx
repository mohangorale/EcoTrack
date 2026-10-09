import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ title, subtitle, onOpenMobileSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="relative z-20 flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-white px-4 py-2 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onOpenMobileSidebar} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden" aria-label="Open sidebar">
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-6 text-[#0F172A] sm:text-lg">{title || `Welcome back, ${user?.name || 'User'}!`}</h1>
          {subtitle && <p className="hidden max-w-2xl truncate text-xs text-slate-500 sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">


        <button type="button" onClick={() => navigate('/profile')} className="flex items-center gap-2 rounded-full p-1.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-offset-2" aria-label="Open profile">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-[#166534]">{initial}</span>
          <span className="hidden max-w-36 sm:block">
            <span className="block truncate text-sm font-semibold leading-5 text-[#0F172A]">{user?.name || 'Account'}</span>
            <span className="block truncate text-xs capitalize text-slate-500">{user?.role?.toLowerCase().replace(/_/g, ' ') || 'User'}</span>
          </span>
          <UserIcon size={15} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
