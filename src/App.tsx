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
import { LegacySection } from '@/components/layout/LegacySection';
import { Footer } from '@/components/layout/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div
        className="fixed inset-0 z-[-1] pointer-events-none bg-[length:100vw_auto] bg-top bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <GlowingCursor />
      <div className="w-full relative px-0">
        <Header />
        <main className="w-full">
          <div className="h-[calc(100dvh-76px)] min-h-[600px] lg:px-[90px]">
            <Hero />
          </div>
          <ShowcaseSection />
          <MarqueeSection />
          <div className="pb-16 md:pb-32 relative z-20 ">
            <FeaturedWork />
          </div>
          {/* <LegacySection /> */}
          <Footer />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
