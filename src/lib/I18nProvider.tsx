import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  dictionary,
  HTML_LANG,
  I18nContext,
  LANG_STORAGE_KEY,
  LANGUAGES,
  readInitialLang,
  type Lang,
  type MessageKey,
} from './i18n';

/** Provider do idioma: guarda a escolha, mantém o `lang` do documento e traduz. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Sem persistência: o idioma vale só para esta sessão.
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const cycleLang = useCallback(() => {
    setLangState((current) => {
      const index = LANGUAGES.findIndex((l) => l.code === current);
      return LANGUAGES[(index + 1) % LANGUAGES.length].code;
    });
  }, []);

  const t = useCallback((key: MessageKey) => dictionary[key][lang], [lang]);

  const value = useMemo(
    () => ({ lang, setLang, cycleLang, t }),
    [lang, setLang, cycleLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export default I18nProvider;
