import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Package, RefreshCw, Recycle, Scale, ArrowRight, Eye } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StakeholderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await api.getAdminItems();
        setItems(res.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  return (
    <AppLayout
      title={`Dashboard (${user?.role ? user.role.replace(/_/g, ' ') : 'Recycler'})`}
      subtitle="Operational manifest & assigned items for processing."
    >
      {/* 4 Summary Stat Cards matching mockup Screen 9 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Items Received"
          value={items.length ? items.length * 3 + 10 : 28}
          icon={Package}
          iconColor="#166534"
          iconBg="#DCFCE7"
        />
        <StatCard
          title="In Processing"
          value={12}
          icon={RefreshCw}
          iconColor="#2563EB"
          iconBg="#DBEAFE"
        />
        <StatCard
          title="Recycled"
          value={10}
          icon={Recycle}
          iconColor="#16A34A"
          iconBg="#DCFCE7"
        />
        <StatCard
          title="Total Weight"
          value="120 kg"
          icon={Scale}
          iconColor="#0D9488"
          iconBg="#CCFBF1"
        />
      </div>

      {/* Items for Processing Section */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Items for Processing</h2>
          </div>
          <button className="text-xs font-medium text-[#166534] hover:underline cursor-pointer">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-6">Item ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Received On</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading manifest...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No items in processing queue.
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
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          if (item.currentStatus === 'UNDER_INSPECTION') {
                            navigate(`/inspection/${item.itemId}`);
                          } else {
                            navigate(`/update-status/${item.itemId}`);
                          }
                        }}
                        className="px-3.5 py-1 text-xs font-semibold text-white bg-[#166534] hover:bg-[#14532D] rounded-md transition-colors"
                      >
                        Update
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
