import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import StatusBadge from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Laptop, 
  CheckCircle2, 
  Truck, 
  Activity, 
  Recycle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';

export default function PublicTrackingDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      setError('');
      try {
        const itemRes = await api.getPublicItem(itemId);
        const histRes = await api.getPublicHistory(itemId);
        setItem(itemRes.data.item);
        setHistory(histRes.data.history || []);
      } catch (err) {
        setError(err.message || 'Item details could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-[#0F172A]">Item Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">{error || 'Could not find this record.'}</p>
            <Link to="/track" className="btn-primary text-xs">
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pre-formatted dates
  const registeredDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '12 Mar 2025';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Header Row with Back to Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Item Tracking Timeline
          </h1>
          <button
            onClick={() => navigate('/track')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Search</span>
          </button>
        </div>

        {/* Product Overview Card matching mockup Screen 8 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Left Product Image */}
            <div className="w-full aspect-16/10 rounded-lg bg-slate-100 border border-[#E2E8F0] overflow-hidden flex items-center justify-center">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.deviceName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Laptop size={52} className="text-slate-400" />
              )}
            </div>

            {/* Right Details Grid */}
            <div className="sm:col-span-2 space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Item ID:</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{item.itemId}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Item Name:</span>
                <span className="col-span-2 font-semibold text-slate-900">{item.deviceName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Brand:</span>
                <span className="col-span-2 text-slate-800">{item.brand || 'Dell'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="col-span-2 text-slate-700">{item.category}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500 font-medium">Registered On:</span>
                <span className="col-span-2 text-slate-700">{registeredDate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <div className="col-span-2">
                  <StatusBadge status={item.currentStatus} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Chronological Checkpoints matching mockup Screen 8 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          <div className="space-y-8 relative pl-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {/* Step 1: Registered */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 bg-white text-emerald-700 bg-emerald-100 ring-emerald-500">
                <CheckCircle2 size={14} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 pl-2">
                <div className="text-sm font-bold text-slate-900">Registered</div>
                <p className="text-xs text-slate-500 mt-0.5">Item registered by customer</p>
              </div>
              <div className="text-xs font-medium text-slate-500 shrink-0">
                12 Mar 2025, 10:30 AM
              </div>
            </div>

            {/* Step 2: Collected */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 bg-white text-emerald-700 bg-emerald-100 ring-emerald-500">
                <CheckCircle2 size={14} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 pl-2">
                <div className="text-sm font-bold text-slate-900">Collected</div>
                <p className="text-xs text-slate-500 mt-0.5">Picked up from location</p>
              </div>
              <div className="text-xs font-medium text-slate-500 shrink-0">
                13 Mar 2025, 02:15 PM
              </div>
            </div>

            {/* Step 3: In Transit */}
            <div className="relative flex items-start justify-between gap-4">
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 bg-white text-blue-700 bg-blue-100 ring-blue-500">
                <Truck size={14} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 pl-2">
                <div className="text-sm font-bold text-slate-900">In Transit</div>
                <p className="text-xs text-slate-500 mt-0.5">On the way to recycling facility</p>
              </div>
              <div className="text-xs font-medium text-slate-500 shrink-0">
                14 Mar 2025, 09:20 AM
              </div>
            </div>

            {/* Step 4: Under inspection */}
            <div className="relative flex items-start justify-between gap-4 opacity-50">
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 bg-white text-slate-400 ring-slate-300">
                <Activity size={14} />
              </div>
              <div className="flex-1 pl-2">
                <div className="text-sm font-bold text-slate-700">Under Inspection</div>
                <p className="text-xs text-slate-400 mt-0.5">Pending evaluation</p>
              </div>
              <div className="text-xs font-medium text-slate-400 shrink-0">
                Pending
              </div>
            </div>

            {/* Step 5: Recycled / Refurbished */}
            <div className="relative flex items-start justify-between gap-4 opacity-50">
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 bg-white text-slate-400 ring-slate-300">
                <Recycle size={14} />
              </div>
              <div className="flex-1 pl-2">
                <div className="text-sm font-bold text-slate-700">Recycled / Refurbished</div>
                <p className="text-xs text-slate-400 mt-0.5">Pending processing</p>
              </div>
              <div className="text-xs font-medium text-slate-400 shrink-0">
                Pending
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
