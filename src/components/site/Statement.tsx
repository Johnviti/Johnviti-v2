import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const Word = ({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className="inline-block">
        {children}
      </motion.span>{' '}
    </>
  );
};

export const Statement = ({
  text,
  id,
  children,
}: {
  text: string;
  id?: string;
  children?: React.ReactNode;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  });
  const words = text.split(' ');

  return (
    <section id={id} className="scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <p
        ref={ref}
        className="max-w-[18ch] text-[clamp(2rem,5.5vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.02em]"
      >
        {words.map((word, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {word}
          </Word>
        ))}
      </p>
      {children}
    </section>
  );
};
