import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api/client';
import AdminLayout from '../components/AdminLayout';
import { sound } from '../utils/soundEffects';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Search,
  UserCheck,
  RefreshCw,
  Volume2,
  VolumeX,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AdminScanner() {
  const [scanResult, setScanResult] = useState(null); // { status: 'SUCCESS' | 'DUPLICATE' | 'INVALID', message, attendee, details }
  const [manualInput, setManualInput] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScannedToken, setLastScannedToken] = useState(null);

  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    try {
      if (scannerRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode('qr-reader-region');
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' }, // Rear camera preferred on mobile devices
        config,
        onScanSuccess,
        onScanFailure
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Camera initialization failed:', err);
      let errorMsg = 'Camera access unavailable. Please enable browser camera permissions or use the manual check-in form below.';
      const errStr = String(err?.name || err?.message || err);
      if (errStr.includes('NotAllowedError') || errStr.includes('Permission')) {
        errorMsg = 'Permission denied: Please allow camera permissions in your browser address bar to scan QR codes.';
      } else if (errStr.includes('NotFoundError') || errStr.includes('DevicesNotFoundError')) {
        errorMsg = 'No camera found: No video input device was detected. Please use the manual check-in search below.';
      } else if (errStr.includes('NotReadableError') || errStr.includes('TrackStartError')) {
        errorMsg = 'Camera unavailable: The camera is currently occupied by another program. Close it and retry.';
      } else if (errStr.includes('NotSupportedError') || (typeof window !== 'undefined' && !window.isSecureContext)) {
        errorMsg = 'Unsupported browser: Camera streaming requires a secure context (HTTPS or localhost).';
      }
      setCameraError(errorMsg);
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (e) {
        // ignore
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const onScanSuccess = async (decodedText) => {
    if (isProcessingRef.current) return;
    if (decodedText === lastScannedToken) return;

    isProcessingRef.current = true;
    setLastScannedToken(decodedText);

    await processTicketCheckIn({ token: decodedText, qrToken: decodedText });

    // Auto-resume timer
    setTimeout(() => {
      isProcessingRef.current = false;
      setLastScannedToken(null);
    }, 2800);
  };

  const onScanFailure = () => {
    // ignore frame noise
  };

  const processTicketCheckIn = async (payload) => {
    try {
      const res = await api.post('/checkin', {
        ...payload,
        scannedBy: 'Entrance Scanner Staff',
      });

      // 1. SUCCESS (GREEN)
      if (res.data.status === 'SUCCESS' || res.data.status === 'CHECKED_IN') {
        if (soundEnabled) sound.playSuccess();
        setScanResult({
          status: 'SUCCESS',
          message: 'VALID — CHECK-IN SUCCESSFUL',
          attendee: res.data.attendee,
        });
      }
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 409) {
        // 2. DUPLICATE (RED / AMBER ALERT)
        if (soundEnabled) sound.playDuplicate();
        setScanResult({
          status: 'DUPLICATE',
          message: 'ALREADY CHECKED IN',
          details: data?.details || 'This ticket was already checked in earlier.',
          attendee: data?.attendee,
        });
      } else {
        // 3. INVALID (RED)
        if (soundEnabled) sound.playError();
        setScanResult({
          status: 'INVALID',
          message: 'INVALID TICKET',
          details: data?.details || 'This ticket was not found in the official registration database.',
        });
      }
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setManualLoading(true);
    await processTicketCheckIn({ registrationId: manualInput.trim().toUpperCase() });
    setManualInput('');
    setManualLoading(false);
  };

  const resumeScanning = () => {
    setScanResult(null);
    isProcessingRef.current = false;
    setLastScannedToken(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar with Camera & Sound controls */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Gate Verification
            </span>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              QR Entrance Scanner
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-2xl border min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                soundEnabled
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
              title={soundEnabled ? 'Sound alerts on' : 'Sound alerts muted'}
              aria-label="Toggle sound alerts"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={isScanning ? stopCamera : startCamera}
              className={`px-4 py-3 rounded-2xl border font-bold text-xs flex items-center gap-2 min-h-[44px] transition-colors ${
                isScanning
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  <span>Pause Camera</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>Resume Camera</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= LARGE SCAN STATUS RESULT CARD (02-UI-UX-DESIGN.md) ================= */}
        {scanResult && (
          <div
            role="status"
            className={`rounded-3xl p-6 sm:p-8 text-white shadow-2xl transition-all duration-200 animate-in zoom-in-95 ${
              scanResult.status === 'SUCCESS'
                ? 'bg-emerald-600 border-4 border-emerald-400'
                : 'bg-red-600 border-4 border-red-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  {scanResult.status === 'SUCCESS' && <CheckCircle2 className="w-10 h-10 text-white" />}
                  {scanResult.status === 'DUPLICATE' && <AlertTriangle className="w-10 h-10 text-amber-300" />}
                  {scanResult.status === 'INVALID' && <XCircle className="w-10 h-10 text-white" />}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/80 block">
                    {scanResult.status === 'SUCCESS' ? 'VERIFIED ENTRANCE' : 'GATE ACCESS ALERT'}
                  </span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-white mt-0.5">
                    {scanResult.message}
                  </h2>
                </div>
              </div>

              <button
                onClick={resumeScanning}
                className="text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold"
                aria-label="Dismiss status"
              >
                &times;
              </button>
            </div>

            {/* Attendee Info Card */}
            {scanResult.attendee && (
              <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-2.5 gap-1">
                  <div>
                    <span className="text-xs font-bold text-white/70 block">Student Name</span>
                    <span className="font-heading font-black text-xl sm:text-2xl text-white">
                      {scanResult.attendee.studentName}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-white/70 block">Registration ID</span>
                    <span className="font-mono font-black text-lg text-amber-300">
                      {scanResult.attendee.registrationId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-white/70 block">Exam & Rank</span>
                    <span className="font-bold text-sm text-white">
                      {scanResult.attendee.exam} ({scanResult.attendee.rank})
                    </span>
                  </div>
                  <div>
                    <span className="text-white/70 block">Admitted Guests</span>
                    <span className="font-bold text-sm text-white">
                      {scanResult.attendee.numberOfGuests || 0} Guests
                    </span>
                  </div>
                  {scanResult.attendee.checkedInAt && (
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-white/70 block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Checked In At
                      </span>
                      <span className="font-mono font-bold text-sm text-amber-200">
                        {new Date(scanResult.attendee.checkedInAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {scanResult.details && (
                  <p className="text-xs text-amber-100 font-medium bg-black/25 p-3 rounded-xl mt-2 border border-white/10">
                    {scanResult.details}
                  </p>
                )}
              </div>
            )}

            {scanResult.status === 'INVALID' && (
              <p className="mt-4 text-sm text-white/95 bg-black/20 p-4 rounded-2xl border border-white/10">
                {scanResult.details}
              </p>
            )}

            {/* Big Accessible "Scan Next" Button */}
            <div className="mt-6 pt-2 flex justify-end">
              <button
                onClick={resumeScanning}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-black text-sm hover:bg-slate-100 shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>Scan Next Attendee</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= LARGE CAMERA SCANNING VIEWPORT ================= */}
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl text-center relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
            <span className="font-semibold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              {isScanning ? 'Scanner Active & Ready' : 'Camera Paused'}
            </span>
            <span>Position ticket QR code within camera square</span>
          </div>

          {/* Camera Viewport Area */}
          <div className="relative mx-auto max-w-md bg-black rounded-2xl overflow-hidden border-2 border-slate-700 min-h-[320px] flex items-center justify-center">
            <div id="qr-reader-region" className="w-full"></div>

            {/* Active Scanning Reticle Laser */}
            {isScanning && !scanResult && (
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3b82f6] animate-pulse pointer-events-none" />
            )}

            {cameraError && (
              <div className="absolute inset-0 bg-slate-900/95 p-6 flex flex-col items-center justify-center text-slate-300">
                <CameraOff className="w-10 h-10 text-rose-500 mb-3" />
                <p className="text-xs max-w-xs">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  Retry Camera Connection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= MANUAL ID SEARCH FALLBACK ================= */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-3">
            <h2 className="font-heading font-bold text-base text-slate-900">
              Manual Check-in Search
            </h2>
            <p className="text-xs text-slate-500">
              If an attendee cannot present their QR code on screen, enter their Registration ID (e.g. RM1001) or Mobile Number.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <label htmlFor="manualInput" className="sr-only">
                Registration ID or Mobile
              </label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="manualInput"
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter Registration ID (e.g. RM1001) or Mobile..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={manualLoading || !manualInput.trim()}
              className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              Verify Attendee
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
