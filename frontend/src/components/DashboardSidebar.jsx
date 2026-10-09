import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  Search, 
  User, 
  LogOut, 
  RefreshCw, 
  ClipboardCheck, 
  Users, 
  FileText, 
  Settings, 
  Layers 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'CUSTOMER';

  const customerNav = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Register E-Waste', to: '/register-waste', icon: PlusCircle },
    { name: 'My Items', to: '/dashboard', icon: Package },
    { name: 'Track Item', to: '/track', icon: Search },
    { name: 'Profile', to: '/profile', icon: User },
  ];

  const stakeholderNav = [
    { name: 'Dashboard', to: '/stakeholder', icon: LayoutDashboard },
    { name: 'Received Items', to: '/stakeholder', icon: Package },
    { name: 'Inspection', to: '/inspection/EW00120', icon: ClipboardCheck },
    { name: 'Update Status', to: '/update-status/EW00123', icon: RefreshCw },
    { name: 'Reports', to: '/stakeholder', icon: FileText },
    { name: 'Profile', to: '/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'Users', to: '/admin/users', icon: Users },
    { name: 'Items', to: '/admin', icon: Package },
    { name: 'Reports', to: '/admin', icon: FileText },
    { name: 'Settings', to: '/profile', icon: Settings },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'CUSTOMER' ? customerNav : stakeholderNav;

  const content = (
    <div className="h-full flex flex-col bg-[#0F172A] text-slate-300 w-64 border-r border-slate-800">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white">
          <Leaf size={18} className="stroke-[2.5]" />
        </div>
        <div className="flex items-baseline">
          <span className="text-xl font-bold text-white tracking-tight">Eco</span>
          <span className="text-xl font-bold text-[#22C55E] tracking-tight">Track</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Logout Link */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block shrink-0">{content}</aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onCloseMobile} />
          <div className="relative w-64 h-full z-10">{content}</div>
        </div>
      )}
    </>
  );
}
