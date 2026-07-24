import { createContext, useContext } from 'react';

/**
 * Tema claro/escuro do site — contrato e utilidades.
 *
 * A troca acontece em um único lugar (o atributo `data-theme` no `<html>`) e a
 * paleta inteira segue junto, porque os tokens do Tailwind (`--color-ink`,
 * `--color-cream`, `--color-surface`…) são reescritos em `index.css`.
 *
 * O provider vive em `ThemeProvider.tsx`; aqui ficam tipo, contexto e hook —
 * separados para o Fast Refresh não perder o estado a cada salvamento.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'john-amorim-tema';

/** Cor de fundo de cada tema — usada pelo véu de transição e pelo canvas WebGL. */
export const THEME_BACKGROUND: Record<Theme, string> = {
  light: '#ffffff',
  dark: '#080807',
};

export type ThemeContextValue = {
  theme: Theme;
  /** Alterna o tema. `origin` é o ponto (px de viewport) de onde o círculo cresce. */
  toggleTheme: (origin?: { x: number; y: number }) => void;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Tema inicial: o que ficou salvo; na primeira visita, o do sistema. */
export const readInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // localStorage bloqueado (modo privado / cookies desativados).
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
};

/** Raio necessário para o círculo cobrir a tela inteira a partir de (x, y). */
export const radiusToCover = (x: number, y: number) =>
  Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa estar dentro de <ThemeProvider>.');
  return ctx;
}
