'use client';

import { useEffect } from 'react';

type LocaleAttributesProps = {
  locale: string;
};

export default function LocaleAttributes({ locale }: LocaleAttributesProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
