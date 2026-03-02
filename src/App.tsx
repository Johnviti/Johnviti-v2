import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { GlowingCursor } from '@/components/ui/GlowingCursor';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import bgImage from '@/assets/background.png';
import { ShowcaseSection } from '@/components/layout/ShowcaseSection';
import { FeaturedWork } from '@/components/layout/FeaturedWork';
import { MarqueeSection } from '@/components/layout/MarqueeSection';
import { Footer } from '@/components/layout/Footer';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [showHeader, setShowHeader] = useState(false);
  const premiumEase = [0.21, 0.47, 0.32, 0.98] as const;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020617]">
        <div
          className="absolute inset-0 z-0 pointer-events-none
                     bg-top bg-repeat-y opacity-80
                     bg-[length:100vw_auto]"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <GlowingCursor />
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: premiumEase }}
          >
            <Header />
          </motion.div>
        )}
        <main className="w-full relative z-10">
          <div className="h-hero min-h-hero lg:px-container lg:px-[90px] h-[calc(100dvh-76px)] min-h-[600px]">
            <Hero onIntroComplete={() => setShowHeader(true)} />
          </div>
          <ShowcaseSection />
          <MarqueeSection />
          <div className="pb-16 md:pb-32">
            <FeaturedWork />
          </div>
          <Footer />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
