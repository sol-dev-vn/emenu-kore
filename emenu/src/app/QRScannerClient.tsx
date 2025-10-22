'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    setIsScanning(true);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate QR scanning (in real implementation, you'd use a QR library)
      setTimeout(() => {
        const mockQRData = 'https://sol-menu.alphabits.team/menu/table-123';
        onScan(mockQRData);
        stopScanning();
      }, 3000);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6 space-y-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={startScanning}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                {/* Scanning Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  </div>

                  {/* Scanning Line Animation */}
                  <div className="absolute inset-4">
                    <div className="h-full w-0.5 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse mx-auto"></div>
                  </div>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                )}
              </div>

              <p className="text-center text-gray-600 text-sm">
                Position the QR code within the frame to scan
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QRScannerClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');

  const handleScan = (data: string) => {
    setScannedData(data);
    setIsModalOpen(false);

    // In a real implementation, you would navigate to the scanned URL
    console.log('Scanned:', data);

    // For demo purposes, let's show an alert
    alert(`QR Code scanned: ${data}`);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg"
        style={{backgroundColor: 'rgba(249, 250, 251, 0.8)', borderColor: 'rgba(229, 231, 235, 0.8)'}}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{backgroundColor: '#9B1D20'}}>
            <Camera className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <span className="block font-semibold text-xl text-gray-800">Scan QR Code</span>
            <span className="block text-sm text-gray-600 mt-1">Tap to open scanner</span>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </button>

      <QRScannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScan={handleScan}
      />
    </>
  );
}