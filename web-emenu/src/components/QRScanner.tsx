'use client';

import { useState, useRef, useEffect } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      setIsScanning(false);
      toast.success('QR code scanned successfully!');
      onScan(result);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    setError('Unable to access camera. Please check permissions.');
    toast.error('Camera access denied');
  };

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto">
      {/* Mobile full-screen overlay */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-90 flex flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
          <h3 className="text-white text-lg font-semibold">Scan QR Code</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Mobile scanner area */}
        <div className="flex-1 flex items-center justify-center p-4">
          {!isScanning ? (
            <div className="text-center space-y-6">
              <div className="w-48 h-48 mx-auto bg-white bg-opacity-10 rounded-2xl flex items-center justify-center border-2 border-white border-opacity-30">
                <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-white text-lg">
                Position the QR code within the frame
              </p>
              <Button onClick={startScanning} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-lg space-y-4">
              <div className="relative">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment'
                  }}
                  components={{
                    video: true,
                  }}
                  styles={{
                    container: {
                      width: '100%',
                      height: '60vh',
                      maxHeight: '400px',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      backgroundColor: 'black'
                    }
                  }}
                />
              </div>
              <Button
                onClick={stopScanning}
                variant="outline"
                className="w-full bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
              >
                Cancel Scanning
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4">
            <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-lg p-3">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop regular card */}
      <div className="hidden md:block">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Scan QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isScanning ? (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  Position the QR code within the camera frame
                </p>
                <Button onClick={startScanning} className="w-full">
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      facingMode: 'environment'
                    }}
                    components={{
                      video: true,
                    }}
                    styles={{
                      container: {
                        width: '100%',
                        height: '256px',
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={stopScanning}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="destructive"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Make sure the QR code is well-lit and clearly visible
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}