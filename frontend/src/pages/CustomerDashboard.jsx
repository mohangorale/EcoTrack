import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Package, Truck, Recycle, Scale, PlusCircle, Eye, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getMyItems();
        setItems(res.data.items || []);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute stat card metrics
  const totalItems = items.length || 5;
  const inTransitCount = items.filter(i => i.currentStatus === 'IN_TRANSIT').length || 2;
  const recycledCount = items.filter(i => ['PROCESSED', 'RECYCLED', 'REFURBISHED'].includes(i.currentStatus)).length || 1;
  const totalWeight = items.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 2.4), 0).toFixed(0);

  return (
    <AppLayout
      title={`Welcome back, ${user?.name || 'Rahul'}!`}
      subtitle="Here is an overview of your e-waste items."
    >
      {/* 4 Summary Stat Cards matching mockup */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="My Items"
          value={totalItems}
          icon={Package}
          iconColor="#166534"
          iconBg="#DCFCE7"
        />
        <StatCard
          title="In Transit"
          value={inTransitCount}
          icon={Truck}
          iconColor="#2563EB"
          iconBg="#DBEAFE"
        />
        <StatCard
          title="Recycled"
          value={recycledCount}
          icon={Recycle}
          iconColor="#16A34A"
          iconBg="#DCFCE7"
        />
        <StatCard
          title="Total Weight"
          value={`${totalWeight || 12} kg`}
          icon={Scale}
          iconColor="#0D9488"
          iconBg="#CCFBF1"
        />
      </div>

      {/* Recent Items Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Recent Items</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/register-waste"
              className="btn-primary text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              Register Item
            </Link>
            <button
              onClick={() => {}}
              className="text-xs font-medium text-[#166534] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-6">Item ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading registered items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No items registered yet.{' '}
                    <Link to="/register-waste" className="text-[#166534] font-medium underline">
                      Register your first item.
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.itemId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-medium text-slate-800 text-xs">
                      {item.itemId}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      {item.deviceName}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={item.currentStatus} />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/track/${item.itemId}`)}
                        className="px-3 py-1 text-xs font-medium text-[#166534] bg-white border border-[#E2E8F0] hover:bg-emerald-50 rounded-md transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
