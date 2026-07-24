import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import I18nProvider from '@/lib/I18nProvider'
import ThemeProvider from '@/lib/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)

// PWA: registra o service worker só no build de produção (em dev o Vite serve
// os módulos sem hash e o SW atrapalharia o HMR).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registro falhou (contexto não seguro, por exemplo) — segue sem PWA.
    })
  })
}
