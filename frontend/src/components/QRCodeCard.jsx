import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Share2, Check } from 'lucide-react';

export default function QRCodeCard({ itemId, trackingUrl }) {
  const [copied, setCopied] = React.useState(false);
  const fullUrl = trackingUrl || `${window.location.origin}/track/${itemId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = document.getElementById(`qr-code-${itemId}`);
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
      downloadLink.download = `${itemId}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EcoTrack Asset ${itemId}`,
          text: `Track e-waste item ${itemId} on EcoTrack`,
          url: fullUrl,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Printable Area */}
      <div className="printable-sticker bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs inline-block">
        <QRCodeSVG
          id={`qr-code-${itemId}`}
          value={fullUrl}
          size={160}
          level="Q"
          includeMargin={false}
        />
      </div>

      {/* Action Buttons matching mockup */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleDownload}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <Download size={14} />
          Download QR
        </button>
        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <Printer size={14} />
          Print
        </button>
        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
}
