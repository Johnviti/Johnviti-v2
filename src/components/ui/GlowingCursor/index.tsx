import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { NeonTrail } from './NeonTrail';

export const GlowingCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth delay effect
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.style.cursor === 'pointer'
      );
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <NeonTrail mouseX={mouseX} mouseY={mouseY} />
      {/* Central glowing point */}
      <motion.div
        className="absolute w-4 h-4 bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[2px]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : [1, 1.2, 1],
          opacity: isHovering ? 1 : 0.8,
        }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
      />

      {/* Inner glow / Smoke core */}
      <motion.div
        className="absolute w-8 h-8 bg-[#3b82f6]/40 rounded-full mix-blend-screen filter blur-md"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2 : [1, 1.5, 1],
        }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }
        }}
      />

      {/* Outer smoke/cloud effect */}
      <motion.div
        className="absolute w-32 h-32 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] rounded-full mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
