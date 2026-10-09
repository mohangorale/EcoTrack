import React from 'react';
import { Menu, Bell, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ title, subtitle, onOpenMobileSidebar }) {
  const { user, quickLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = async (e) => {
    const selectedEmail = e.target.value;
    if (selectedEmail) {
      await quickLogin(selectedEmail);
      if (selectedEmail === 'admin@ecotrack.com') {
        navigate('/admin');
      } else if (selectedEmail === 'rahul@gmail.com') {
        navigate('/dashboard');
      } else {
        navigate('/stakeholder');
      }
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Greeting / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#0F172A] leading-tight">
            {title || `Welcome back, ${user?.name || 'User'}!`}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Quick Role Switcher + Notifications + Avatar Profile */}
      <div className="flex items-center gap-4">
        {/* Fast Role Simulator Dropdown */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-xs">
          <Sparkles size={13} className="text-[#166534]" />
          <span className="text-slate-500 font-medium">Demo Role:</span>
          <select
            value={user?.email || 'rahul@gmail.com'}
            onChange={handleRoleChange}
            className="bg-transparent font-semibold text-[#166534] outline-none cursor-pointer text-xs"
          >
            {DEMO_ACCOUNTS.map((acc) => (
              <option key={acc.email} value={acc.email}>
                {acc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22C55E] rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Avatar & Info matching mockup */}
        <div 
          onClick={() => navigate('/profile')} 
          className="flex items-center gap-3 pl-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white font-bold flex items-center justify-center text-sm shadow-xs group-hover:ring-2 group-hover:ring-[#166534] transition-all">
            {initial}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-[#0F172A] leading-tight group-hover:text-[#166534] transition-colors">
              {user?.name || 'Rahul Patil'}
            </div>
            <div className="text-xs text-slate-500 capitalize">
              {user?.role ? user.role.toLowerCase().replace(/_/g, ' ') : 'Customer'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
