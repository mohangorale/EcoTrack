import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, X, QrCode, Shield } from 'lucide-react';

export default function QRCodeModal({ item, onClose }) {
  if (!item) return null;

  const publicTrackingUrl = `${window.location.origin}/track/${item.itemId}`;

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
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="QR code asset tag"
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534] shrink-0">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">E-Waste Digital Asset Tag</h3>
              <p className="text-xs text-slate-500">Unique physical traceability identifier</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="printable-sticker mb-5 rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4 sm:p-6 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#166534]">
            EcoTrack Verified Asset Tag
          </p>

          <div className="mx-auto inline-block rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <QRCodeSVG
              id="item-qr-code-svg"
              value={publicTrackingUrl}
              size={180}
              level="Q"
              includeMargin={false}
            />
          </div>

          <p className="mt-3 font-mono text-xl font-extrabold tracking-wide text-[#0F172A]">
            {item.itemId}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{item.deviceName}</p>
          <p className="mt-1 text-xs text-slate-500">
            Category:{' '}
            <strong className="text-slate-700">
              {String(item.category || 'Other').replace(/_/g, ' ')}
            </strong>
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-[#166534]">
            <Shield size={12} />
            <span>Scan with any camera to verify custody</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={handleDownload} className="btn-outline text-sm">
            <Download size={16} />
            Download PNG
          </button>
          <button type="button" onClick={handlePrint} className="btn-primary text-sm">
            <Printer size={16} />
            Print Label
          </button>
        </div>

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          Affix this printed sticker to the device before handover.
        </p>
      </div>
    </div>
  );
}
