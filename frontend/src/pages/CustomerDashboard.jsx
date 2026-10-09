import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Package, Truck, Recycle, Scale, PlusCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMyItems();
      setItems(res.data?.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load your items. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role && !['CUSTOMER', 'ADMIN'].includes(user.role)) {
      navigate('/stakeholder', { replace: true });
      return;
    }
    loadData();
  }, [user, navigate, loadData]);

  const totalItems = items.length;
  const inTransitCount = items.filter((item) => item.currentStatus === 'IN_TRANSIT').length;
  const recycledCount = items.filter((item) => ['PROCESSED', 'RECYCLED'].includes(item.currentStatus)).length;
  const knownWeight = items.reduce((sum, item) => sum + (Number(item.weightKg ?? item.weight) || 0), 0);
  const hasWeight = items.some((item) => Number(item.weightKg ?? item.weight) > 0);

  return (
    <AppLayout title={`Welcome back, ${user?.name || 'there'}!`} subtitle="A clear overview of your registered e-waste.">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Your e-waste activity</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0F172A]">Overview</h2>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button type="button" onClick={loadData} className="btn-outline text-xs sm:text-sm flex-1 sm:flex-initial justify-center" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link to="/register-waste" className="btn-primary text-xs sm:text-sm flex-1 sm:flex-initial justify-center no-underline">
            <PlusCircle size={16} />
            Register E-Waste
          </Link>
        </div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="mb-8 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="My Items" value={loading ? '—' : totalItems} icon={Package} iconColor="#166534" iconBg="#DCFCE7" />
        <StatCard title="In Transit" value={loading ? '—' : inTransitCount} icon={Truck} iconColor="#2563EB" iconBg="#DBEAFE" />
        <StatCard title="Recycled" value={loading ? '—' : recycledCount} icon={Recycle} iconColor="#16A34A" iconBg="#DCFCE7" />
        <StatCard title="Recorded Weight" value={loading ? '—' : hasWeight ? `${knownWeight.toFixed(1)} kg` : 'Not recorded'} icon={Scale} iconColor="#0D9488" iconBg="#CCFBF1" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#E2E8F0] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">My Registered Items</h2>
            <p className="text-xs text-slate-500">Track status and open the public tracking record.</p>
          </div>
          <span className="text-xs sm:text-sm text-slate-500">{loading ? 'Loading…' : `${items.length} item${items.length === 1 ? '' : 's'}`}</span>
        </div>

        {/* Mobile View: Clean Card List (< 640px) */}
        <div className="block sm:hidden divide-y divide-[#E2E8F0]">
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500">Loading registered items…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]"><Package size={22} /></span>
                <p className="font-semibold text-[#0F172A]">No items registered yet</p>
                <p className="mt-1 text-xs text-slate-500">Register your first electronic item to create its QR tracking record.</p>
                <Link to="/register-waste" className="btn-primary mt-4 text-xs no-underline">Register your first item</Link>
              </div>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`mob-${item.itemId || item.id || 'item'}-${idx}`} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{item.itemId}</span>
                  <StatusBadge status={item.currentStatus} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{item.deviceName}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>{String(item.category || 'Other').replace(/_/g, ' ')}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/track?id=${encodeURIComponent(item.itemId)}`)}
                  className="w-full text-center rounded-lg border border-[#E2E8F0] py-2 text-xs font-semibold text-[#166534] bg-emerald-50/60 hover:bg-emerald-50 transition-colors"
                >
                  View tracking
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet View: Full Table (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[#E2E8F0] bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Item ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Registered</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">Loading registered items…</td></tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]"><Package size={22} /></span>
                      <p className="font-semibold text-[#0F172A]">No items registered yet</p>
                      <p className="mt-1 text-sm text-slate-500">Register your first electronic item to create its QR tracking record.</p>
                      <Link to="/register-waste" className="btn-primary mt-4 text-sm no-underline">Register your first item</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={`${item.itemId || item.id || 'item'}-${idx}`} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-slate-700">{item.itemId}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{item.deviceName}</td>
                    <td className="px-5 py-4 text-slate-600">{String(item.category || 'Other').replace(/_/g, ' ')}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={item.currentStatus} /></td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/track?id=${encodeURIComponent(item.itemId)}`)}
                        className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#166534] transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        View tracking
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}
