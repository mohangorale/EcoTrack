import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Package, Activity, Recycle, Users, ArrowRight, RefreshCw, ClipboardList } from 'lucide-react';
import { api } from '../services/api';

const STATUS_LABELS = {
  REGISTERED: 'Registered', COLLECTED: 'Collected', IN_TRANSIT: 'In Transit',
  UNDER_INSPECTION: 'Under Inspection', REFURBISHED: 'Refurbished',
  SENT_FOR_RECYCLING: 'Sent for Recycling', PROCESSED: 'Processed',
};
const STATUS_COLORS = {
  REGISTERED: '#38BDF8', COLLECTED: '#FBBF24', IN_TRANSIT: '#2563EB',
  UNDER_INSPECTION: '#FB923C', REFURBISHED: '#A78BFA', SENT_FOR_RECYCLING: '#14B8A6', PROCESSED: '#22C55E',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [itemsResponse, usersResponse] = await Promise.all([
        api.getAdminItems({ page: 1, limit: 100 }),
        api.getAdminUsers(),
      ]);
      setItems(itemsResponse.data?.items || []);
      setUsers(usersResponse.data?.users || []);
    } catch (err) {
      setError(err.message || 'Unable to load admin dashboard data.');
      setItems([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  const activeItems = items.filter((item) => ['COLLECTED', 'IN_TRANSIT', 'UNDER_INSPECTION', 'SENT_FOR_RECYCLING'].includes(item.currentStatus)).length;
  const processedItems = items.filter((item) => item.currentStatus === 'PROCESSED').length;
  const statusCounts = useMemo(() => Object.keys(STATUS_LABELS).map((status) => ({
    status,
    count: items.filter((item) => item.currentStatus === status).length,
  })), [items]);
  const statusTotal = Math.max(items.length, 1);
  const recentItems = [...items].sort((a, b) => new Date(b.lastUpdatedAt || b.createdAt || 0) - new Date(a.lastUpdatedAt || a.createdAt || 0)).slice(0, 5);

  return (
    <AppLayout title="Admin Dashboard" subtitle="Monitor e-waste records and system users from one place.">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm text-slate-500">System overview</p><h2 className="mt-1 text-xl font-bold tracking-tight text-[#0F172A]">Traceability Summary</h2></div>
        <button type="button" onClick={loadDashboard} disabled={loading} className="btn-outline self-start text-sm sm:self-auto"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh data</button>
      </div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="mb-8 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Items in Registry" value={loading ? '—' : items.length} icon={Package} iconColor="#166534" iconBg="#DCFCE7" />
        <StatCard title="Active Workflow" value={loading ? '—' : activeItems} icon={Activity} iconColor="#2563EB" iconBg="#DBEAFE" />
        <StatCard title="Processed for Recycling" value={loading ? '—' : processedItems} icon={Recycle} iconColor="#16A34A" iconBg="#DCFCE7" />
        <StatCard title="Users" value={loading ? '—' : users.length} icon={Users} iconColor="#0D9488" iconBg="#CCFBF1" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-base font-bold text-[#0F172A]">Items by Status</h2><p className="mt-1 text-xs text-slate-500">Distribution of the items returned by the API.</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{items.length} total</span></div>
          {loading ? <p className="py-8 text-center text-sm text-slate-500">Loading status data…</p> : items.length === 0 ? <div className="py-10 text-center"><ClipboardList size={28} className="mx-auto mb-2 text-slate-300" /><p className="text-sm font-semibold text-slate-700">No item data yet</p><p className="mt-1 text-xs text-slate-500">Status distribution will appear after items are registered.</p></div> : <div className="space-y-4">{statusCounts.filter((entry) => entry.count > 0).map((entry) => <div key={entry.status}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="flex min-w-0 items-center gap-2 text-slate-700"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] }} /><span className="truncate">{STATUS_LABELS[entry.status]}</span></span><span className="shrink-0 font-semibold tabular-nums text-slate-900">{entry.count} <span className="font-normal text-slate-500">({Math.round(entry.count / statusTotal * 100)}%)</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${entry.count / statusTotal * 100}%`, backgroundColor: STATUS_COLORS[entry.status] }} /></div></div>)}</div>}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:px-6"><div><h2 className="text-base font-bold text-[#0F172A]">Recently Updated Items</h2><p className="mt-1 text-xs text-slate-500">Sorted by latest available update time.</p></div><button type="button" onClick={() => navigate('/admin/users')} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#166534] hover:underline">Users <ArrowRight size={13} /></button></div>
          {loading ? <p className="px-5 py-10 text-center text-sm text-slate-500">Loading recent items…</p> : recentItems.length === 0 ? <div className="px-5 py-10 text-center"><p className="text-sm font-semibold text-slate-700">No recent activity</p><p className="mt-1 text-xs text-slate-500">Item updates will appear here when available.</p></div> : <div className="divide-y divide-[#E2E8F0]">{recentItems.map((item) => <div key={item.itemId} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="min-w-0"><p className="break-words font-mono text-xs font-bold text-slate-800">{item.itemId}</p><p className="mt-1 truncate text-sm font-semibold text-slate-900">{item.deviceName}</p><p className="mt-1 text-xs text-slate-500">Updated {item.lastUpdatedAt || item.createdAt ? new Date(item.lastUpdatedAt || item.createdAt).toLocaleString() : 'time unavailable'}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><StatusBadge status={item.currentStatus} /><button type="button" onClick={() => navigate(`/track/${encodeURIComponent(item.itemId)}`)} className="text-xs font-semibold text-[#166534] hover:underline">View</button></div></div>)}</div>}
        </section>
      </div>
    </AppLayout>
  );
}
