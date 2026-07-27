import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  applyTheme,
  readInitialTheme,
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
} from './theme';

/**
 * Provider do tema claro/escuro.
 *
 * A animação da troca fica no `AnimatedThemeToggler` (View Transitions +
 * clip-path). Aqui só sincronizamos `data-theme`, estado React e localStorage.
 * `setTheme` aplica o DOM de forma síncrona — necessário para o snapshot da
 * View Transitions API dentro de `flushSync`.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  /* Sincroniza DOM (mount + safety net) e persiste a preferência. A troca
     animada chama `setTheme`, que já aplica o DOM de forma síncrona. */
  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Sem persistência: o tema vale só para esta sessão.
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
