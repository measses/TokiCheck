'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();

  // Remove current locale from pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');

  // Target locale
  const targetLocale = locale === 'tr' ? 'en' : 'tr';

  // Build new path with target locale
  const newPath = `/${targetLocale}${pathnameWithoutLocale || ''}`;

  return (
    <Link
      href={newPath}
      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
    >
      {targetLocale.toUpperCase()}
    </Link>
  );
}
