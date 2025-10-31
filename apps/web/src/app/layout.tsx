import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import '@/styles/globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
