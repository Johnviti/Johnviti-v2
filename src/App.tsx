import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { Projects } from '@/components/layout/Projects';
import { GlowingCursor } from '@/components/ui/GlowingCursor';

function App() {
  return (
    <>
      <GlowingCursor />
      <Header />
      <main>
        <Hero />
        <Projects />
      </main>
    </>
  );
}

export default App;
