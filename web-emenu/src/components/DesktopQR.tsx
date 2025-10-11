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
    instruction: 'Scan this QR code with your phone camera to continue',
    orText: 'Or visit directly:',
    mobileExperience: 'Best experienced on mobile devices',
    features: [
      'Camera-based QR code scanning',
      'Touch-optimized interface',
      'Responsive design for phones and tablets'
    ]
  },
  vi: {
    title: 'Quét để xem trên di động',
    subtitle: 'Trải nghiệm này được tối ưu cho thiết bị di động',
    instruction: 'Quét mã QR này bằng camera điện thoại của bạn để tiếp tục',
    orText: 'Hoặc truy cập trực tiếp:',
    mobileExperience: 'Trải nghiệm tốt nhất trên thiết bị di động',
    features: [
      'Quét mã QR bằng camera',
      'Giao diện tối ưu cho cảm ứng',
      'Thiết kế phản hồi cho điện thoại và máy tính bảng'
    ]
  },
  ja: {
    title: 'モバイルで表示',
    subtitle: 'この体験はモバイルデバイス用に最適化されています',
    instruction: 'このQRコードをスマートフォンカメラでスキャンして続行',
    orText: 'または直接アクセス:',
    mobileExperience: 'モバイルデバイスで最適な体験',
    features: [
      'カメラベースのQRコードスキャン',
      'タッチ最適化インターフェース',
      'スマートフォンとタブレット用のレスポンシブデザイン'
    ]
  },
  ko: {
    title: '모바일에서 보기',
    subtitle: '이 경험은 모바일 기기에 최적화되어 있습니다',
    instruction: '휴대폰 카메라로 이 QR 코드를 스캔하여 계속하세요',
    orText: '또는 직접 방문:',
    mobileExperience: '모바일 기기에서 최상의 경험',
    features: [
      '카메라 기반 QR 코드 스캔',
      '터치 최적화 인터페이스',
      '스마트폰 및 태블릿용 반응형 디자인'
    ]
  },
  zh: {
    title: '在移动设备上查看',
    subtitle: '此体验已针对移动设备进行优化',
    instruction: '使用手机摄像头扫描此二维码继续',
    orText: '或直接访问:',
    mobileExperience: '在移动设备上获得最佳体验',
    features: [
      '基于摄像头的二维码扫描',
      '触摸优化界面',
      '手机和平板电脑的响应式设计'
    ]
  },
  ru: {
    title: 'Просмотр на мобильном устройстве',
    subtitle: 'Этот опыт оптимизирован для мобильных устройств',
    instruction: 'Отсканируйте этот QR-код камерой телефона, чтобы продолжить',
    orText: 'Или посетите напрямую:',
    mobileExperience: 'Лучший опыт на мобильных устройствах',
    features: [
      'Сканирование QR-кода на основе камеры',
      'Оптимизированный для касания интерфейс',
      'Адаптивный дизайн для телефонов и планшетов'
    ]
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

          {/* URL Display */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {t.orText}
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <code className="text-sm text-blue-600 break-all">
                {url}
              </code>
            </div>
          </div>

          {/* Mobile Benefits */}
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3">
              {t.mobileExperience}
            </h4>
            <ul className="text-sm text-orange-800 space-y-2">
              {t.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Device Icons */}
          <div className="flex justify-center items-center gap-4 text-gray-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}