import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import { Search, AlertCircle, ArrowRight, Laptop } from 'lucide-react';
import { api } from '../services/api';

export default function PublicTrackingSearch() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (idToSearch) => {
    const id = (idToSearch || searchId).trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    setHasSearched(true);
    setError('');

    try {
      const itemRes = await api.getPublicItem(id);
      const histRes = await api.getPublicHistory(id);
      setItem(itemRes.data.item);
      setHistory(histRes.data.history || []);
    } catch (err) {
      setError(`No e-waste item found with ID "${id}". Please check and try again.`);
      setItem(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Title & Search Bar */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Track Your E-Waste
          </h1>
          <p className="text-xs text-[#64748B] mt-1.5">
            Enter the item ID or scan the QR code to see real-time status.
          </p>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2 mt-6"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. EW00123"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white shadow-xs font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Try:</span>
            {['EW00123', 'EW00122', 'EW00120'].map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => {
                  setSearchId(sampleId);
                  handleSearch(sampleId);
                }}
                className="rounded-lg border border-[#E2E8F0] bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-[#166534]"
              >
                {sampleId}
              </button>
            ))}
          </div>
        </div>

        {!hasSearched && !item && (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-12 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]"><Search size={22} /></span>
            <h2 className="font-semibold text-[#0F172A]">Enter a tracking ID to begin</h2>
            <p className="mt-1 text-sm text-slate-500">You can find the ID beside the QR code provided when an item was registered.</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mb-6">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Results Preview matching mockup Screen 7 */}
        {item && (
          <div className="space-y-6">
            {/* Tracking Details Box */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6">
              <h3 className="text-sm font-bold text-[#0F172A] mb-4">Tracking Details</h3>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Product Thumbnail */}
                <div className="w-36 h-28 rounded-lg bg-slate-100 border border-[#E2E8F0] flex items-center justify-center overflow-hidden shrink-0">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.deviceName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Laptop size={44} className="text-slate-400" />
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-medium">Item ID:</span>
                    <span className="col-span-2 font-mono font-bold text-slate-900">{item.itemId}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-medium">Item Name:</span>
                    <span className="col-span-2 font-semibold text-slate-900">{item.deviceName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-medium">Category:</span>
                    <span className="col-span-2 text-slate-700">{item.category}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-slate-500 font-medium">Current Status:</span>
                    <div className="col-span-2">
                      <StatusBadge status={item.currentStatus} />
                    </div>
                  </div>
                </div>

                {/* View Full Timeline Button */}
                <div className="shrink-0">
                  <button
                    onClick={() => navigate(`/track/${item.itemId}`)}
                    className="btn-primary text-xs font-semibold py-2 px-4"
                  >
                    <span>Full Passport</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tracking History Timeline Box */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6">
              <h3 className="text-sm font-bold text-[#0F172A] mb-6">Tracking History</h3>
              <TrackingTimeline history={history} currentStatus={item.currentStatus} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
