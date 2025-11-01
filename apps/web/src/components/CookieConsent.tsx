'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');

    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    } else if (consent === 'accepted') {
      // Initialize analytics if already accepted
      initializeAnalytics();
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    initializeAnalytics();
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  const initializeAnalytics = () => {
    // Update GTM consent mode
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'denied', // Reklam için hala red
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'granted' // Sadece analytics kabul
      });

      // GTM event push
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'event': 'cookie_consent_granted',
        'consent_type': 'analytics'
      });
    }
  };

  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-gray-200 shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Icon */}
          <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">🍪 Çerez Kullanımı</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sosyal Konut App, web sitesinin performansını analiz etmek ve kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
              {' '}
              <a
                href="https://policies.google.com/technologies/cookies?hl=tr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-teal hover:underline font-medium"
              >
                Daha fazla bilgi
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={rejectCookies}
              className="flex-1 md:flex-none px-6 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reddet
            </button>
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none px-6 py-2.5 bg-brand-teal text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
