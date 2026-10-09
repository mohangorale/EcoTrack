import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import QRCodeCard from '../components/QRCodeCard';
import { api } from '../services/api';

export default function QRSuccessPage() {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!location.state?.item);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.item) {
      setItem(location.state.item);
      setLoading(false);
      return;
    }
    let active = true;
    api.getPublicItem(itemId)
      .then((response) => { if (active) setItem(response.data?.item || null); })
      .catch((err) => { if (active) setError(err.message || 'Could not load this registered item.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [itemId, location.state]);

  if (loading) return <div className="flex min-h-dvh items-center justify-center px-4"><div className="flex items-center gap-3 text-sm text-slate-600"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#166534] border-t-transparent" />Loading item details…</div></div>;

  if (!item) return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600"><AlertTriangle size={26} /></span>
        <h1 className="text-xl font-bold text-[#0F172A]">Item details unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{error || 'We could not find a registered item for this tracking ID.'}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center"><button type="button" onClick={() => navigate('/register-waste')} className="btn-primary text-sm">Register another item</button><Link to="/dashboard" className="btn-outline text-sm no-underline">Back to dashboard</Link></div>
      </div>
    </div>
  );

  const displayId = item.itemId || itemId;
  const displayDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const trackingUrl = item.qrCodeUrl?.startsWith('http') ? item.qrCodeUrl : `${window.location.origin}/track/${encodeURIComponent(displayId)}`;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] px-4 py-10 sm:px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-9">
        <div className="text-center">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#166534]"><CheckCircle2 size={34} /></span>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#166534]">EcoTrack Registration</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">Item registered successfully</h1>
          <p className="mt-2 text-sm text-slate-500">Keep this QR code with the item to access its tracking record.</p>
        </div>

        <div className="mt-8 grid gap-6 rounded-xl border border-[#E2E8F0] bg-slate-50 p-4 sm:grid-cols-2 sm:p-6">
          <dl className="space-y-4 text-sm">
            {item.photoUrl && (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#CBD5E1] bg-white shrink-0">
                  <img src={item.photoUrl} alt={item.deviceName || 'Device'} className="w-full h-full object-cover" />
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Device Photo</dt>
                  <dd className="text-xs font-semibold text-emerald-700">✓ Attached Asset Image</dd>
                </div>
              </div>
            )}
            <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Tracking ID</dt><dd className="mt-1 break-all font-mono text-base font-bold text-[#0F172A]">{displayId}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Item name</dt><dd className="mt-1 font-semibold text-slate-900">{item.deviceName || 'Electronic item'}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Category</dt><dd className="mt-1 text-slate-700">{String(item.category || 'Other').replace(/_/g, ' ')}</dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Current status</dt><dd className="mt-2"><StatusBadge status={item.currentStatus || 'REGISTERED'} /></dd></div>
            <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Registered on</dt><dd className="mt-1 text-slate-700">{displayDate}</dd></div>
          </dl>
          <div className="flex min-w-0 items-center justify-center border-t border-[#E2E8F0] pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"><QRCodeCard itemId={displayId} trackingUrl={trackingUrl} /></div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => navigate(`/dashboard/track?id=${encodeURIComponent(displayId)}`)} className="btn-primary w-full text-sm">
            Track in Dashboard
          </button>
          <Link to={`/track/${encodeURIComponent(displayId)}`} className="btn-outline w-full text-sm no-underline" target="_blank" rel="noreferrer">
            <span>Open Public Passport</span>
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
