import React, { useEffect, useRef, useState, useId } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  Camera, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  SwitchCamera,
  Maximize2,
  HelpCircle
} from 'lucide-react';
import { extractItemIdFromQr } from '../utils/qrParser';

export default function QRScannerModal({ isOpen, onClose, onScan, title = 'Scan E-Waste QR Code' }) {
  const instanceId = useId().replace(/:/g, '');
  const containerId = `qr-reader-${instanceId}`;

  const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [scannedResult, setScannedResult] = useState('');

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera helper
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        // Ignore stop errors
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  // Start camera (strictly back / rear camera only)
  const startCamera = async (cameraIdToUse = null) => {
    setCameraError('');
    setIsStarting(true);

    try {
      await stopCamera();

      // Ensure container element is in DOM
      const containerEl = document.getElementById(containerId);
      if (!containerEl) {
        setIsStarting(false);
        return;
      }

      const qrScanner = new Html5Qrcode(containerId);
      html5QrCodeRef.current = qrScanner;

      // Query cameras and strictly exclude any front / user / selfie camera
      let rearCameras = cameras;
      if (rearCameras.length === 0) {
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            // Filter OUT front cameras completely
            const filtered = devices.filter(
              (d) => !/front|user|selfie|face|facetime/i.test(d.label || '')
            );
            rearCameras = filtered.length > 0 ? filtered : devices;
            setCameras(rearCameras);
          }
        } catch (e) {
          // If getCameras fails, we fall back to facingMode
        }
      }

      // Explicitly find back/rear camera by label if available
      const detectedBack = rearCameras.find((c) =>
        /back|rear|environment|world/i.test(c.label || '')
      );

      // Camera config: strictly prioritize back camera / facingMode: "environment"
      const cameraConfig =
        cameraIdToUse ||
        (detectedBack ? detectedBack.id : { facingMode: 'environment' });

      await qrScanner.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const edge = Math.min(viewfinderWidth, viewfinderHeight) * 0.72;
            return { width: Math.max(Math.floor(edge), 200), height: Math.max(Math.floor(edge), 200) };
          },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleSuccess(decodedText);
        },
        () => {
          // Frame error (no QR in view), normal behavior
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.warn('Failed to start rear camera:', err);
      setCameraError(
        err?.message?.includes('NotAllowedError') || err?.message?.includes('Permission')
          ? 'Camera access was denied. Please allow camera permissions in your browser or switch to "Upload QR Image".'
          : 'Unable to start rear camera. You can upload an image with a QR code or use demo samples.'
      );
    } finally {
      setIsStarting(false);
    }
  };

  // Handle successful scan
  const handleSuccess = (rawText) => {
    const cleanId = extractItemIdFromQr(rawText);
    setScannedResult(cleanId);

    // Provide haptic feedback if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(100); } catch (_) {}
    }

    // Stop scanner after slight delay so user sees feedback
    setTimeout(async () => {
      await stopCamera();
      if (onScan) {
        onScan(cleanId);
      }
      onClose();
    }, 450);
  };

  // Toggle camera switch
  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextCamera = cameras[(currentIndex + 1) % cameras.length];
    setSelectedCameraId(nextCamera.id);
    await startCamera(nextCamera.id);
  };

  // Handle file upload scanning
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    try {
      // Create temporary scanner instance or reuse
      const tempScanner = html5QrCodeRef.current || new Html5Qrcode(containerId);
      const decodedText = await tempScanner.scanFile(file, true);
      handleSuccess(decodedText);
    } catch (err) {
      setUploadError('No valid QR code found in this image. Please ensure the QR is clear and well lit.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Lifecycle
  useEffect(() => {
    if (isOpen && mode === 'camera') {
      // Delay briefly for modal transition to render DOM
      const timer = setTimeout(() => {
        startCamera(selectedCameraId);
      }, 150);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, mode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-[#166534]">
              <Camera size={20} />
            </div>
            <div>
              <h2 id="qr-modal-title" className="text-base font-bold text-[#0F172A]">{title}</h2>
              <p className="text-xs text-slate-500">Center the QR code in the viewfinder to scan</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            aria-label="Close scanner"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-100 px-5 pt-3 bg-white">
          <button
            onClick={() => {
              setMode('camera');
              setCameraError('');
            }}
            className={`flex items-center gap-2 border-b-2 pb-2.5 text-xs font-semibold transition-colors ${
              mode === 'camera'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera size={15} />
            Live Camera Scan
          </button>
          <button
            onClick={() => {
              stopCamera();
              setMode('upload');
              setUploadError('');
            }}
            className={`ml-5 flex items-center gap-2 border-b-2 pb-2.5 text-xs font-semibold transition-colors ${
              mode === 'upload'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload size={15} />
            Upload QR Image
          </button>
        </div>

        {/* Scanner Body */}
        <div className="p-5 flex-1 flex flex-col items-center">
          {mode === 'camera' && (
            <div className="w-full flex flex-col items-center">
              {/* Camera Frame */}
              <div className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-inner">
                {/* HTML5 QR Container */}
                <div 
                  id={containerId} 
                  className="w-full h-full flex items-center justify-center overflow-hidden"
                />

                {/* Laser Overlay when scanning */}
                {isScanning && !scannedResult && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    {/* Corner Guides */}
                    <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    
                    {/* Laser line */}
                    <div className="absolute inset-x-8 top-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] qr-scanner-laser" />
                  </div>
                )}

                {/* Starting Spinner */}
                {isStarting && (
                  <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-white gap-2">
                    <RefreshCw size={24} className="animate-spin text-emerald-400" />
                    <span className="text-xs font-medium">Starting camera…</span>
                  </div>
                )}

                {/* Success Indicator Overlay */}
                {scannedResult && (
                  <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center text-white gap-2 z-10 animate-in zoom-in-95 duration-150">
                    <CheckCircle2 size={44} className="text-emerald-400 animate-bounce" />
                    <span className="text-sm font-bold">QR Detected!</span>
                    <span className="font-mono text-xs px-2.5 py-1 bg-emerald-800/80 rounded-md border border-emerald-500/50">
                      {scannedResult}
                    </span>
                  </div>
                )}
              </div>

              {/* Camera Controls / Status */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 rounded-full">
                  <Camera size={12} />
                  Back Camera Active
                </span>

                {cameras.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <SwitchCamera size={13} />
                    Switch Rear Lens
                  </button>
                )}

                {cameraError && (
                  <button
                    type="button"
                    onClick={() => startCamera(selectedCameraId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#166534] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                  >
                    <RefreshCw size={13} />
                    Retry Camera
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="mt-3 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                  <div className="flex-1">
                    <p className="font-semibold">Camera unavailable</p>
                    <p className="mt-0.5">{cameraError}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'upload' && (
            <div className="w-full flex flex-col items-center">
              <label className="w-full max-w-[340px] aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 transition-colors flex flex-col items-center justify-center p-6 cursor-pointer text-center group">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 group-hover:text-[#166534] group-hover:border-emerald-300 transition-colors mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-[#166534]">
                  Upload QR Code Image
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Select a photo, screenshot, or sticker from your device
                </p>
                <span className="mt-3 inline-block px-3 py-1 text-[11px] font-semibold text-[#166534] bg-emerald-100 rounded-full">
                  Browse files
                </span>
              </label>

              {uploadError && (
                <div className="mt-3 w-full p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Simulation Chips */}
          <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick Test / Demo Items:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['EW00123', 'EW00122', 'EW00120'].map((sampleId) => (
                <button
                  key={sampleId}
                  type="button"
                  onClick={() => handleSuccess(sampleId)}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 transition-colors"
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
