import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { 
  UploadCloud, 
  AlertCircle, 
  Image as ImageIcon, 
  X, 
  Check, 
  Laptop, 
  Smartphone, 
  Monitor, 
  Cpu,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

const DEVICE_PRESETS = [
  {
    name: 'Used Laptop / Notebook',
    category: 'LAPTOP',
    url: '/images/devices/laptop.jpg',
    defaultWeight: '2.4',
    icon: Laptop,
    badge: 'Laptop'
  },
  {
    name: 'Old Smartphone / Mobile',
    category: 'MOBILE',
    url: '/images/devices/phone.jpg',
    defaultWeight: '0.2',
    icon: Smartphone,
    badge: 'Mobile'
  },
  {
    name: 'Computer Monitor / Screen',
    category: 'DESKTOP',
    url: '/images/devices/monitor.jpg',
    defaultWeight: '4.5',
    icon: Monitor,
    badge: 'Monitor'
  },
  {
    name: 'Motherboard & Circuit Scrap',
    category: 'ACCESSORIES',
    url: '/images/devices/circuit.jpg',
    defaultWeight: '0.8',
    icon: Cpu,
    badge: 'Circuit'
  }
];

export default function RegisterWastePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceName: '',
    category: 'LAPTOP',
    brand: '',
    condition: 'PARTIALLY_WORKING',
    weight: '',
    pickupLocation: '',
    description: '',
    photoUrl: '/images/devices/laptop.jpg', // Default to realistic laptop photo
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      category: preset.category,
      deviceName: prev.deviceName ? prev.deviceName : preset.name,
      weight: prev.weight ? prev.weight : preset.defaultWeight,
      photoUrl: preset.url
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Selected image is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        photoUrl: event.target?.result || ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
  };

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
      const createdItemId = res.data?.item?.itemId;
      if (!createdItemId) throw new Error('The server did not return a tracking ID.');
      navigate(`/qr-success/${createdItemId}`, { state: { item: res.data.item } });
    } catch (err) {
      setError(err.message || 'Failed to register item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Register E-Waste"
      subtitle="Add details and photos of your electronic waste item to generate its QR tracking passport."
    >
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Image Selection Section */}
            <div className="rounded-xl border border-[#CBD5E1] bg-slate-50/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#166534]" />
                    Select Device Project Photo
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click a preset image or upload your own device picture below.
                  </p>
                </div>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <X size={13} />
                    Clear photo
                  </button>
                )}
              </div>

              {/* 4 Device Preset Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEVICE_PRESETS.map((preset) => {
                  const isSelected = formData.photoUrl === preset.url;
                  return (
                    <button
                      key={preset.badge}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`group relative rounded-xl border-2 overflow-hidden text-left transition-all p-1.5 bg-white ${
                        isSelected
                          ? 'border-[#166534] shadow-xs ring-2 ring-[#166534]/20'
                          : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-100 relative">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#166534] text-white flex items-center justify-center shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-slate-800 truncate px-0.5">
                        {preset.badge}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Custom Upload or Active Preview Bar */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {formData.photoUrl ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#CBD5E1] shrink-0 bg-white">
                        <img
                          src={formData.photoUrl}
                          alt="Selected preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        ✓ Photo attached
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-slate-400" />
                      No photo attached (optional)
                    </span>
                  )}
                </div>

                {/* Upload button */}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shrink-0">
                  <UploadCloud size={14} className="text-[#166534]" />
                  <span>Upload custom photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Row 1: Item Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell XPS Laptop, iPhone 11, Monitor"
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
                  <option value="LAPTOP">Laptop / Computer</option>
                  <option value="MOBILE">Mobile Phone</option>
                  <option value="DESKTOP">Desktop / Monitor</option>
                  <option value="TABLET">Tablet</option>
                  <option value="ACCESSORIES">Peripherals / Accessories</option>
                  <option value="APPLIANCE">Home Appliance</option>
                  <option value="OTHER">Other Scrap</option>
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
                  <option value="WORKING">Used / Functional</option>
                  <option value="PARTIALLY_WORKING">Partially Working</option>
                  <option value="DAMAGED_SCRAP">Damaged</option>
                  <option value="NON_WORKING">Non-working Scrap</option>
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
                  placeholder="Enter pickup address / city"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                />
              </div>
            </div>

            {/* Row 4: Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Additional details about the device condition, battery, or accessories..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Register Item & Generate QR Tag</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
