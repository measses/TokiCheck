import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TOKİCheck - Kira → Taksit Karar Destek Aracı',
  description:
    'TOKİ başvurusu düşünenler için taksit artışları, gelir dengesi ve kira-taksit çakışmasını hesaplayan açık kaynak araç',
  keywords: ['TOKİ', 'taksit hesaplama', 'konut', 'kira', 'Türkiye'],
  authors: [{ name: 'TOKİCheck Contributors' }],
  openGraph: {
    title: 'TOKİCheck - Kira → Taksit Karar Destek Aracı',
    description:
      'TOKİ başvurusu düşünenler için taksit artışları, gelir dengesi ve kira-taksit çakışmasını hesaplayan açık kaynak araç',
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOKİCheck',
    description: 'TOKİ taksit hesaplama ve karar destek aracı',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
