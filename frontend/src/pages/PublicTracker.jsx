import React, { useState, useEffect } from 'react';
import { 
  Search, 
  QrCode, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Activity, 
  Flame, 
  Sparkles, 
  Box, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import QRCodeModal from '../components/QRCodeModal';

export default function PublicTracker({ initialItemId }) {
  const [searchId, setSearchId] = useState(initialItemId || 'EW-0001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);
  const [showQrModal, setShowQrModal] = useState(false);

  const sampleIds = ['EW-0001', 'EW-0002', 'EW-0003', 'EW-0004'];

  useEffect(() => {
    if (initialItemId) {
      setSearchId(initialItemId);
      handleTrack(initialItemId);
    } else {
      handleTrack('EW-0001');
    }
  }, [initialItemId]);

  const handleTrack = async (targetId) => {
    const idToFetch = (targetId || searchId).trim().toUpperCase();
    if (!idToFetch) return;

    setLoading(true);
    setError(null);
    try {
      const itemRes = await api.getPublicItem(idToFetch);
      const historyRes = await api.getPublicHistory(idToFetch);

      setItem(itemRes.data.item);
      setHistory(historyRes.data.history || []);

      // If item is refurbished or processed, trigger confetti celebration!
      if (['REFURBISHED', 'PROCESSED'].includes(itemRes.data.item.currentStatus)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError(err.message || 'Item not found');
      setItem(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'REGISTERED': return <Box size={14} />;
      case 'COLLECTED': return <CheckCircle size={14} />;
      case 'IN_TRANSIT': return <Truck size={14} />;
      case 'UNDER_INSPECTION': return <Activity size={14} />;
      case 'REFURBISHED': return <Sparkles size={14} />;
      case 'SENT_FOR_RECYCLING': return <Flame size={14} />;
      case 'PROCESSED': return <ShieldCheck size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div style={{ padding: '30px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(16, 185, 129, 0.12)', 
            color: 'var(--accent-mint)', 
            padding: '6px 14px', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            <ShieldCheck size={14} />
            <span>Zero-Knowledge Public Verification Engine</span>
          </div>

          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            lineHeight: 1.2,
            marginBottom: '10px'
          }}>
            Transparent E-Waste <span style={{ color: 'var(--accent-mint)' }}>Lifecycle Passport</span>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto' }}>
            Scan a physical QR tag or enter any item ID to audit the verifiable chain-of-custody from citizen drop-off to certified processing.
          </p>
        </div>

        {/* Search Bar & Sample Chips */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-dim)' 
                }} 
              />
              <input 
                type="text"
                className="form-input"
                style={{ paddingLeft: '42px', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase' }}
                placeholder="Enter Item ID (e.g. EW-0001)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '130px' }}
            >
              {loading ? 'Searching...' : 'Track Item'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Sample ID Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Try Live Samples:</span>
            {sampleIds.map(sample => (
              <button
                key={sample}
                type="button"
                className="role-pill"
                onClick={() => {
                  setSearchId(sample);
                  handleTrack(sample);
                }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', borderColor: 'rgba(244, 63, 94, 0.4)', marginBottom: '30px' }}>
            <AlertCircle size={40} style={{ color: 'var(--accent-rose)', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Item Not Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              No e-waste item found with ID <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{searchId}</strong>.
            </p>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearchId('EW-0001'); handleTrack('EW-0001'); }}
            >
              Reset to EW-0001
            </button>
          </div>
        )}

        {/* Item Passport & Timeline View */}
        {item && (
          <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            {/* Top Passport Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '24px',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '1.3rem', 
                    fontWeight: 800, 
                    color: '#FFFFFF',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {item.itemId}
                  </span>
                  <span className={`status-badge ${item.currentStatus}`}>
                    {getStatusIcon(item.currentStatus)}
                    {item.currentStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px' }}>
                  {item.deviceName}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>Category: <strong style={{ color: 'var(--text-main)' }}>{item.category}</strong></span>
                  <span>•</span>
                  <span>Last Active: <strong style={{ color: 'var(--text-main)' }}>{new Date(item.lastUpdatedAt).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* View QR Tag Button */}
              <button 
                className="btn btn-outline"
                onClick={() => setShowQrModal(true)}
              >
                <QrCode size={16} />
                View & Print QR Sticker
              </button>
            </div>

            {/* Terminal State Celebration Banner */}
            {item.currentStatus === 'REFURBISHED' && (
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)', 
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <Sparkles size={28} style={{ color: 'var(--accent-mint)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: 'var(--accent-mint)', fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>
                    Certified Circular Reuse Achieved!
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    This device was successfully refurbished and tested for second-life usage, preventing landfill toxics and preserving rare minerals.
                  </p>
                </div>
              </div>
            )}

            {item.currentStatus === 'PROCESSED' && (
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.18) 0%, rgba(16, 185, 129, 0.1) 100%)', 
                border: '1px solid rgba(20, 184, 166, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <ShieldCheck size={28} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>
                    Certified Material Reclamation Completed!
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    This electronic equipment has completed certified metallurgical smelting and hazardous neutralization under Pollution Control guidelines.
                  </p>
                </div>
              </div>
            )}

            {/* Lifecycle Timeline */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--accent-mint)' }} />
              Verifiable Custody Timeline
            </h3>

            <div className="timeline">
              {history.map((step, idx) => {
                const isLatest = idx === history.length - 1;
                return (
                  <div key={idx} className="timeline-item">
                    <div className={`timeline-dot ${isLatest ? 'active' : ''}`}>
                      {getStatusIcon(step.status)}
                    </div>

                    <div className="glass-card" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className={`status-badge ${step.status}`}>
                            {step.status.replace(/_/g, ' ')}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
                            {step.roleAtEvent.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          {new Date(step.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '4px' }}>
                        <MapPin size={15} style={{ color: 'var(--accent-cyan)' }} />
                        <span>{step.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Privacy Redaction Guarantee */}
            <div style={{ 
              marginTop: '32px', 
              paddingTop: '20px', 
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              color: 'var(--text-dim)', 
              fontSize: '0.8rem' 
            }}>
              <Lock size={14} style={{ color: 'var(--accent-mint)', flexShrink: 0 }} />
              <span>
                <strong>Privacy Guaranteed:</strong> Personal registrant contact info and residential coordinates are strictly redacted on public queries according to EcoTrack data protection standards.
              </span>
            </div>
          </div>
        )}

        {/* QR Code Sticker Modal */}
        {showQrModal && item && (
          <QRCodeModal 
            item={item} 
            onClose={() => setShowQrModal(false)} 
          />
        )}
      </div>
    </div>
  );
}
