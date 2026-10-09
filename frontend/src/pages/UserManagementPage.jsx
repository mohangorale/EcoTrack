import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import StatusBadge from '../components/StatusBadge';
import { Search, UserPlus, Edit2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: 'Password123!',
    role: 'COLLECTION_CENTRE',
    organizationName: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const confirmed = window.confirm(
      `Are you sure you want to ${nextStatus === 'SUSPENDED' ? 'suspend' : 'activate'} ${user.name}?`
    );
    if (!confirmed) return;

    try {
      await api.updateUserStatus(user.id, nextStatus);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user status.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalError('');
    setModalSuccess('');

    try {
      await api.createAdminUser(newUserData);
      setModalSuccess('User provisioned successfully!');
      setTimeout(() => {
        setShowAddModal(false);
        setModalSuccess('');
        setNewUserData({
          name: '',
          email: '',
          password: 'Password123!',
          role: 'COLLECTION_CENTRE',
          organizationName: '',
        });
        fetchUsers();
      }, 1000);
    } catch (err) {
      setModalError(err.message || 'Failed to provision user.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
  });

  return (
    <AppLayout
      title="User Management"
      subtitle="View and manage system users."
    >
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs font-semibold py-2 px-3.5 w-full sm:w-auto shrink-0"
          >
            <UserPlus size={14} />
            <span>Add User</span>
          </button>
        </div>

        {/* User Table matching mockup Screen 13 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Organization</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Joined On</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No users match your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuspended = u.accountStatus === 'SUSPENDED';
                  const joinedDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '10 Mar 2025';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-900">{u.name}</td>
                      <td className="py-3.5 px-6 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-6 font-medium text-slate-800 capitalize">
                        {u.role.toLowerCase().replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">{u.organizationName || '-'}</td>
                      <td className="py-3.5 px-6">
                        <StatusBadge status={isSuspended ? 'DISABLED' : 'ACTIVE'} />
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">{joinedDate}</td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => alert(`Edit profile for ${u.name}`)}
                          className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`font-semibold ml-2 ${
                              isSuspended ? 'text-[#166534] hover:underline' : 'text-rose-600 hover:underline'
                            }`}
                          >
                            {isSuspended ? 'Activate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg max-w-md w-full p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="text-base font-bold text-[#0F172A]">Provision Stakeholder User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singh"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="vikram@transport.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Role *</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#166534] bg-white"
                >
                  <option value="COLLECTION_CENTRE">Collection Centre Agent</option>
                  <option value="TRANSPORTER">Transporter Driver</option>
                  <option value="INSPECTOR">Quality Inspector</option>
                  <option value="RECYCLER">Smelting Recycler</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization / Hub Name</label>
                <input
                  type="text"
                  placeholder="e.g. EcoFreight Fleet #4"
                  value={newUserData.organizationName}
                  onChange={(e) => setNewUserData({ ...newUserData, organizationName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-3 border border-[#E2E8F0] rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="flex-1 py-2 px-3 bg-[#166534] hover:bg-[#14532D] text-white rounded-lg font-medium shadow-xs"
                >
                  {modalSubmitting ? 'Provisioning...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
