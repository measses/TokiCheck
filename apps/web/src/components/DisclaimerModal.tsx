'use client';

import { useState, useEffect } from 'react';

export default function DisclaimerModal() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted first
    setMounted(true);

    // Only check localStorage AFTER component is mounted
    const checkDisclaimer = () => {
      if (typeof window === 'undefined') return;

      const seen = localStorage.getItem('disclaimer-seen');

      if (!seen) {
        // Show modal after a short delay
        setTimeout(() => {
          setShowModal(true);
        }, 500);
      }
    };

    checkDisclaimer();
  }, []);

  const closeModal = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('disclaimer-seen', 'true');
    }
    setShowModal(false);
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null;
  if (!showModal) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" />

      {/* Modal Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-2xl max-w-3xl w-full animate-scale-in border-2 border-brand-teal/30">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-brand-teal/20">
            <div className="flex items-center gap-3">
              <div className="bg-brand-teal/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">ℹ️ Önemli Bilgilendirme</h3>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-brand-teal transition-colors p-1"
              aria-label="Kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-brand-teal/20">
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong className="text-brand-teal">Sosyal Konut App</strong>, bağımsız bir{' '}
                <strong className="text-brand-teal">bilgilendirme ve hesaplama aracıdır</strong>.
                TOKİ veya herhangi bir resmi kurum tarafından işletilmemektedir.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Bu araçta yapılan hesaplamalar <strong className="text-brand-teal">tahmini</strong> sonuçlardır ve
                resmi olmayan varsayımlara dayanmaktadır. Kesin bilgi ve başvuru için lütfen resmi kaynaklara başvurunuz:
              </p>
            </div>

            {/* Official Links */}
            <div className="grid md:grid-cols-2 gap-3">
              <a
                href="https://www.toki.gov.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-brand-teal/30 hover:border-brand-teal hover:bg-teal-50 transition-all"
              >
                <div className="bg-brand-teal/10 p-2 rounded-lg group-hover:bg-brand-teal/20 transition-colors">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 group-hover:text-brand-teal transition-colors">TOKİ Resmi Sitesi</div>
                  <div className="text-xs text-gray-600">toki.gov.tr</div>
                </div>
                <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="https://evsahibiturkiye.gov.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-brand-teal/30 hover:border-brand-teal hover:bg-teal-50 transition-all"
              >
                <div className="bg-brand-teal/10 p-2 rounded-lg group-hover:bg-brand-teal/20 transition-colors">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 group-hover:text-brand-teal transition-colors">Ev Sahibi Türkiye</div>
                  <div className="text-xs text-gray-600">evsahibiturkiye.gov.tr</div>
                </div>
                <svg className="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Warning Note */}
            <div className="bg-teal-50 border-l-4 border-brand-teal p-4 rounded-r-lg">
              <p className="text-sm text-gray-800 leading-relaxed">
                <strong>📌 Not:</strong> Bu araç yalnızca karar verme sürecinize destek olmak için tasarlanmıştır.
                Hesaplamalar genel varsayımlara dayanır ve kişisel durumunuz farklılık gösterebilir.
              </p>
            </div>
          </div>

          {/* Footer Button */}
          <div className="p-6 bg-teal-50/50 rounded-b-2xl border-t border-brand-teal/20">
            <button
              onClick={closeModal}
              className="w-full px-6 py-3 bg-brand-teal text-white rounded-xl font-bold hover:bg-teal-700 transition-all hover:scale-105 shadow-lg"
            >
              Anladım, Devam Et
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
