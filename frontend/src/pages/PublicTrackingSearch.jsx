import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import QRScannerModal from '../components/QRScannerModal';
import { Search, AlertCircle, ArrowRight, Laptop, QrCode, Camera } from 'lucide-react';
import { api } from '../services/api';

export default function PublicTrackingSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchId, setSearchId] = useState('');
  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
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
      setItem(itemRes.data?.item || itemRes.item);
      setHistory(histRes.data?.history || histRes.history || []);
      setSearchId(id);
      setSearchParams({ id }, { replace: true });
    } catch (err) {
      setError(`No e-waste item found with ID "${id}". Please check and try again.`);
      setItem(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle URL query parameters (?id=EW00123 or ?scan=true)
  useEffect(() => {
    const queryId = searchParams.get('id');
    const shouldScan = searchParams.get('scan') === 'true' || searchParams.get('scan') === '1';

    if (queryId) {
      setSearchId(queryId);
      handleSearch(queryId);
    } else if (shouldScan) {
      setIsScannerOpen(true);
    }
  }, []);

  const handleQrScanned = (scannedId) => {
    if (!scannedId) return;
    setSearchId(scannedId);
    handleSearch(scannedId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Title & Search Bar */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] border border-emerald-200/80 text-xs font-semibold mb-3">
            <QrCode size={13} />
            <span>Real-Time E-Waste Traceability</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Track Your E-Waste
          </h1>
          <p className="text-xs text-[#64748B] mt-1.5">
            Enter the item ID or scan the QR code to see real-time lifecycle status.
          </p>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6"
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
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white shadow-xs font-mono uppercase"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#166534] border border-emerald-300 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
                title="Scan QR Code with camera or file"
              >
                <Camera size={16} />
                <span>Scan QR</span>
              </button>

              <button
                type="submit"
                disabled={loading || !searchId.trim()}
                className="flex-1 sm:flex-initial py-2.5 px-6 rounded-lg bg-[#166534] hover:bg-[#14532D] disabled:opacity-50 text-white font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
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
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#166534]">
              <QrCode size={26} />
            </div>
            <h2 className="font-bold text-[#0F172A] text-base">Enter a tracking ID or scan a QR code</h2>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              Scan the physical EcoTrack QR sticker affixed to your electronic device, or enter the ID above.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="btn-primary text-xs font-semibold py-2.5 px-5"
              >
                <Camera size={16} />
                Open Live QR Scanner
              </button>
            </div>
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
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 sm:p-6">
              <h3 className="text-sm font-bold text-[#0F172A] mb-4">Tracking Details</h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Product Thumbnail */}
                <div className="w-24 h-24 sm:w-36 sm:h-28 rounded-lg bg-slate-100 border border-[#E2E8F0] flex items-center justify-center overflow-hidden shrink-0">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.deviceName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Laptop size={36} className="text-slate-400" />
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="flex-1 space-y-2 text-xs w-full">
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
                <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => navigate(`/track/${item.itemId}`)}
                    className="btn-primary text-xs font-semibold py-2 px-4 w-full sm:w-auto justify-center"
                  >
                    <span>Full Passport</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tracking History Timeline Box */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 sm:p-6">
              <h3 className="text-sm font-bold text-[#0F172A] mb-6">Tracking History</h3>
              <TrackingTimeline history={history} currentStatus={item.currentStatus} />
            </div>
          </div>
        )}
      </main>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQrScanned}
        title="Scan E-Waste QR Tracking Code"
      />
    </div>
  );
}

