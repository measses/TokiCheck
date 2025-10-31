import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import LocaleAttributes from './locale-attributes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
          <Navbar locale={locale} />
          <main>{children}</main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </>
  );
}
