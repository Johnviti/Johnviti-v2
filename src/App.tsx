import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { GlowingCursor } from '@/components/ui/GlowingCursor';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import bgImage from '@/assets/background.png';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div
        className="fixed inset-0 z-[-1] pointer-events-none bg-[length:100vw_auto] bg-top bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <GlowingCursor />
      <div className="w-full h-screen overflow-hidden relative px-5 lg:px-[90px]">
        <Header />
        <main className="w-full h-full">
          <Hero />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
