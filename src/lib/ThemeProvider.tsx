import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  applyTheme,
  radiusToCover,
  readInitialTheme,
  THEME_BACKGROUND,
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
} from './theme';

/**
 * Provider do tema — e a animação da troca.
 *
 * O tema novo brota de um círculo que cresce a partir do botão sol/lua: com a
 * View Transitions API o navegador congela a tela antiga e revela a nova por
 * dentro do círculo; sem ela, um véu da cor de destino faz o mesmo gesto.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  /* Sincroniza o DOM: o script inline do index.html cobre o primeiro paint,
     este efeito cobre as trocas seguintes. */
  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Sem persistência: o tema vale só para esta sessão.
    }
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      // Sem origem (teclado, por exemplo): o círculo nasce do canto superior direito.
      const x = origin?.x ?? window.innerWidth - 48;
      const y = origin?.y ?? 48;
      root.style.setProperty('--theme-x', `${x}px`);
      root.style.setProperty('--theme-y', `${y}px`);
      root.style.setProperty('--theme-r', `${radiusToCover(x, y)}px`);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      type WithViewTransition = Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };
      const doc = document as WithViewTransition;

      if (!reduced && typeof doc.startViewTransition === 'function') {
        doc.startViewTransition(() => {
          applyTheme(next);
          setThemeState(next);
        });
        return;
      }

      if (reduced) {
        setThemeState(next);
        return;
      }

      // Fallback: véu da cor de destino crescendo do botão até cobrir a tela.
      const veil = document.createElement('div');
      veil.className = 'theme-ripple';
      veil.style.background = THEME_BACKGROUND[next];
      document.body.appendChild(veil);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        setThemeState(next);
        // Um frame depois de aplicar o tema, o véu já não é necessário.
        requestAnimationFrame(() => veil.remove());
      };
      veil.addEventListener('animationend', finish, { once: true });
      // Rede de segurança: se a animação não disparar, o tema troca mesmo assim.
      window.setTimeout(finish, 800);
    },
    [theme],
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
