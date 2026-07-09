import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { useI18n } from './i18n/context';
import { AppReadyContext } from './context/app-ready';
import { SmoothScroll } from './components/SmoothScroll';
import { useLenis } from './hooks/useLenis';
import { GridLines } from './components/layout/GridLines';
import { Header } from './components/layout/Header';
import { Preloader } from './components/preloader/Preloader';
import Home from './pages/Home';
import Project from './pages/Project';

function ScrollToTop() {
  const location = useLocation();
  const lenisRef = useLenis();

  useEffect(() => {
    if ((location.state as { scrollTo?: string } | null)?.scrollTo) return;
    lenisRef?.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [location.pathname, location.state, lenisRef]);

  return null;
}

function SkipLink() {
  const { t } = useI18n();
  return (
    <a href="#main" className="skip-link">
      {t('nav.work') === 'Trabalhos' ? 'Pular para o conteúdo' : 'Skip to content'}
    </a>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const location = useLocation();
  const handleReveal = useCallback(() => setReady(true), []);

  return (
    <I18nProvider>
      <SmoothScroll>
        <AppReadyContext.Provider value={ready}>
          <SkipLink />
          <GridLines />
          <Preloader onReveal={handleReveal} />
          <Header />
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<Project />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </AppReadyContext.Provider>
      </SmoothScroll>
    </I18nProvider>
  );
}
