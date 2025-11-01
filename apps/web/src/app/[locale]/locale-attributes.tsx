'use client';

import { useEffect } from 'react';

type LocaleAttributesProps = {
  locale: string;
};

export default function LocaleAttributes({ locale }: LocaleAttributesProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
