import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Wrench, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Battery, 
  Cpu, 
  Monitor, 
  HardDrive 
} from 'lucide-react';
import { api } from '../services/api';

export default function InspectorView({ currentUser, onTrackItem }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('EW-0002');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Diagnostic Checklist State
  const [checklist, setChecklist] = useState({
    powerPost: true,
    batteryHealth: false,
    displayOk: true,
    dataWiped: true
  });

  // Decision State
  const [decision, setDecision] = useState('APPROVE_REFURBISHMENT');
  const [notes, setNotes] = useState('Motherboard and display functional. Battery degraded, replace cell and recertify.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    handleLookup('EW-0002');
  }, []);

  const handleLookup = async (idToLook) => {
    const id = (idToLook || searchId).trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.getItemDetails(id);
      setSelectedItem(res.data.item);
    } catch (err) {
      setError(err.message || 'Item not found');
      setSelectedItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleIntakeForInspection = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      await api.updateItemStatus(selectedItem.itemId, {
        status: 'UNDER_INSPECTION',
        location: 'Central Diagnostics & Quality Hub',
        notes: 'Device checked into diagnostic test bench'
      });
      setSuccess('Item successfully checked in for inspection!');
      handleLookup(selectedItem.itemId);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.recordInspection(selectedItem.itemId, {
        decision,
        location: 'Central Diagnostics Hub',
        notes
      });
      setSuccess(`Inspection decision recorded: ${decision}!`);
      handleLookup(selectedItem.itemId);
    } catch (err) {
      setError(err.message || 'Failed to record inspection decision');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkRefurbished = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await api.updateItemStatus(selectedItem.itemId, {
        status: 'REFURBISHED',
        location: 'Central Diagnostics Lab - Certification Desk',
        notes: 'Refurbishment repair and burn-in testing complete. Certified for second-life reuse.'
      });
      setSuccess('Item successfully certified as REFURBISHED!');
      handleLookup(selectedItem.itemId);
    } catch (err) {
      setError(err.message || 'Failed to certify refurbishment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '30px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(59, 130, 246, 0.12)', 
            color: '#60A5FA', 
            padding: '4px 12px', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px'
          }}>
            <Activity size={14} />
            <span>Hardware Diagnostics & Quality Assurance</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            Inspector <span style={{ color: 'var(--accent-mint)' }}>Workbench</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Diagnostic Lead: <strong>{currentUser?.name || 'Dr. Meera Nambiar'}</strong> ({currentUser?.organizationName || 'Central Hub'})
          </p>
        </div>

        {/* Item Lookup Bar */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <form onSubmit={e => { e.preventDefault(); handleLookup(); }} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              className="form-input"
              placeholder="Enter Item ID (e.g. EW-0002)..."
              style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={16} />
              Load Bench
            </button>
          </form>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Quick Bench Samples:</span>
            <button type="button" className="role-pill" onClick={() => { setSearchId('EW-0002'); handleLookup('EW-0002'); }}>
              EW-0002 (Under Inspection)
            </button>
            <button type="button" className="role-pill" onClick={() => { setSearchId('EW-0001'); handleLookup('EW-0001'); }}>
              EW-0001 (In Transit)
            </button>
            <button type="button" className="role-pill" onClick={() => { setSearchId('EW-0003'); handleLookup('EW-0003'); }}>
              EW-0003 (Recycling Scrap)
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
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

        {success && (
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
            <span>{success}</span>
          </div>
        )}

        {/* Selected Item Workbench Details */}
        {selectedItem && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-mint)' }}>
                  {selectedItem.itemId}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2px' }}>
                  {selectedItem.deviceName}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Category: <strong>{selectedItem.category}</strong> • Condition: <strong>{selectedItem.condition}</strong>
                </div>
              </div>

              <div>
                <span className={`status-badge ${selectedItem.currentStatus}`}>
                  {selectedItem.currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Check-in action if still IN_TRANSIT */}
            {selectedItem.currentStatus === 'IN_TRANSIT' && (
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.12)', 
                border: '1px solid rgba(59, 130, 246, 0.3)', 
                borderRadius: 'var(--radius-md)', 
                padding: '18px',
                marginBottom: '24px'
              }}>
                <h4 style={{ color: '#60A5FA', fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
                  Device Arrived at Diagnostics Lab
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                  Acknowledge physical arrival and transfer status to <strong>UNDER_INSPECTION</strong> to unlock diagnostic evaluations.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={handleIntakeForInspection}
                  disabled={submitting}
                >
                  <Activity size={16} />
                  Receive & Start Inspection
                </button>
              </div>
            )}

            {/* Diagnostics Form if UNDER_INSPECTION */}
            {selectedItem.currentStatus === 'UNDER_INSPECTION' && (
              <div>
                {/* Hardware Checklist */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
                  Hardware Diagnostic Checklist
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  <label className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checklist.powerPost} 
                      onChange={e => setChecklist({ ...checklist, powerPost: e.target.checked })} 
                    />
                    <Cpu size={16} style={{ color: 'var(--accent-mint)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Motherboard POST</span>
                  </label>

                  <label className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checklist.batteryHealth} 
                      onChange={e => setChecklist({ ...checklist, batteryHealth: e.target.checked })} 
                    />
                    <Battery size={16} style={{ color: checklist.batteryHealth ? 'var(--accent-mint)' : 'var(--accent-rose)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Battery Health &gt; 70%</span>
                  </label>

                  <label className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checklist.displayOk} 
                      onChange={e => setChecklist({ ...checklist, displayOk: e.target.checked })} 
                    />
                    <Monitor size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Display Panel OK</span>
                  </label>

                  <label className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={checklist.dataWiped} 
                      onChange={e => setChecklist({ ...checklist, dataWiped: e.target.checked })} 
                    />
                    <HardDrive size={16} style={{ color: 'var(--accent-violet)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>NIST 800-88 Wiped</span>
                  </label>
                </div>

                {/* Routing Pathway Selector */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
                  Circular Economy Routing Decision
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div 
                    className="glass-card" 
                    style={{ 
                      padding: '20px', 
                      cursor: 'pointer',
                      border: decision === 'APPROVE_REFURBISHMENT' ? '2px solid var(--accent-mint)' : '1px solid var(--border-subtle)',
                      background: decision === 'APPROVE_REFURBISHMENT' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(22, 34, 54, 0.65)'
                    }}
                    onClick={() => {
                      setDecision('APPROVE_REFURBISHMENT');
                      setNotes('Motherboard and display functional. Device viable for refurbishing and resale.');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-mint)', fontWeight: 700, marginBottom: '6px' }}>
                      <Wrench size={18} />
                      <span>PATH A: REFURBISHMENT</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Device is economically repairable. Routes to refurbishment technician bench.
                    </p>
                  </div>

                  <div 
                    className="glass-card" 
                    style={{ 
                      padding: '20px', 
                      cursor: 'pointer',
                      border: decision === 'SEND_FOR_RECYCLING' ? '2px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
                      background: decision === 'SEND_FOR_RECYCLING' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(22, 34, 54, 0.65)'
                    }}
                    onClick={() => {
                      setDecision('SEND_FOR_RECYCLING');
                      setNotes('Severe defect or corrosion. Non-economical to repair. Send for material recovery.');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 700, marginBottom: '6px' }}>
                      <Flame size={18} />
                      <span>PATH B: MATERIAL RECYCLING</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Device is beyond economical repair. Routes directly to smelting plant.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnostic Findings & Notes *</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleSubmitDecision}
                    disabled={submitting}
                  >
                    {submitting ? 'Recording...' : `Submit Decision: ${decision}`}
                  </button>

                  {/* If decision was already approved for refurbishment, show final certification button */}
                  {selectedItem.inspectionDecision === 'APPROVE_REFURBISHMENT' && (
                    <button 
                      className="btn btn-outline"
                      style={{ flex: 1, borderColor: 'var(--accent-mint)', color: 'var(--accent-mint)' }}
                      onClick={handleMarkRefurbished}
                      disabled={submitting}
                    >
                      <Sparkles size={16} />
                      Mark Repair Done & Certify REFURBISHED
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Read-only view if already terminal */}
            {['REFURBISHED', 'SENT_FOR_RECYCLING', 'PROCESSED'].includes(selectedItem.currentStatus) && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>
                  Inspection Record Archived:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Decision: <strong>{selectedItem.inspectionDecision || 'N/A'}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Notes: {selectedItem.inspectionNotes || 'No additional notes'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
