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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none
                     bg-top bg-repeat-y opacity-80
                     bg-[length:100vw_auto]"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <GlowingCursor />
        <Header />
        <main className="w-full relative z-10">
          <div className="h-hero min-h-hero lg:px-container">
            <Hero />
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
