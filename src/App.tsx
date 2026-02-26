import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { GlowingCursor } from '@/components/ui/GlowingCursor';

function App() {

  return (
    <>
      <GlowingCursor />
      <div className={'h-screen overflow-hidden'}>
        <Header />
        <main>
          <Hero />
        </main>
      </div>
    </>
  );
}

export default App;
