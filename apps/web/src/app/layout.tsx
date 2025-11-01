import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

// Trigger deployment after Cloudflare Zaraz fix
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sosyalkonut.app'),
  title: 'Sosyal Konut Hesaplama | 500 Bin Konut Taksit & Kira Hesaplayıcı',
  description:
    '500 Bin Sosyal Konut projesi için taksit hesaplama aracı. 240 aylık taksit planı, kira-taksit çakışması, gelir dengesi ve sürdürülebilirlik analizi. Başvuru öncesi finansal durumunuzu inceleyin.',
  keywords: [
    'sosyal konut',
    '500 bin konut',
    'toki konut',
    'sosyal konut başvuru',
    'taksit hesaplama',
    'konut kredisi',
    'kira taksit karşılaştırma',
    'ev sahibi türkiye',
    'konut taksit hesaplayıcı',
    'sosyal konut 2025',
    'toki başvuru',
    'uygun fiyatlı konut',
  ],
  authors: [{ name: 'Sosyal Konut App' }],
  creator: 'Sosyal Konut App',
  publisher: 'Sosyal Konut App',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Sosyal Konut Hesaplama | 500 Bin Konut Taksit Hesaplayıcı',
    description:
      '500 Bin Sosyal Konut projesi için taksit hesaplama aracı. 240 aylık taksit planı, kira-taksit çakışması analizi. Başvuru öncesi finansal durumunuzu inceleyin.',
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    siteName: 'Sosyal Konut App',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sosyal Konut App - 500 Bin Konut Hesaplayıcı',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sosyal Konut Hesaplama | 500 Bin Konut Taksit Hesaplayıcı',
    description: '500 Bin Sosyal Konut projesi için taksit ve kira-taksit çakışması hesaplama aracı.',
    creator: '@mertaraz',
  },
  alternates: {
    canonical: 'https://sosyalkonut.app',
    languages: {
      'tr-TR': '/tr',
    },
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {GTM_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('consent', 'default', {'ad_storage': 'denied','ad_user_data': 'denied','ad_personalization': 'denied','analytics_storage': 'denied'});`,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+'&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* GTM - Noscript */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
