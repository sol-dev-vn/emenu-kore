'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent } from '@/components/ui/card';
import QRScanningAnimation from '@/components/QRScanningAnimation';

interface DesktopQRProps {
  url: string;
  language: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'ru';
}

const translations = {
  en: {
    title: 'Scan to View on Mobile',
    subtitle: 'This experience is optimized for mobile devices',
    instruction: 'Scan this QR code with your phone camera to continue'
  },
  vi: {
    title: 'Quét để xem trên di động',
    subtitle: 'Trải nghiệm này được tối ưu cho thiết bị di động',
    instruction: 'Quét mã QR này bằng camera điện thoại của bạn để tiếp tục'
  },
  ja: {
    title: 'モバイルで表示',
    subtitle: 'この体験はモバイルデバイス用に最適化されています',
    instruction: 'このQRコードをスマートフォンカメラでスキャンして続行'
  },
  ko: {
    title: '모바일에서 보기',
    subtitle: '이 경험은 모바일 기기에 최적화되어 있습니다',
    instruction: '휴대폰 카메라로 이 QR 코드를 스캔하여 계속하세요'
  },
  zh: {
    title: '在移动设备上查看',
    subtitle: '此体验已针对移动设备进行优化',
    instruction: '使用手机摄像头扫描此二维码继续'
  },
  ru: {
    title: 'Просмотр на мобильном устройстве',
    subtitle: 'Этот опыт оптимизирован для мобильных устройств',
    instruction: 'Отсканируйте этот QR-код камерой телефона, чтобы продолжить'
  }
};

export default function DesktopQR({ url, language }: DesktopQRProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const t = translations[language];

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [url]);

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Animated QR Scanning Illustration */}
          <QRScanningAnimation />

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p>Generating QR Code...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {t.title}
            </h3>

            <p className="text-gray-600 text-lg">
              {t.subtitle}
            </p>

            <p className="text-gray-700">
              {t.instruction}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}