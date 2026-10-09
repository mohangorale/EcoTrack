import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import QRCodeModal from '../components/QRCodeModal';
import { 
  Search, 
  Package, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  Scale, 
  Laptop, 
  MapPin, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function CustomerTrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const queryId = searchParams.get('id') || '';
  const [searchId, setSearchId] = useState(queryId);
  const [activeItem, setActiveItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // User's own registered items for quick selection
  const [myItems, setMyItems] = useState([]);
  const [loadingMyItems, setLoadingMyItems] = useState(true);

  // Modal and copy state
  const [selectedQRItem, setSelectedQRItem] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load user's registered items
  useEffect(() => {
    let isMounted = true;
    const fetchUserItems = async () => {
      setLoadingMyItems(true);
      try {
        const res = await api.getMyItems();
        if (isMounted) {
          setMyItems(res.data?.items || []);
        }
      } catch (err) {
        console.error('Failed to load user items:', err);
      } finally {
        if (isMounted) setLoadingMyItems(false);
      }
    };
    fetchUserItems();
    return () => { isMounted = false; };
  }, []);

  // Search tracking info for a specific item ID
  const fetchTracking = useCallback(async (idToTrack) => {
    const cleanId = (idToTrack || '').trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setHasSearched(true);
    setError('');

    try {
      // Fetch public item data and timeline
      const [itemRes, histRes] = await Promise.all([
        api.getPublicItem(cleanId),
        api.getPublicHistory(cleanId)
      ]);

      const itemData = itemRes.data?.item || itemRes.item;
      const historyData = histRes.data?.history || histRes.history || [];

      setActiveItem(itemData);
      setHistory(historyData);
      setSearchId(cleanId);
      setSearchParams({ id: cleanId }, { replace: true });
    } catch (err) {
      setError(`No e-waste item found with ID "${cleanId}". Please check the ID or select one of your registered items below.`);
      setActiveItem(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  // Auto-search if ID is in URL query
  useEffect(() => {
    if (queryId) {
      setSearchId(queryId);
      fetchTracking(queryId);
    }
  }, [queryId, fetchTracking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchTracking(searchId.trim());
    }
  };

  const handleSelectMyItem = (item) => {
    setSearchId(item.itemId);
    fetchTracking(item.itemId);
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout 
      title="Track E-Waste Item" 
      subtitle="Monitor real-time physical custody milestones and lifecycle verification for your registered devices."
    >
      <div className="space-y-6 max-w-6xl">
        {/* Search Bar & Quick Selector Card */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="max-w-3xl">
            <h2 className="text-lg font-bold text-[#0F172A]">Trace Item by ID</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter any EcoTrack serial identifier or click one of your registered devices below.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 mt-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter tracking ID (e.g. EW00123)"
                  className="w-full pl-10 pr-4 py-2.5 text-sm font-mono rounded-xl border border-[#CBD5E1] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchId.trim()}
                className="btn-primary text-sm px-6 py-2.5 rounded-xl shrink-0"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Track Status</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Select from User's Registered Items */}
          {myItems.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Package size={14} className="text-[#166534]" />
                  Your Registered Devices ({myItems.length})
                </span>
                <span className="text-xs text-slate-400">Click any device to track instantly</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {myItems.map((item, idx) => {
                  const isSelected = activeItem?.itemId === item.itemId;
                  return (
                    <button
                      key={`${item.itemId || item.id || 'item'}-${idx}`}
                      type="button"
                      onClick={() => handleSelectMyItem(item)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left border text-xs transition-all shrink-0 ${
                        isSelected
                          ? 'border-[#166534] bg-emerald-50/70 text-[#166534] ring-1 ring-[#166534]'
                          : 'border-[#E2E8F0] bg-white hover:border-emerald-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span className="font-semibold">{item.deviceName}</span>
                      <span className="font-mono text-[11px] text-slate-500">({item.itemId})</span>
                      <StatusBadge status={item.currentStatus} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Error Alert */}
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Tracking Details & Timeline View */}
        {activeItem ? (
          <div className="space-y-6">
            {/* Main Item Summary Card */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left: Device Info and Image */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 border border-[#E2E8F0] flex items-center justify-center overflow-hidden shrink-0">
                    {activeItem.photoUrl ? (
                      <img
                        src={activeItem.photoUrl}
                        alt={activeItem.deviceName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Laptop size={32} className="text-slate-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        {activeItem.itemId}
                        <button
                          type="button"
                          onClick={() => handleCopyId(activeItem.itemId)}
                          className="text-slate-400 hover:text-slate-700 ml-1"
                          title="Copy Item ID"
                        >
                          {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </span>
                      <StatusBadge status={activeItem.currentStatus} />
                    </div>

                    <h1 className="text-xl font-bold text-[#0F172A] mt-1.5">{activeItem.deviceName}</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Category: <span className="font-semibold text-slate-700">{String(activeItem.category || 'Other').replace(/_/g, ' ')}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedQRItem(activeItem)}
                    className="btn-outline text-xs py-2 px-3.5"
                  >
                    <QrCode size={15} className="text-[#166534]" />
                    <span>View QR Code</span>
                  </button>

                  <a
                    href={`/track/${encodeURIComponent(activeItem.itemId)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline text-xs py-2 px-3.5 no-underline flex items-center gap-1.5"
                  >
                    <span>Public Passport</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Metadata Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Registered Date</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    {activeItem.createdAt ? new Date(activeItem.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Estimated Weight</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                    <Scale size={13} className="text-slate-400" />
                    {activeItem.weightKg || activeItem.weight ? `${activeItem.weightKg || activeItem.weight} kg` : 'Not recorded'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Current Checkpoint</span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1.5 truncate">
                    <MapPin size={13} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{activeItem.currentLocation || activeItem.checkpoint || 'EcoTrack Intake'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Verification</span>
                  <span className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    QR Digital Twin Active
                  </span>
                </div>
              </div>
            </section>

            {/* Tracking History / Checkpoint Timeline */}
            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Chain of Custody Timeline</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological verification events logged across facilities and handlers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchTracking(activeItem.itemId)}
                  className="btn-outline text-xs py-1.5 px-3"
                  disabled={loading}
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>

              <TrackingTimeline history={history} currentStatus={activeItem.currentStatus} />
            </section>
          </div>
        ) : !hasSearched ? (
          /* Initial Empty State */
          <section className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534] mb-4">
              <Search size={26} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Track Your E-Waste</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Select one of your registered devices above or enter any EcoTrack tracking ID to view its real-time custodial handoffs, inspection notes, and recycling certification.
            </p>
            {myItems.length === 0 && !loadingMyItems && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/register-waste')}
                  className="btn-primary text-xs px-5 py-2"
                >
                  Register Your First Device
                </button>
              </div>
            )}
          </section>
        ) : null}
      </div>

      {/* QR Code Modal */}
      {selectedQRItem && (
        <QRCodeModal
          item={selectedQRItem}
          onClose={() => setSelectedQRItem(null)}
        />
      )}
    </AppLayout>
  );
}
