import { createContext, useContext } from 'react';
import type { Locale } from './translations';

export interface I18nValue {
  locale: Locale;
  toggle: () => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nValue | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
