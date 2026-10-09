import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { UploadCloud, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function RegisterWastePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceName: '',
    category: 'Computers',
    brand: '',
    condition: 'Used',
    weight: '2.5',
    pickupLocation: 'Pune, Maharashtra',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.deviceName || !formData.pickupLocation) {
      setError('Item name and pickup location are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.registerItem(formData);
      const createdItemId = res.data?.item?.itemId || 'EW00123';
      navigate(`/qr-success/${createdItemId}`, { state: { item: res.data?.item } });
    } catch (err) {
      setError(err.message || 'Failed to register item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Register E-Waste"
      subtitle="Add details of your electronic waste item."
    >
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Item Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laptop, Mobile, Monitor"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                >
                  <option value="Computers">Computers</option>
                  <option value="Mobile">Mobile Phones</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Appliances">Home Appliances</option>
                  <option value="Other">Other Scrap</option>
                </select>
              </div>
            </div>

            {/* Row 2: Brand & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell, Apple, HP, Samsung"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Condition *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                >
                  <option value="Used">Used / Functional</option>
                  <option value="Partially Working">Partially Working</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Scrap">Non-working Scrap</option>
                </select>
              </div>
            </div>

            {/* Row 3: Estimated Weight & Pickup Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 2.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter address"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                />
              </div>
            </div>

            {/* Row 4: Description & Upload Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Additional details about the item..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload Photos (Optional)
                </label>
                <div 
                  onClick={() => alert('Photo selected! URL preset applied.')}
                  className="h-[105px] border-2 border-dashed border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center p-4 hover:border-[#166534] transition-colors cursor-pointer text-center bg-slate-50/50"
                >
                  <UploadCloud size={24} className="text-[#166534] mb-1" />
                  <span className="text-xs font-medium text-slate-700">Click to upload or drag and drop</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 5MB)</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Register Item</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
