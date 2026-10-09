import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import QRScannerModal from '../components/QRScannerModal';
import { Package, RefreshCw, Recycle, Scale, ClipboardCheck, QrCode, Camera } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StakeholderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getStakeholderItems();
      setItems(res.data?.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load the processing queue.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const activeStatuses = ['COLLECTED', 'IN_TRANSIT', 'UNDER_INSPECTION', 'SENT_FOR_RECYCLING'];
  const inProcessing = items.filter((item) => activeStatuses.includes(item.currentStatus)).length;
  const recycled = items.filter((item) => item.currentStatus === 'PROCESSED').length;
  const knownWeight = items.reduce((sum, item) => sum + (Number(item.weightKg ?? item.weight) || 0), 0);
  const hasWeight = items.some((item) => Number(item.weightKg ?? item.weight) > 0);

  const handleScanSuccess = (scannedId) => {
    if (scannedId) {
      navigate(`/scanner?id=${encodeURIComponent(scannedId)}`);
    }
  };

  return (
    <AppLayout title={`${user?.role?.replace(/_/g, ' ') || 'Stakeholder'} Dashboard`} subtitle="Review the e-waste manifest and record the next valid step.">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Operations</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0F172A]">Processing Overview</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={fetchItems} disabled={loading} className="btn-outline self-start sm:self-auto text-xs sm:text-sm">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh queue
          </button>
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="btn-primary self-start sm:self-auto text-xs sm:text-sm"
          >
            <Camera size={15} />
            Scan QR Code
          </button>
        </div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="mb-8 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Visible Items" value={loading ? '—' : items.length} icon={Package} iconColor="#166534" iconBg="#DCFCE7" />
        <StatCard title="In Processing" value={loading ? '—' : inProcessing} icon={RefreshCw} iconColor="#2563EB" iconBg="#DBEAFE" />
        <StatCard title="Processed for Recycling" value={loading ? '—' : recycled} icon={Recycle} iconColor="#16A34A" iconBg="#DCFCE7" />
        <StatCard title="Recorded Weight" value={loading ? '—' : hasWeight ? `${knownWeight.toFixed(1)} kg` : 'Not recorded'} icon={Scale} iconColor="#0D9488" iconBg="#CCFBF1" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#E2E8F0] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Items for Processing</h2>
            <p className="text-xs text-slate-500">Choose an action based on the item's current status and your role.</p>
          </div>
          <span className="text-xs sm:text-sm text-slate-500">{loading ? 'Loading…' : `${items.length} item${items.length === 1 ? '' : 's'}`}</span>
        </div>

        {/* Mobile View: Clean Card List (< 640px) */}
        <div className="block sm:hidden divide-y divide-[#E2E8F0]">
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500">Loading processing queue…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]"><ClipboardCheck size={22} /></span>
                <p className="font-semibold text-[#0F172A]">No items in the queue</p>
                <p className="mt-1 text-xs text-slate-500">Newly registered e-waste will appear here when available to your role.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={`mob-stk-${item.itemId}`} className="p-4 space-y-2.5">
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
                  onClick={() => navigate(item.currentStatus === 'UNDER_INSPECTION' && ['INSPECTOR', 'ADMIN'].includes(user?.role) ? `/inspection/${encodeURIComponent(item.itemId)}` : `/update-status/${encodeURIComponent(item.itemId)}`)}
                  className="w-full text-center rounded-lg bg-[#166534] py-2 text-xs font-semibold text-white hover:bg-[#14532D] transition-colors"
                >
                  Update Status
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet View: Full Table (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
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
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">Loading processing queue…</td></tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]"><ClipboardCheck size={22} /></span>
                      <p className="font-semibold text-[#0F172A]">No items in the queue</p>
                      <p className="mt-1 text-sm text-slate-500">Newly registered e-waste will appear here when available to your role.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.itemId} className="transition-colors hover:bg-slate-50">
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
                        onClick={() => navigate(item.currentStatus === 'UNDER_INSPECTION' && ['INSPECTOR', 'ADMIN'].includes(user?.role) ? `/inspection/${encodeURIComponent(item.itemId)}` : `/update-status/${encodeURIComponent(item.itemId)}`)}
                        className="inline-flex items-center justify-center rounded-lg bg-[#166534] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#14532D]"
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
      </section>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanSuccess}
        title="Scan E-Waste QR Code"
      />
    </AppLayout>
  );
}
