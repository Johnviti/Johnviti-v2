import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/layout/Hero';
import { Projects } from '@/components/layout/Projects';
import { GlowingCursor } from '@/components/ui/GlowingCursor';
import { Intro } from '@/components/layout/Intro/Intro';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      <GlowingCursor />
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10000]"
          >
            <Intro onComplete={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={showIntro ? 'h-screen overflow-hidden' : ''}>
        <Header />
        <main>
          <Hero />
          <Projects />
        </main>
      </div>
    </>
  );
}

export default App;
