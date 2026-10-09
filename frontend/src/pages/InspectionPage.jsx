import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { AlertCircle, CheckCircle2, ClipboardCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function InspectionPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [condition, setCondition] = useState('Scrap');
  const [decision, setDecision] = useState('SEND_FOR_RECYCLING');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchItem() {
      try {
        if (!itemId) throw new Error('Choose an item from the stakeholder dashboard first.');
        const res = await api.getItemDetails(itemId);
        setItem(res.data.item);
      } catch (err) {
        setError('Failed to load item for inspection.');
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.recordInspection(item?.itemId || itemId, {
        decision,
        notes,
      });
      setSuccess(`Inspection decision recorded: ${decision === 'APPROVE_REFURBISHMENT' ? 'Approved for Refurbishment' : 'Sent for Recycling'}!`);
      setTimeout(() => {
        navigate('/stakeholder');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit inspection.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayId = item?.itemId || itemId || '';
  const displayName = item?.deviceName || '—';
  const displayBrand = item?.brand || 'Not provided';

  return (
    <AppLayout
      title="Inspection Details"
      subtitle="Verify and record the inspection result."
    >
      <div className="max-w-xl">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item ID Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Item ID
              </label>
              <input
                type="text"
                readOnly
                value={displayId}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] bg-slate-50 font-mono font-bold text-slate-800 cursor-not-allowed"
              />
            </div>

            {/* Row: Item Name & Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={displayName}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  readOnly
                  value={displayBrand}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] bg-slate-50 text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Condition Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
              >
                <option value="Working">Working / Repairable</option>
                <option value="Used">Used</option>
                <option value="Damaged">Damaged Parts</option>
                <option value="Scrap">Total Scrap / Hazardous</option>
              </select>
            </div>

            {/* Decision Dropdown matching mockup Screen 11 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Decision *
              </label>
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white font-medium"
              >
                <option value="APPROVE_REFURBISHMENT">Approve for Refurbishment</option>
                <option value="SEND_FOR_RECYCLING">Send for Recycling</option>
              </select>
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add inspection notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || loading || !item}
                className="w-full py-2.5 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Submit Inspection</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
