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
  );
}