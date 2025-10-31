'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">{t('description')}</p>
          <p className="text-xs">
            {t('disclaimer')}{' '}
            <a
              href="https://www.toki.gov.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              toki.gov.tr
            </a>
            {' '}{t('and')}{' '}
            <a
              href="https://evsahibiturkiye.gov.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              evsahibiturkiye.gov.tr
            </a>
            {' '}{t('visit')}
          </p>
        </div>
      </div>
    </footer>
  );
}
