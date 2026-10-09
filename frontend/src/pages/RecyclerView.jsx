import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  ShieldCheck, 
  Recycle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function RecyclerView({ currentUser, onTrackItem }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('EW-0003');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Recovery Metrics Form
  const [facility, setFacility] = useState(currentUser?.organizationName || 'GreenSmelt Authorized Metal Refiners');
  const [copperGrams, setCopperGrams] = useState(240);
  const [goldGrams, setGoldGrams] = useState(0.45);
  const [plasticKg, setPlasticKg] = useState(1.8);
  const [notes, setNotes] = useState('Thermal dismantling and chemical extraction complete. Zero hazardous residue to landfill.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    handleLookup('EW-0003');
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

  const handleConfirmProcessed = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const recoverySummary = `Material Yield: ${copperGrams}g Copper, ${goldGrams}g Gold/PGM, ${plasticKg}kg Polycarbonate/ABS. ${notes}`;
      await api.updateItemStatus(selectedItem.itemId, {
        status: 'PROCESSED',
        location: facility,
        notes: recoverySummary
      });

      setSuccess(`Item ${selectedItem.itemId} successfully recorded as PROCESSED! Certified closed-loop reclamation complete.`);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      handleLookup(selectedItem.itemId);
    } catch (err) {
      setError(err.message || 'Failed to update processing status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '30px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(249, 115, 22, 0.12)', 
            color: '#FB923C', 
            padding: '4px 12px', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px'
          }}>
            <Flame size={14} />
            <span>Industrial Smelting & Reclamation</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>
            Plant <span style={{ color: 'var(--accent-mint)' }}>Recycler Hub</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Authorized Operator: <strong>{currentUser?.name || 'Kabir Deshmukh'}</strong> ({facility})
          </p>
        </div>

        {/* Item Lookup Bar */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <form onSubmit={e => { e.preventDefault(); handleLookup(); }} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              className="form-input"
              placeholder="Enter Item ID (e.g. EW-0003)..."
              style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={16} />
              Load Scrap Item
            </button>
          </form>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Quick Feed Samples:</span>
            <button type="button" className="role-pill" onClick={() => { setSearchId('EW-0003'); handleLookup('EW-0003'); }}>
              EW-0003 (Sent For Recycling)
            </button>
            <button type="button" className="role-pill" onClick={() => { setSearchId('EW-0002'); handleLookup('EW-0002'); }}>
              EW-0002 (Under Inspection)
            </button>
          </div>
        </div>

        {/* Alert Feedback */}
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

        {/* Scanned Scrap Item */}
        {selectedItem && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-mint)' }}>
                  {selectedItem.itemId}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>
                  {selectedItem.deviceName}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Category: <strong>{selectedItem.category}</strong> • Defect: <strong>{selectedItem.description}</strong>
                </div>
              </div>

              <div>
                <span className={`status-badge ${selectedItem.currentStatus}`}>
                  {selectedItem.currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Diagnostic Handoff Notes */}
            {selectedItem.inspectionNotes && (
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                  INSPECTION DIAGNOSTIC REPORT:
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  {selectedItem.inspectionNotes}
                </span>
              </div>
            )}

            {/* If SENT_FOR_RECYCLING, allow final processing */}
            {selectedItem.currentStatus === 'SENT_FOR_RECYCLING' ? (
              <div style={{ 
                background: 'rgba(19, 78, 74, 0.25)', 
                border: '1px solid rgba(20, 184, 166, 0.4)', 
                borderRadius: 'var(--radius-md)', 
                padding: '24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                  <Recycle size={18} />
                  <span>Execute Certified Material Reclamation & Destruction</span>
                </div>

                {/* Material Recovery Input Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Recovered Copper (Grams)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={copperGrams}
                      onChange={e => setCopperGrams(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Precious Metals / Gold (Grams)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-input" 
                      value={goldGrams}
                      onChange={e => setGoldGrams(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">High-Grade Plastics (Kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-input" 
                      value={plasticKg}
                      onChange={e => setPlasticKg(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Recycling Plant Facility</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={facility}
                    onChange={e => setFacility(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate & Hazardous Neutralization Log</label>
                  <textarea 
                    className="form-textarea" 
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <button 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={handleConfirmProcessed}
                  disabled={submitting}
                >
                  <ShieldCheck size={18} />
                  {submitting ? 'Confirming Recovery...' : 'Issue Recycling Certificate & Mark PROCESSED'}
                </button>
              </div>
            ) : selectedItem.currentStatus === 'PROCESSED' ? (
              <div style={{ 
                background: 'rgba(20, 184, 166, 0.15)', 
                border: '1px solid rgba(20, 184, 166, 0.35)', 
                borderRadius: 'var(--radius-md)', 
                padding: '20px',
                textAlign: 'center'
              }}>
                <ShieldCheck size={40} style={{ color: 'var(--accent-cyan)', margin: '0 auto 10px auto' }} />
                <h4 style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  Certified Material Recovery Complete
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  This device has completed end-of-life smelting. Its digital ledger is permanently archived.
                </p>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ marginTop: '12px' }}
                  onClick={() => onTrackItem(selectedItem.itemId)}
                >
                  View Public Passport
                </button>
              </div>
            ) : (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 'var(--radius-md)', 
                padding: '20px', 
                textAlign: 'center' 
              }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Item is currently in state <strong>{selectedItem.currentStatus}</strong>.
                  Only items transitioned to <strong>SENT_FOR_RECYCLING</strong> can be processed at this station.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
