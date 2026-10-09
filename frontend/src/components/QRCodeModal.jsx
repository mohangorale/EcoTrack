import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, X, QrCode, Shield, CheckCircle2 } from 'lucide-react';

export default function QRCodeModal({ item, onClose }) {
  if (!item) return null;

  // The full public URL encoded into the QR code
  const publicTrackingUrl = `${window.location.origin}/?track=${item.itemId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = document.getElementById('item-qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${item.itemId}-qr-tag.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: 'var(--accent-mint)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <QrCode size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>E-Waste Digital Asset Tag</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unique Physical Traceability Identifier</p>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Physical Printable Label Box */}
        <div 
          className="printable-sticker"
          style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(14, 22, 38, 0.9) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--accent-mint)', fontWeight: 700, marginBottom: '8px' }}>
            ECOTRACK VERIFIED ASSET TAG
          </div>

          <div style={{ 
            background: '#FFFFFF', 
            padding: '16px', 
            borderRadius: '12px', 
            display: 'inline-block',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            margin: '8px 0'
          }}>
            <QRCodeSVG 
              id="item-qr-code-svg"
              value={publicTrackingUrl} 
              size={180} 
              level="Q"
              includeMargin={false}
            />
          </div>

          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            letterSpacing: '0.08em', 
            color: '#FFFFFF',
            marginTop: '8px'
          }}>
            {item.itemId}
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
            {item.deviceName}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Category: <strong style={{ color: 'var(--text-main)' }}>{item.category}</strong>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.72rem', 
            color: 'var(--accent-mint)', 
            marginTop: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px'
          }}>
            <Shield size={12} />
            <span>Scan with any camera to verify custody</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
            onClick={handleDownload}
          >
            <Download size={16} />
            Download PNG
          </button>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1 }}
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print Physical Label
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '12px' }}>
          Affix this printed sticker directly to the chassis of your electronic device before handover.
        </p>
      </div>
    </div>
  );
}
