import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  QrCode, 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function ScannerView({ currentUser, onTrackItem }) {
  const [scannedId, setScannedId] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Status Update Form State
  const defaultLocation = currentUser?.organizationName || 'Bhiwandi Municipal E-Waste Kiosk #3';
  const [location, setLocation] = useState(defaultLocation);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Determine allowed target status based on current user role
  const isCollection = currentUser?.role === 'COLLECTION_CENTRE';
  const isTransporter = currentUser?.role === 'TRANSPORTER';

  const targetStatus = isCollection ? 'COLLECTED' : isTransporter ? 'IN_TRANSIT' : 'COLLECTED';

  useEffect(() => {
    if (currentUser?.organizationName) {
      setLocation(currentUser.organizationName);
    }
  }, [currentUser]);

  const handleLookup = async (idToLook) => {
    const id = (idToLook || manualInput).trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setItem(null);

    try {
      const res = await api.getItemDetails(id);
      setItem(res.data.item);
      setScannedId(id);
    } catch (err) {
      setError(err.message || 'Item not found');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!item) return;
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.updateItemStatus(item.itemId, {
        status: targetStatus,
        location,
        notes: notes || `Handoff verified by ${currentUser?.name || 'Staff'}`
      });

      setSuccessMessage(`Status successfully updated to ${res.data.currentStatus}!`);
      // Refresh item state
      setItem({ ...item, currentStatus: res.data.currentStatus });
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ padding: '30px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(56, 189, 248, 0.12)', 
            color: '#38BDF8', 
            padding: '4px 12px', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px'
          }}>
            <Camera size={14} />
            <span>Operational Custody Handoff</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            Frontline <span style={{ color: 'var(--accent-mint)' }}>QR Scanner</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Active Station: <strong>{currentUser?.name || 'Authorized Staff'}</strong> ({currentUser?.role || 'COLLECTION_CENTRE'})
          </p>
        </div>

        {/* Camera HUD Viewfinder */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <div className="scanner-hud">
            {/* HUD Target Corners */}
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />
            <div className="hud-corner hud-corner-bl" />
            <div className="hud-corner hud-corner-br" />

            {/* Scanning Laser Beam */}
            <div className="scanner-laser" />

            {/* Inner Content */}
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '20px'
            }}>
              <QrCode size={56} style={{ color: 'rgba(52, 211, 153, 0.6)', marginBottom: '12px' }} />
              <div style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
                Camera Viewfinder Active
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Center EcoTrack QR Sticker within the target frame
              </div>
            </div>
          </div>

          {/* Quick Simulation Buttons for Demo Testing */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
              Instant Demo QR Barcode Scans:
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="role-pill"
                onClick={() => { setManualInput('EW-0004'); handleLookup('EW-0004'); }}
              >
                Scan EW-0004 (Registered)
              </button>
              <button 
                type="button" 
                className="role-pill"
                onClick={() => { setManualInput('EW-0001'); handleLookup('EW-0001'); }}
              >
                Scan EW-0001 (In Transit)
              </button>
              <button 
                type="button" 
                className="role-pill"
                onClick={() => { setManualInput('EW-0002'); handleLookup('EW-0002'); }}
              >
                Scan EW-0002 (Under Inspection)
              </button>
            </div>
          </div>

          {/* Manual Input Fallback */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <form onSubmit={e => { e.preventDefault(); handleLookup(); }} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                className="form-input"
                placeholder="Or type Item ID (e.g. EW-0004)..."
                style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary" disabled={loading}>
                <Search size={16} />
                Lookup
              </button>
            </form>
          </div>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.15)', 
            border: '1px solid rgba(244, 63, 94, 0.3)', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-rose)',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '1px solid rgba(16, 185, 129, 0.4)', 
            padding: '14px 18px', 
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-mint)',
            fontSize: '0.92rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scanned Item Handoff Action Panel */}
        {item && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '1.2rem', 
                  fontWeight: 800, 
                  color: 'var(--accent-mint)'
                }}>
                  {item.itemId}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '2px' }}>
                  {item.deviceName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Category: <strong>{item.category}</strong> • Condition: <strong>{item.condition}</strong>
                </div>
              </div>

              <div>
                <span className={`status-badge ${item.currentStatus}`}>
                  Current: {item.currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Status Transition Action Card */}
            <div style={{ 
              background: 'rgba(14, 24, 40, 0.8)', 
              borderRadius: 'var(--radius-md)', 
              padding: '20px',
              border: '1px solid var(--border-active)',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-mint)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px' }}>
                <ArrowRight size={16} />
                <span>CONFIRM NEXT CUSTODY STAGE: {targetStatus}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Checkpoint Location Name *</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '38px' }}
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Intake / Handoff Notes</label>
                <textarea 
                  className="form-textarea" 
                  rows={2}
                  placeholder="e.g. Device verified physically, charger received, placed in bin #22..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <button 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%', marginTop: '10px' }}
                onClick={handleUpdateStatus}
                disabled={updating}
              >
                {updating ? 'Recording Checkpoint...' : `Confirm & Update to ${targetStatus}`}
              </button>
            </div>

            {/* Public Passport Link */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onTrackItem(item.itemId)}
              >
                View Public Passport Timeline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
