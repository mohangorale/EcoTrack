import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Box, 
  QrCode, 
  Eye, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import QRCodeModal from '../components/QRCodeModal';

export default function CustomerPortal({ onTrackItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedQrItem, setSelectedQrItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    deviceName: '',
    category: 'LAPTOP',
    condition: 'NON_WORKING',
    quantity: 1,
    pickupLocation: 'Flat 402, Green Towers, Andheri West, Mumbai',
    description: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchMyItems();
  }, [statusFilter]);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await api.getMyItems({ status: statusFilter || undefined });
      setItems(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await api.registerItem(formData);
      setShowRegisterModal(false);
      // Reset form
      setFormData({
        deviceName: '',
        category: 'LAPTOP',
        condition: 'NON_WORKING',
        quantity: 1,
        pickupLocation: 'Flat 402, Green Towers, Andheri West, Mumbai',
        description: ''
      });
      // Refresh list
      await fetchMyItems();
      // Show newly created QR tag immediately
      setSelectedQrItem(res.data.item);
    } catch (err) {
      setFormError(err.message || 'Failed to register item');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '30px 0 60px 0' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
              Citizen Donor <span style={{ color: 'var(--accent-mint)' }}>Portal</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Declare your discarded electronics, generate printable QR tags, and follow ethical recycling.
            </p>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setShowRegisterModal(true)}
          >
            <Plus size={18} />
            Register New E-Waste
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>TOTAL REGISTERED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
              {items.length}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>IN TRANSIT</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-violet)', marginTop: '4px' }}>
              {items.filter(i => i.currentStatus === 'IN_TRANSIT').length}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>RECYCLING PIPELINE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
              {items.filter(i => ['COLLECTED', 'UNDER_INSPECTION', 'SENT_FOR_RECYCLING'].includes(i.currentStatus)).length}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>CIRCULAR IMPACT COMPLETE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-mint)', marginTop: '4px' }}>
              {items.filter(i => ['REFURBISHED', 'PROCESSED'].includes(i.currentStatus)).length}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Registered Electronic Items</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Filter by Status:</span>
            <select 
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="COLLECTED">Collected</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="UNDER_INSPECTION">Under Inspection</option>
              <option value="REFURBISHED">Refurbished</option>
              <option value="SENT_FOR_RECYCLING">Sent For Recycling</option>
              <option value="PROCESSED">Processed</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading e-waste items...
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <Box size={48} style={{ color: 'var(--text-dim)', margin: '0 auto 14px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>No items registered yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Have an old laptop, phone, or appliance? Click below to manifest it and generate its digital QR tag.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowRegisterModal(true)}
            >
              <Plus size={16} />
              Register My First E-Waste Item
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {items.map(item => (
              <div key={item.itemId} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      color: 'var(--accent-mint)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.itemId}
                    </span>
                    <span className={`status-badge ${item.currentStatus}`}>
                      {item.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                    {item.deviceName}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
                    <span>Category: <strong>{item.category}</strong></span>
                    <span>•</span>
                    <span>Condition: <strong>{item.condition}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '16px' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.3 }}>{item.pickupLocation}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    style={{ flex: 1 }}
                    onClick={() => setSelectedQrItem(item)}
                  >
                    <QrCode size={14} />
                    View QR Tag
                  </button>
                  <button 
                    className="btn btn-outline btn-sm" 
                    style={{ flex: 1 }}
                    onClick={() => onTrackItem(item.itemId)}
                  >
                    <Eye size={14} />
                    Track Passport
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Register E-Waste Modal */}
        {showRegisterModal && (
          <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>
                Register E-Waste Item
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Enter electronic device details to generate a unique traceability QR code.
              </p>

              {formError && (
                <div style={{ 
                  background: 'rgba(244, 63, 94, 0.15)', 
                  border: '1px solid rgba(244, 63, 94, 0.3)', 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Device Make & Model *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Dell XPS 13, Apple iPad Air, Samsung TV..."
                    required
                    value={formData.deviceName}
                    onChange={e => setFormData({ ...formData, deviceName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="LAPTOP">Laptop</option>
                      <option value="MOBILE">Mobile Smartphone</option>
                      <option value="DESKTOP">Desktop PC</option>
                      <option value="TABLET">Tablet</option>
                      <option value="ACCESSORIES">Cables & Accessories</option>
                      <option value="APPLIANCE">Home Appliance</option>
                      <option value="OTHER">Other Electronic Scrap</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Condition *</label>
                    <select 
                      className="form-select"
                      value={formData.condition}
                      onChange={e => setFormData({ ...formData, condition: e.target.value })}
                    >
                      <option value="WORKING">Working</option>
                      <option value="PARTIALLY_WORKING">Partially Working</option>
                      <option value="NON_WORKING">Non-Working</option>
                      <option value="DAMAGED_SCRAP">Damaged / Scrap</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup Location / City *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Andheri West, Mumbai or Bhiwandi Drop Kiosk"
                    required
                    value={formData.pickupLocation}
                    onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Remarks (Optional)</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    placeholder="e.g. Cracked screen, missing charger, swollen battery..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ flex: 1 }}
                    onClick={() => setShowRegisterModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Registering...' : 'Generate QR & Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Sticker Modal */}
        {selectedQrItem && (
          <QRCodeModal 
            item={selectedQrItem} 
            onClose={() => setSelectedQrItem(null)} 
          />
        )}
      </div>
    </div>
  );
}
