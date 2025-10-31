import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | Sosyal Konut Başvuru Rehberi',
  description:
    '500 Bin Sosyal Konut projesi hakkında merak ettikleriniz. Başvuru şartları, taksit planı, peşinat, kontenjanlar ve daha fazlası. Detaylı SSS rehberi.',
  keywords: [
    'sosyal konut sss',
    'sosyal konut başvuru şartları',
    'sosyal konut sıkça sorulan sorular',
    'toki başvuru rehberi',
    '500 bin konut sss',
    'sosyal konut kontenjanlar',
    'taksit planı sss',
  ],
  openGraph: {
    title: 'Sıkça Sorulan Sorular | Sosyal Konut Başvuru Rehberi',
    description: '500 Bin Sosyal Konut projesi hakkında tüm sorularınızın cevabı. Detaylı SSS rehberi.',
    type: 'website',
    siteName: 'Sosyal Konut App',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
