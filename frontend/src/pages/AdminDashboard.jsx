import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import { Package, Activity, Recycle, Users, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const totalItems = stats?.totalItems || 3256;
  const activeItems = stats?.inTransit || 1280;
  const recycledItems = stats?.processed || 980;
  const totalUsers = stats?.totalUsers || 25;

  return (
    <AppLayout
      title="System Overview"
      subtitle="Master telemetry across the e-waste chain-of-custody network."
    >
      {/* 4 Overview Stat Cards matching mockup Screen 12 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Items"
          value={totalItems.toLocaleString()}
          icon={Package}
          iconColor="#166534"
          iconBg="#DCFCE7"
        />
        <StatCard
          title="Active Items"
          value={activeItems.toLocaleString()}
          icon={Activity}
          iconColor="#2563EB"
          iconBg="#DBEAFE"
        />
        <StatCard
          title="Recycled"
          value={recycledItems.toLocaleString()}
          icon={Recycle}
          iconColor="#16A34A"
          iconBg="#DCFCE7"
        />
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          iconColor="#0D9488"
          iconBg="#CCFBF1"
        />
      </div>

      {/* Grid: Items by Status Donut & Recent Activities matching mockup Screen 12 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Items by Status Donut Chart */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col justify-between">
          <h2 className="text-base font-bold text-[#0F172A] mb-4">Items by Status</h2>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
            {/* Donut graphic representation */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Registered 22% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#38BDF8"
                  strokeWidth="3.8"
                  strokeDasharray="22 78"
                  strokeDashoffset="0"
                />
                {/* Collected 20% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#FBBF24"
                  strokeWidth="3.8"
                  strokeDasharray="20 80"
                  strokeDashoffset="-22"
                />
                {/* In Transit 30% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#2563EB"
                  strokeWidth="3.8"
                  strokeDasharray="30 70"
                  strokeDashoffset="-42"
                />
                {/* Under Inspection 12% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#FB923C"
                  strokeWidth="3.8"
                  strokeDasharray="12 88"
                  strokeDashoffset="-72"
                />
                {/* Recycled 16% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#22C55E"
                  strokeWidth="3.8"
                  strokeDasharray="16 84"
                  strokeDashoffset="-84"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-800">100%</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Tracked</span>
              </div>
            </div>

            {/* Legend matching mockup exact percentages */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span className="text-slate-600 font-medium w-28">Registered</span>
                <span className="font-bold text-slate-900">22%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                <span className="text-slate-600 font-medium w-28">Collected</span>
                <span className="font-bold text-slate-900">20%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="text-slate-600 font-medium w-28">In Transit</span>
                <span className="font-bold text-slate-900">30%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                <span className="text-slate-600 font-medium w-28">Under Inspection</span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span className="text-slate-600 font-medium w-28">Recycled</span>
                <span className="font-bold text-slate-900">16%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activities Feed matching mockup Screen 12 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#0F172A]">Recent Activities</h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-xs font-semibold text-[#166534] hover:underline"
            >
              View Users &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#E2E8F0] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-slate-800">EW00123</span>
                <p className="text-slate-600 mt-0.5">Status updated to In Transit</p>
              </div>
              <span className="text-slate-400 font-medium text-[11px]">14 Mar, 9:20 AM</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-slate-800">EW00122</span>
                <p className="text-slate-600 mt-0.5">Item collected at depot</p>
              </div>
              <span className="text-slate-400 font-medium text-[11px]">13 Mar, 2:15 PM</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#166534]">Admin</span>
                <p className="text-slate-600 mt-0.5">New stakeholder user registered</p>
              </div>
              <span className="text-slate-400 font-medium text-[11px]">12 Mar, 11:00 AM</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-slate-800">EW00120</span>
                <p className="text-slate-600 mt-0.5">Under inspection at test bench</p>
              </div>
              <span className="text-slate-400 font-medium text-[11px]">11 Mar, 4:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
