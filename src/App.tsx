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
import { Headset3DConfigurator } from '@/components/ui/Headset3D';
import { useState } from 'react';

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  if (window.location.pathname === '/3d-test') {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div className="w-screen h-screen relative overflow-hidden flex items-center justify-center">
          <h1 className="absolute top-10 text-white font-bold text-2xl z-20 pointer-events-none">Página de Teste 3D</h1>
          {/* Render Configurator */}
          <Headset3DConfigurator />
        </div>
      </ThemeProvider>
    );
  }

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
        <Header isVisible={isIntroComplete} />
        <main className="w-full relative z-10">
          <div className="mt-header h-hero min-h-hero lg:px-container lg:px-[90px] h-[calc(100dvh-76px)] min-h-[600px]">
            <Hero onIntroComplete={() => setIsIntroComplete(true)} />
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
