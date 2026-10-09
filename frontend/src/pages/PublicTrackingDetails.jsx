import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import QRScannerModal from '../components/QRScannerModal';
import { 
  ArrowLeft, 
  Laptop, 
  CheckCircle2, 
  Truck, 
  Activity, 
  Recycle, 
  Clock, 
  ShieldCheck,
  Camera,
  QrCode,
  Printer,
  Copy,
  Check,
  Package,
  Calendar,
  Scale,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

const LIFECYCLE_STAGES = [
  { key: 'REGISTERED', label: 'Registered', icon: Package },
  { key: 'COLLECTED', label: 'Collected', icon: CheckCircle2 },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { key: 'UNDER_INSPECTION', label: 'Under Inspection', icon: Activity },
  { key: 'PROCESSED', label: 'Recycled / Refurbished', icon: Recycle },
];

const STAGE_ORDER = {
  REGISTERED: 1,
  COLLECTED: 2,
  IN_TRANSIT: 3,
  UNDER_INSPECTION: 4,
  REFURBISHED: 5,
  SENT_FOR_RECYCLING: 5,
  PROCESSED: 5,
  RECYCLED: 5,
};

export default function PublicTrackingDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!itemId) return;
      setLoading(true);
      setError('');
      try {
        const itemRes = await api.getPublicItem(itemId);
        const histRes = await api.getPublicHistory(itemId);
        setItem(itemRes.data?.item || itemRes.item);
        setHistory(histRes.data?.history || histRes.history || []);
      } catch (err) {
        setError(err.message || 'Item details could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [itemId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScanAnother = (newId) => {
    if (!newId) return;
    navigate(`/track/${encodeURIComponent(newId)}`);
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-4 border-[#166534] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Resolving digital passport…</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <QrCode size={24} />
            </div>
            <h2 className="text-lg font-bold text-[#0F172A]">Passport Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              {error || `No e-waste tracking passport could be found for ID "${itemId}".`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link to="/track" className="btn-outline text-xs">
                Back to Track
              </Link>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="btn-primary text-xs"
              >
                <Camera size={14} />
                Scan QR Code
              </button>
            </div>
          </div>
        </div>

        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={handleScanAnother}
          title="Scan E-Waste QR Tracking Code"
        />
      </div>
    );
  }

  const registeredDate = formatTimestamp(item.createdAt);
  const updatedDate = formatTimestamp(item.lastUpdatedAt || item.createdAt);
  const currentStageNum = STAGE_ORDER[item.currentStatus] || 1;
  const isCompleted = ['PROCESSED', 'RECYCLED', 'REFURBISHED'].includes(item.currentStatus);

  // Provide fallback timeline if history array was empty from database
  const timelineHistory = history && history.length > 0
    ? history
    : [
        {
          status: item.currentStatus || 'REGISTERED',
          location: item.pickupLocation || 'EcoTrack Center',
          notes: item.description || 'Item registered and tracked on EcoTrack ledger',
          createdAt: item.createdAt || new Date().toISOString()
        }
      ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation & Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/track')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Back to Search</span>
            </button>
            <span className="text-xs text-slate-400">/</span>
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {item.itemId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              title="Scan another QR code"
            >
              <Camera size={14} />
              <span>Scan Another</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              title="Copy public link"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              title="Print passport"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Passport Title Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-slate-800 text-white p-5 sm:p-6 shadow-sm border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={13} />
                  Public Digital Product Passport
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400 text-slate-950 px-2 py-0.5 text-[11px] font-bold">
                    ✓ Circular Loop Completed
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {item.deviceName}
              </h1>
              <p className="mt-1 text-xs text-slate-300">
                Tracking Asset ID: <span className="font-mono font-bold text-emerald-400">{item.itemId}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Status</span>
              <StatusBadge status={item.currentStatus} />
            </div>
          </div>
        </div>

        {/* Product Overview Card with Real Dynamic Information */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 mb-6">
          <h2 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <Package size={16} className="text-[#166534]" />
            Item Specifications & Traceability Data
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            {/* Left Product Image / Fallback */}
            <div className="w-full aspect-16/10 rounded-xl bg-slate-100 border border-[#E2E8F0] overflow-hidden flex items-center justify-center shadow-inner">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.deviceName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                  <Laptop size={48} className="stroke-[1.5]" />
                  <span className="mt-2 text-[11px] font-medium text-slate-400">Photo Verified</span>
                </div>
              )}
            </div>

            {/* Right Details Grid - 100% Real Dynamic Values */}
            <div className="sm:col-span-2 space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tracking Serial:</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{item.itemId}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Device Name:</span>
                <span className="col-span-2 font-semibold text-slate-900">{item.deviceName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Brand / OEM:</span>
                <span className="col-span-2 font-medium text-slate-800">
                  {item.brand && item.brand.trim() ? item.brand : 'Unspecified'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="col-span-2 text-slate-800 font-medium">
                  {String(item.category || '—').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Physical Condition:</span>
                <span className="col-span-2 text-slate-800 font-medium">
                  {String(item.condition || '—').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Recorded Weight:</span>
                <span className="col-span-2 text-slate-800 font-medium">
                  {item.weight ? `${item.weight} kg` : (item.weightKg ? `${item.weightKg} kg` : 'Not recorded')}
                </span>
              </div>
              {item.pickupLocation && (
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Intake Location:</span>
                  <span className="col-span-2 text-slate-800 font-medium">{item.pickupLocation}</span>
                </div>
              )}
              {item.description && (
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Manifest Notes:</span>
                  <span className="col-span-2 text-slate-700 italic">{item.description}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">First Registered:</span>
                <span className="col-span-2 text-slate-700">{registeredDate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-slate-500 font-medium">Last Verified:</span>
                <span className="col-span-2 text-slate-700">{updatedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Lifecycle Progression Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-6 mb-6">
          <h2 className="text-sm font-bold text-[#0F172A] mb-4">Lifecycle Custody Pipeline</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const stageNum = idx + 1;
              const isPastOrCurrent = currentStageNum >= stageNum;
              const isCurrent = currentStageNum === stageNum;
              const StageIcon = stage.icon;

              return (
                <div
                  key={stage.key}
                  className={`rounded-xl p-3 border text-center transition-all ${
                    isCurrent
                      ? 'border-[#166534] bg-emerald-50 text-[#166534] ring-2 ring-[#166534]/15 font-bold'
                      : isPastOrCurrent
                        ? 'border-emerald-200 bg-emerald-50/50 text-[#166534]'
                        : 'border-slate-200 bg-slate-50/70 text-slate-400'
                  }`}
                >
                  <div className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center mb-1.5 ${
                    isPastOrCurrent ? 'bg-emerald-100 text-[#166534]' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <StageIcon size={14} />
                  </div>
                  <div className="text-[11px] font-semibold leading-tight">{stage.label}</div>
                  <div className="text-[9px] mt-0.5 uppercase tracking-wider font-semibold">
                    {isCurrent ? 'Current' : isPastOrCurrent ? 'Completed' : 'Upcoming'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real Dynamic Chronological History Timeline */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Chronological Chain of Custody</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every physical handoff and milestone recorded on the immutable ledger.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {timelineHistory.length} Event{timelineHistory.length === 1 ? '' : 's'}
            </span>
          </div>

          <TrackingTimeline history={timelineHistory} currentStatus={item.currentStatus} />
        </div>
      </main>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanAnother}
        title="Scan E-Waste QR Tracking Code"
      />
    </div>
  );
}
