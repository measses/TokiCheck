import { Inter } from 'next/font/google';
import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import LocaleAttributes from './locale-attributes';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      <LocaleAttributes locale={locale} />
      <NextIntlClientProvider messages={messages}>
        <div className={`${inter.className} min-h-screen bg-background`}>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-primary">
                    TOKİCheck
                  </h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                    Ana Sayfa
                  </Link>
                  <Link href={`/${locale}/calculator`} className="hover:text-primary transition-colors">
                    Hesaplama
                  </Link>
                  <a href="https://github.com/measses/TokiCheck" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    GitHub
                  </a>
                </nav>
                <div className="flex items-center space-x-2">
                  <Link
                    href={locale === 'tr' ? '/en' : '/tr'}
                    className="px-3 py-1 text-sm border rounded-md hover:bg-accent transition-colors"
                  >
                    {locale === 'tr' ? 'EN' : 'TR'}
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  TOKİCheck - Açık kaynak TOKİ karar destek aracı
                </p>
                <p className="text-xs">
                  Bu araç bilgilendirme amaçlıdır. Resmi TOKİ verileri için{' '}
                  <a
                    href="https://www.toki.gov.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    toki.gov.tr
                  </a>{' '}
                  adresini ziyaret edin.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </NextIntlClientProvider>
    </>
  );
}
