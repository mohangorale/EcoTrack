import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StatusUpdatePage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('COLLECTED');
  const [location, setLocation] = useState(user?.organizationName || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadItem() {
      try {
        if (!itemId) throw new Error('Choose an item from the stakeholder dashboard first.');
        const res = await api.getItemDetails(itemId);
        setItem(res.data.item);
        // Pre-select appropriate next status
        const curr = res.data.item?.currentStatus;
        if (curr === 'REGISTERED') setNewStatus('COLLECTED');
        else if (curr === 'COLLECTED') setNewStatus('IN_TRANSIT');
        else if (curr === 'IN_TRANSIT') setNewStatus('UNDER_INSPECTION');
        else if (curr === 'UNDER_INSPECTION') setNewStatus('SENT_FOR_RECYCLING');
        else if (curr === 'SENT_FOR_RECYCLING') setNewStatus('PROCESSED');
      } catch (err) {
        setError('Could not load item details.');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.updateItemStatus(item?.itemId || itemId, {
        status: newStatus,
        location,
        notes: notes || `Status updated to ${newStatus} by ${user?.name || 'Staff'}`
      });

      setSuccess(`Status updated to ${res.data?.currentStatus || newStatus} successfully!`);
      // Update local item status
      setItem(prev => ({ ...prev, currentStatus: res.data?.currentStatus || newStatus }));
    } catch (err) {
      setError(err.message || 'Failed to update status. Transition may not be permitted.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayId = item?.itemId || itemId || '';
  const displayStatus = item?.currentStatus || '';

  const ROLE_STATUS_OPTIONS = {
    COLLECTION_CENTRE: [{ value: 'COLLECTED', label: 'Collected (Kiosk Intake)' }],
    TRANSPORTER: [{ value: 'IN_TRANSIT', label: 'In Transit (Logistics)' }],
    INSPECTOR: [
      { value: 'UNDER_INSPECTION', label: 'Under Inspection (Lab Bench)' },
      { value: 'REFURBISHED', label: 'Refurbished (Certified Repair)' },
      { value: 'SENT_FOR_RECYCLING', label: 'Sent for Recycling (Scrap)' },
    ],
    RECYCLER: [{ value: 'PROCESSED', label: 'Processed (Material Shredded)' }],
    ADMIN: [
      { value: 'COLLECTED', label: 'Collected (Kiosk Intake)' },
      { value: 'IN_TRANSIT', label: 'In Transit (Logistics)' },
      { value: 'UNDER_INSPECTION', label: 'Under Inspection (Lab Bench)' },
      { value: 'REFURBISHED', label: 'Refurbished (Certified Repair)' },
      { value: 'SENT_FOR_RECYCLING', label: 'Sent for Recycling (Scrap)' },
      { value: 'PROCESSED', label: 'Processed (Material Shredded)' },
    ],
  };

  const statusOptions = ROLE_STATUS_OPTIONS[user?.role] || ROLE_STATUS_OPTIONS.ADMIN;

  useEffect(() => {
    const options = ROLE_STATUS_OPTIONS[user?.role] || ROLE_STATUS_OPTIONS.ADMIN;
    setNewStatus((current) =>
      options.some((opt) => opt.value === current) ? current : options[0].value
    );
  }, [user?.role]);

  return (
    <AppLayout
      title="Update Item Status"
      subtitle="Update the current status of the e-waste item."
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

            {/* Current Status Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Status
              </label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                {displayStatus ? <StatusBadge status={displayStatus} /> : <span className="text-xs text-slate-500">Unavailable</span>}
              </div>
            </div>

            {/* New Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white font-medium"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="Enter current location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
              />
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add notes about this update..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || loading || !item}
                className="w-full py-2.5 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Status</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
