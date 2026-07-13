import { motion, type Variants } from 'framer-motion';

const Asterisk = () => (
  <svg
    viewBox="0 0 100 100"
    className="animate-spin-slow inline-block h-[0.7em] w-[0.7em] align-baseline"
    aria-hidden="true"
  >
    <path
      d="M50 5 L57 38 L88 20 L64 46 L95 55 L62 58 L78 88 L52 64 L42 96 L40 62 L10 76 L34 51 L4 40 L38 42 L26 8 L48 34 Z"
      fill="currentColor"
    />
  </svg>
);

const Spark = () => (
  <svg
    viewBox="0 0 100 100"
    className="inline-block h-[0.55em] w-[0.55em] align-baseline"
    aria-hidden="true"
  >
    <path
      d="M50 0 C55 30 70 45 100 50 C70 55 55 70 50 100 C45 70 30 55 0 50 C30 45 45 30 50 0 Z"
      fill="currentColor"
    />
  </svg>
);

type Word = { text?: string; doodad?: 'asterisk' | 'spark'; muted?: boolean };

const WORDS: Word[] = [
  { text: 'john' },
  { text: 'amorim' },
  { text: 'é' },
  { text: 'um' },
  { text: 'desenvolvedor', muted: true },
  { text: 'que' },
  { text: 'cria' },
  { text: 'experiências' },
  { text: 'digitais' },
  { doodad: 'spark' },
  { text: 'com' },
  { text: 'um' },
  { text: 'toque' },
  { text: 'de' },
  { text: 'encanto' },
  { doodad: 'asterisk' },
];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const word: Variants = {
  hidden: { y: '115%' },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const Hero = () => {
  return (
    <section className="flex min-h-svh flex-col justify-between px-5 pb-10 pt-32 md:px-8 md:pt-40">
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-[14ch] text-[clamp(2.75rem,9vw,8.5rem)] font-medium leading-[1.02] tracking-[-0.03em]"
      >
        {WORDS.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
              <motion.span
                variants={word}
                className={`inline-block ${w.muted ? 'text-stone-soft' : ''}`}
              >
                {w.doodad === 'asterisk' ? <Asterisk /> : w.doodad === 'spark' ? <Spark /> : w.text}
              </motion.span>
            </span>{' '}
          </span>
        ))}
      </motion.h1>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mt-14 flex flex-col gap-4 text-lg md:flex-row md:items-end md:justify-between md:text-xl"
      >
        <div className="flex flex-col gap-2">
          <a href="#projetos" className="group inline-flex items-center gap-2 w-fit">
            <span className="underline decoration-1 underline-offset-4 transition-opacity group-hover:opacity-60">
              Explorar projetos
            </span>
            <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
          <a href="#sobre" className="group inline-flex items-center gap-2 w-fit">
            <span className="underline decoration-1 underline-offset-4 transition-opacity group-hover:opacity-60">
              Sobre mim
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
        <p className="max-w-xs text-base text-stone-soft md:text-right">
          Design, código e dados — de Maceió para qualquer lugar.
        </p>
      </motion.div>
    </section>
  );
};
