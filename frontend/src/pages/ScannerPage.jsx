import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import QRScannerModal from '../components/QRScannerModal';
import {
  Search,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  RefreshCw,
  ArrowRight,
  Camera,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROLE_NEXT_STATUS = {
  COLLECTION_CENTRE: 'COLLECTED',
  TRANSPORTER: 'IN_TRANSIT',
  INSPECTOR: 'UNDER_INSPECTION',
  RECYCLER: 'PROCESSED',
  ADMIN: null,
};

export default function ScannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [manualInput, setManualInput] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState(user?.organizationName || '');
  const [notes, setNotes] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.organizationName) setLocation(user.organizationName);
  }, [user]);

  const suggestedStatus =
    ROLE_NEXT_STATUS[user?.role] ||
    (item?.currentStatus === 'REGISTERED'
      ? 'COLLECTED'
      : item?.currentStatus === 'COLLECTED'
        ? 'IN_TRANSIT'
        : item?.currentStatus === 'IN_TRANSIT'
          ? 'UNDER_INSPECTION'
          : item?.currentStatus === 'SENT_FOR_RECYCLING'
            ? 'PROCESSED'
            : 'COLLECTED');

  const performLookup = async (idToLook) => {
    const id = (idToLook || manualInput).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!id) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setItem(null);

    try {
      const res = await api.getItemDetails(id);
      setItem(res.data?.item || res.item);
      setManualInput(id);
      setSearchParams({ id }, { replace: true });
    } catch (err) {
      setError(err.message || `No item found for "${id}". Try EW00123.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e) => {
    e?.preventDefault?.();
    performLookup();
  };

  // Auto-lookup if ID is in URL or auto-open scanner if scan=true
  useEffect(() => {
    const qId = searchParams.get('id');
    const qScan = searchParams.get('scan') === 'true' || searchParams.get('scan') === '1';
    if (qId) {
      setManualInput(qId);
      performLookup(qId);
    } else if (qScan) {
      setIsScannerOpen(true);
    }
  }, []);

  const handleUpdateStatus = async () => {
    if (!item || !suggestedStatus) return;
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.updateItemStatus(item.itemId, {
        status: suggestedStatus,
        location: location || user?.organizationName || 'EcoTrack Hub',
        notes: notes || `Verified by ${user?.name || 'staff'} via scanner`,
      });
      const next = res.data?.currentStatus || res.currentStatus || suggestedStatus;
      setSuccess(`Status updated to ${next.replace(/_/g, ' ')}.`);
      setItem({ ...item, currentStatus: next });
      setNotes('');
    } catch (err) {
      setError(err.message || 'Status update failed. Check role permissions and lifecycle step.');
    } finally {
      setUpdating(false);
    }
  };

  const openAdvanced = () => {
    if (!item) return;
    if (item.currentStatus === 'UNDER_INSPECTION' && ['INSPECTOR', 'ADMIN'].includes(user?.role)) {
      navigate(`/inspection/${encodeURIComponent(item.itemId)}`);
      return;
    }
    navigate(`/update-status/${encodeURIComponent(item.itemId)}`);
  };

  return (
    <AppLayout
      title="QR Scanner Desk"
      subtitle="Look up an item by tracking ID and record the next custody handoff."
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#166534]">
            <QrCode size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Scan / Enter Item ID</h2>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. EW00123"
                className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 py-2.5 pl-9 pr-3 font-mono text-sm uppercase focus:border-[#166534] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="btn-outline text-sm px-4 py-2.5 border-emerald-300 bg-emerald-50/70 text-[#166534] hover:bg-emerald-100 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                title="Open live camera QR scanner"
              >
                <Camera size={16} />
                <span>Scan Camera</span>
              </button>
              <button type="submit" disabled={loading || !manualInput.trim()} className="btn-primary text-sm justify-center flex-1 sm:flex-initial">
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <Search size={15} />}
                {loading ? 'Looking up…' : 'Find Item'}
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {['EW00123', 'EW00122', 'EW00120'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setManualInput(sample);
                  (async () => {
                    setLoading(true);
                    setError('');
                    setSuccess('');
                    setItem(null);
                    try {
                      const res = await api.getItemDetails(sample);
                      setItem(res.data?.item || res.item);
                    } catch (err) {
                      setError(err.message || `No item found for "${sample}".`);
                    } finally {
                      setLoading(false);
                    }
                  })();
                }}
                className="rounded-lg border border-[#E2E8F0] bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-[#166534]"
              >
                {sample}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {item && (
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div>
                <p className="font-mono text-xs font-bold text-slate-500">{item.itemId}</p>
                <h3 className="mt-1 text-lg font-bold text-[#0F172A]">{item.deviceName}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {String(item.category || '').replace(/_/g, ' ')} · {String(item.condition || '').replace(/_/g, ' ')}
                </p>
              </div>
              <StatusBadge status={item.currentStatus} />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Checkpoint location
                </label>
                <div className="relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] py-2.5 pl-9 pr-3 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Condition check, vehicle ID, bay number…"
                  className="w-full resize-none rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:border-[#166534] focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                />
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#166534]">Suggested next status</p>
                <p className="mt-1 font-bold text-[#0F172A]">{String(suggestedStatus || '').replace(/_/g, ' ')}</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="btn-primary flex-1 text-sm"
                >
                  {updating ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  {updating ? 'Updating…' : `Mark as ${String(suggestedStatus || '').replace(/_/g, ' ')}`}
                </button>
                <button type="button" onClick={openAdvanced} className="btn-outline text-sm">
                  Advanced
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(id) => {
          setManualInput(id);
          performLookup(id);
        }}
        title="Live QR Scanner Desk"
      />
    </AppLayout>
  );
}
