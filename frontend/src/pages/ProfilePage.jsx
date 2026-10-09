import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Rahul Patil',
    email: user?.email || 'rahul@gmail.com',
    mobile: user?.mobile || '+91 9876543210',
    address: user?.address || 'Pune, Maharashtra',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Rahul Patil',
        email: user.email || 'rahul@gmail.com',
        mobile: user.mobile || '+91 9876543210',
        address: user.address || 'Pune, Maharashtra',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const initial = formData.name ? formData.name.charAt(0).toUpperCase() : 'R';

  return (
    <AppLayout
      title="My Profile"
      subtitle="Manage your account details."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {/* Left Profile Avatar Card matching mockup Screen 14 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-8 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#1E3A8A] text-white font-bold text-3xl flex items-center justify-center shadow-sm mb-4 ring-4 ring-slate-100">
            {initial}
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">{formData.name}</h2>
          <p className="text-xs text-slate-500 capitalize mt-0.5">
            {user?.role ? user.role.toLowerCase().replace(/_/g, ' ') : 'Customer'}
          </p>

          <button
            type="button"
            onClick={() => alert('Photo upload dialog opened.')}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Camera size={13} />
            <span>Change Photo</span>
          </button>
        </div>

        {/* Right Form Card matching mockup Screen 14 */}
        <div className="md:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
