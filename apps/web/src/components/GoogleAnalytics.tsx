'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Replace with your actual Google Analytics Measurement ID
// Get it from: https://analytics.google.com/
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Check if user has consented to cookies
    const consent = localStorage.getItem('cookie-consent');

    if (consent === 'accepted' && GA_MEASUREMENT_ID) {
      // Grant consent for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      // Deny consent by default
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'default', {
          analytics_storage: 'denied'
        });
      }
    }
  }, []);

  // Don't load GA scripts if no measurement ID is provided
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Set default consent to denied
            gtag('consent', 'default', {
              'analytics_storage': 'denied'
            });

            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  );
}
