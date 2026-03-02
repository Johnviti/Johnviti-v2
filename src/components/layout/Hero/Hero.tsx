import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import JohnAmorim from '@/assets/john-amorim.png';
import Signature from '@/components/ui/Signature';
import Globe from '@/components/ui/Globe';
import { Github, Linkedin } from "lucide-react";
import SignatureStroke from '@/components/ui/SignatureStroke';

import DisplayCards from '@/components/ui/display-cards';

type HeroProps = {
  onIntroComplete?: () => void;
};

export const Hero = ({ onIntroComplete }: HeroProps) => {
  const [isSignatureDone, setIsSignatureDone] = useState(false);
  const [isStrokeDone, setIsStrokeDone] = useState(false);

  const handleSignatureComplete = useCallback(() => {
    setIsSignatureDone(true);
    onIntroComplete && onIntroComplete();
  }, []);

  const handleStrokeComplete = useCallback(() => {
    setIsStrokeDone(true);
  }, []);

  const premiumEase = [0.21, 0.47, 0.32, 0.98] as const;

  const fadeUp = (delay: number) => ({
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: premiumEase, delay } }
  });

  const fadeUpText = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: premiumEase, delay } }
  });

  const fadeInScale = (delay: number, customOpacity: number = 1) => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: customOpacity, scale: 1, transition: { duration: 2.5, ease: "easeOut" as const, delay } }
  });

  const imageReveal = (delay: number) => ({
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: premiumEase, delay } }
  });

  const instantAppear = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <section className="h-[calc(100dvh-76px)] w-full max-w-[1905px] mt-[76px] flex flex justify-center relative pb-0 bg-transparent mx-auto">

      {/* <ParticlesBackground /> */}

      {/* Hero Fotter Left */}
      <motion.div
        initial="hidden" animate={isSignatureDone ? "visible" : "hidden"} variants={fadeUp(0.4)}
        className="flex flex-col basis-full max-w-full xl:basis-[30%] xl:max-w-[30%] 2xl:basis-[35%] 2xl:max-w-[35%] 3xl:basis-[30%] 3xl:max-w-[30%] items-start justify-end gap-2 pb-16 2xl:pb-10"
      >
        <h2 className="text-white font-bold text-lg 2xl:text-xl">
          Expertise
        </h2>
        <p className="text-white text-sm 2xl:text-base">
          Especializado em Web Designer,UX/UI, Front-end Development and FullStack
        </p>
        <div className="flex w-full items-center justify-start gap-2">
          <p className="text-sm text-white 2xl:text-base">Siga-me</p>
          <div className="flex items-center gap-2">
            <motion.a
              href="https://github.com/Johnviti"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-[#00B2FF]/20 hover:ring-1 hover:ring-[#00B2FF]/40 hover:backdrop-blur-[2px]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 800, damping: 14 }}
            >
              <Github size={16} className="text-white hover:text-[#00B2FF] drop-shadow-[0_0_6px_rgba(0,178,255,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(0,178,255,0.5)]" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/john-amorim-648480225/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-[#00B2FF]/20 hover:ring-1 hover:ring-[#00B2FF]/40 hover:backdrop-blur-[2px]"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 800, damping: 14 }}
            >
              <Linkedin size={16} className="text-white hover:text-[#00B2FF] drop-shadow-[0_0_6px_rgba(0,178,255,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(0,178,255,0.5)]" />
            </motion.a>
            {/* <motion.a
              href="https://www.instagram.com/johnviti/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#00B2FF]/10 ring-1 ring-[#00B2FF]/20 backdrop-blur-[2px] transition-all duration-200 hover:bg-[#00B2FF]/20 hover:ring-[#00B2FF]/40"
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 800, damping: 14 }}
            >
              <Instagram size={16} className="text-[#00B2FF] drop-shadow-[0_0_6px_rgba(0,178,255,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(0,178,255,0.5)]" />
            </motion.a> */}
          </div>
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial="hidden" animate={isSignatureDone ? "visible" : "hidden"} variants={fadeInScale(0.1, 0.3)}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Globe />
      </motion.div>

      <div className="flex flex-col w-full z-[5] items-center absolute">
        <figure className="absolute w-full h-full flex items-start justify-center  pointer-events-none">
          <Signature color="#00B2FF" strokeColor="#00B2FF" strokeWidth={0.5} onComplete={handleSignatureComplete} onStrokeComplete={handleStrokeComplete} />
        </figure>
      </div>

      <div className="flex flex-col z-10 w-full items-center relative">
        <motion.figure
          initial="hidden" animate={isSignatureDone ? "visible" : "hidden"} variants={imageReveal(0.2)}
          className='relative'
        >
          <img src={JohnAmorim} alt="John Amorim" className="w-auto h-[100dvh] relative drop-shadow-2xl pointer-events-none" />
        </motion.figure>
      </div>

      <motion.p initial="hidden" animate={isSignatureDone ? "visible" : "hidden"} variants={fadeUpText(0.6)} className="absolute text-white text-lg 2xl:text-xl left-30 top-20 z-30">Eu sou</motion.p>
      <motion.p initial="hidden" animate={isSignatureDone ? "visible" : "hidden"} variants={fadeUpText(0.7)} className="absolute bt-0 text-white text-lg 2xl:text-xl left-55 min-[1380px]:top-[calc(var(--spacing) * 60)] min-[1690px]:top-[100] top-100 2xl:top-95 z-30">Desenvolvedor e Designer</motion.p>

      <motion.div initial="hidden" animate={isStrokeDone ? "visible" : "hidden"} variants={instantAppear} className="flex flex-col w-full z-20  items-center absolute">
        <figure className="absolute w-full h-full flex items-start justify-center pointer-events-none">
          <SignatureStroke strokeColor="#00b3ffff" strokeWidth={1} />
        </figure>
      </motion.div>

      {/* Hero Fotter Right */}
      <motion.div
        initial="hidden" animate={isSignatureDone ? "visible" : "hidden"} variants={fadeUp(0.5)}
        className="flex flex-col min-w-0 overflow-visible basis-full max-w-full xl:basis-[30%] xl:max-w-[30%] 2xl:basis-[35%] 2xl:max-w-[35%] 3xl:basis-[30%] 3xl:max-w-[30%] items-start justify-end gap-2 pb-4 2xl:pb-6"
      >
        <div className="w-full flex justify-center py-8 min-h-[350px]">
          <DisplayCards />
        </div>
      </motion.div>
    </section>
  );
};
