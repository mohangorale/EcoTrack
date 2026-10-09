import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import QRCodeCard from '../components/QRCodeCard';
import { api } from '../services/api';

export default function QRSuccessPage() {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!item);

  useEffect(() => {
    async function fetchItem() {
      if (!item && itemId) {
        try {
          const res = await api.getPublicItem(itemId);
          setItem(res.data.item);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchItem();
  }, [itemId]);

  const displayId = item?.itemId || itemId || 'EW00123';
  const displayName = item?.deviceName || 'Laptop';
  const displayCategory = item?.category || 'Computers';
  const displayStatus = item?.currentStatus || 'REGISTERED';
  const displayDate = item?.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '12 Mar 2025';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full">
        {/* Main Success Card matching mockup Screen 6 */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 text-center">
          {/* Green Check Circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Item Registered Successfully
          </h2>
          <p className="text-xs text-[#64748B] mt-1 mb-8">
            Your e-waste item has been registered.
          </p>

          {/* Details & QR Code Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center text-left bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0] mb-8">
            {/* Metadata Fields */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-slate-500 font-medium w-28">Item ID:</span>
                <span className="font-mono font-bold text-slate-900">{displayId}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-slate-500 font-medium w-28">Item Name:</span>
                <span className="font-semibold text-slate-900">{displayName}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-slate-500 font-medium w-28">Category:</span>
                <span className="text-slate-700">{displayCategory}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4 items-center">
                <span className="text-slate-500 font-medium w-28">Current Status:</span>
                <StatusBadge status={displayStatus} />
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-4">
                <span className="text-slate-500 font-medium w-28">Registered On:</span>
                <span className="text-slate-700">{displayDate}</span>
              </div>
            </div>

            {/* QR Code with Download/Print/Share */}
            <div className="flex justify-center border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-4 sm:pt-0 sm:pl-6">
              <QRCodeCard itemId={displayId} />
            </div>
          </div>

          {/* Action Button: View in Dashboard */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all"
            >
              View in Dashboard
            </button>

            <Link
              to={`/track/${displayId}`}
              className="inline-flex items-center gap-1.5 text-xs text-[#166534] font-medium hover:underline pt-1"
            >
              <span>View Public Tracking Page</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
