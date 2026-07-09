import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext, type I18nValue } from './context';
import { translations, type Locale } from './translations';

function detectLocale(): Locale {
  const saved = localStorage.getItem('locale');
  if (saved === 'pt' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en';
  }, [locale]);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      toggle: () => setLocale((current) => (current === 'pt' ? 'en' : 'pt')),
      t: (key: string) => {
        let node: unknown = translations[locale];
        for (const part of key.split('.')) {
          node = (node as Record<string, unknown> | undefined)?.[part];
        }
        return typeof node === 'string' ? node : key;
      },
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
