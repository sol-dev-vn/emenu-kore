'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';
import LanguageSelector from '@/components/LanguageSelector';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CustomerLandingPage() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'ru'>('en');
  const router = useRouter();

  const translations = {
    en: {
      welcome: 'Welcome to SOL eMenu',
      tagline: 'Scan the QR code on your table to browse our menu and place your order',
      scanQR: 'Scan QR Code',
      loading: 'Loading...',
      website: 'Website',
      hotline: 'Hotline',
      zalo: 'Zalo',
      email: 'Email',
      language: 'Language'
    },
    vi: {
      welcome: 'Chào mừng đến SOL eMenu',
      tagline: 'Quét mã QR trên bàn của bạn để xem thực đơn và đặt món',
      scanQR: 'Quét Mã QR',
      loading: 'Đang tải...',
      website: 'Website',
      hotline: 'Hotline',
      zalo: 'Zalo',
      email: 'Email',
      language: 'Ngôn ngữ'
    },
    ja: {
      welcome: 'SOL eMenuへようこそ',
      tagline: 'テーブルのQRコードをスキャンしてメニューをご覧ください',
      scanQR: 'QRコードをスキャン',
      loading: '読み込み中...',
      website: 'ウェブサイト',
      hotline: 'ホットライン',
      zalo: 'Zalo',
      email: 'メール',
      language: '言語'
    },
    ko: {
      welcome: 'SOL eMenu에 오신 것을 환영합니다',
      tagline: '테이블의 QR 코드를 스캔하여 메뉴를 보고 주문하세요',
      scanQR: 'QR 코드 스캔',
      loading: '로딩 중...',
      website: '웹사이트',
      hotline: '핫라인',
      zalo: 'Zalo',
      email: '이메일',
      language: '언어'
    },
    zh: {
      welcome: '欢迎使用SOL电子菜单',
      tagline: '扫描桌上的二维码浏览菜单并下单',
      scanQR: '扫描二维码',
      loading: '加载中...',
      website: '网站',
      hotline: '热线',
      zalo: 'Zalo',
      email: '邮箱',
      language: '语言'
    },
    ru: {
      welcome: 'Добро пожаловать в SOL eMenu',
      tagline: 'Отсканируйте QR-код на вашем столе, чтобы просмотреть меню и сделать заказ',
      scanQR: 'Сканировать QR-код',
      loading: 'Загрузка...',
      website: 'Веб-сайт',
      hotline: 'Горячая линия',
      zalo: 'Zalo',
      email: 'Электронная почта',
      language: 'Язык'
    }
  };

  // Desktop QR translations
  const qrTranslations = {
    en: {
      title: 'Scan to View on Mobile',
      subtitle: 'This experience is optimized for mobile devices',
      instruction: 'Scan to continue'
    },
    vi: {
      title: 'Quét để xem trên di động',
      subtitle: 'Trải nghiệm này được tối ưu cho thiết bị di động',
      instruction: 'Quét để tiếp tục'
    },
    ja: {
      title: 'モバイルで表示',
      subtitle: 'この体験はモバイルデバイス用に最適化されています',
      instruction: 'スキャンして続行'
    },
    ko: {
      title: '모바일에서 보기',
      subtitle: '이 경험은 모바일 기기에 최적화되어 있습니다',
      instruction: '스캔하여 계속'
    },
    zh: {
      title: '在移动设备上查看',
      subtitle: '此体验已针对移动设备进行优化',
      instruction: '扫描以继续'
    },
    ru: {
      title: 'Просмотр на мобильном устройстве',
      subtitle: 'Этот опыт оптимизирован для мобильных устройств',
      instruction: 'Сканируйте, чтобы продолжить'
    }
  };

  const t = translations[language];
  const qrT = qrTranslations[language];

  const handleQRScan = async (data: string) => {
    setIsLoading(true);
    setShowQRScanner(false);

    try {
      // Parse QR code data
      const url = new URL(data);
      const tableId = url.searchParams.get('table');

      if (tableId) {
        // Redirect to menu with table
        router.push(`/qr?table=${tableId}`);
      } else {
        // Fallback: treat the data as table ID directly
        router.push(`/qr?table=${data}`);
      }
    } catch (error) {
      console.error('Invalid QR code format:', error);
      // Try to use the data as table ID directly
      router.push(`/qr?table=${data}`);
    }
  };

  
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner message={t.loading} />}

      {/* Video Background for Desktop */}
      <div className="hidden md:block absolute inset-0 z-0">
        {/* Bright fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-amber-200 to-orange-400" />

        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
          preload="metadata"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(254%2C215%2C170);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgb(251%2C146%2C60);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)' /%3E%3C/svg%3E"
        >
          <source src="/background_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Lighter overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Language Selector - positioned absolutely on desktop */}
      <div className="hidden md:block absolute top-4 right-4 z-20">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>

      {/* Mobile Language Selector - positioned normally */}
      <div className="md:hidden absolute top-4 right-4 z-10">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4">
        {/* Desktop View - Video background with centered QR and title */}
        <div className="hidden md:flex flex-col items-center justify-center w-full h-screen space-y-8">
          {/* SOL Logo */}
          <div className="animate-fade-in">
            <img
              src="/logo_trim.png"
              alt="SOL eMenu"
              className="w-64 h-auto lg:w-80"
            />
          </div>

          {/* Centered QR Code */}
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-95">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {qrT.title}
                </h3>
                <p className="text-gray-600">
                  {qrT.instruction}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://sol-menu.alphabits.team/"
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Current design */}
        <div className="md:hidden w-full max-w-md animate-fade-in space-y-6">
          {/* SOL Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <img
              src="/logo_trim.png"
              alt="SOL eMenu"
              className="w-48 h-auto mx-auto"
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t.welcome}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* Mobile QR Scanner */}
          {!showQRScanner ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <button
                onClick={() => setShowQRScanner(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                {t.scanQR}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md animate-fade-in">
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowQRScanner(false)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Semi-translucent blurry footer */}
      <footer className="relative z-10 bg-white bg-opacity-20 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white">
            {/* Website */}
            <a
              href="https://www.sol.com.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-orange-300 transition-colors drop-shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{t.website}</span>
            </a>

            {/* Hotline */}
            <a
              href="tel:0888104799"
              className="flex items-center gap-2 hover:text-orange-300 transition-colors drop-shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>0888.104.799</span>
            </a>

            {/* Zalo */}
            <a
              href="https://zalo.me/2735540598556716859"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-orange-300 transition-colors drop-shadow-md"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>{t.zalo}</span>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@sol.com.vn"
              className="flex items-center gap-2 hover:text-orange-300 transition-colors drop-shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{t.email}</span>
            </a>
          </div>
          <div className="text-center mt-4 text-sm text-white drop-shadow-md">
            © 2025 SOL.com.vn - Sense of Life
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}