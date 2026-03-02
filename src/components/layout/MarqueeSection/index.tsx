import React from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { wrap } from '@motionone/utils';

// We create a single Marquee Item to reuse
const MarqueeItem = ({ text, imageSrc }: { text: string; imageSrc: string }) => {
    return (
        <div className="shrink-0 flex items-center gap-x-4 px-2 pb-3 lg:pt-5 lg:pb-10 lg:gap-x-10 lg:px-5">
            <h2 className="inline-flex flex-wrap text-balance relative text-left justify-start text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem] leading-none font-bold tracking-tight flex-1 lg:pb-10 uppercase whitespace-nowrap m-0 drop-shadow-lg">
                {text}
            </h2>
            <div className="shrink-0 rounded-2xl overflow-hidden w-[20vw] md:w-[15vw] lg:mb-10 lg:rounded-3xl lg:w-[12vw] aspect-square relative bg-white/5 border border-white/10">
                <img src={imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
        </div>
    )
}

interface ParallaxProps {
    baseVelocity: number;
}

const MarqueeRow = ({ baseVelocity = 100 }: ParallaxProps) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const items = [
        { text: "Clean Code", image: "https://rise-atseven.transforms.svdcdn.com/production/images/Screenshot-2025-06-25-at-14.49.00.png?w=800&h=800&q=100&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750859361&s=71402550445fa031b6e492341292c03e" },
        { text: "High Performance", image: "https://rise-atseven.transforms.svdcdn.com/production/images/IMG_5023.jpg?w=800&h=800&q=90&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750846538&s=65b6be8825440054ae9ced44b7525598" },
        { text: "Clean Code", image: "https://rise-atseven.transforms.svdcdn.com/production/images/Screenshot-2025-06-25-at-14.49.00.png?w=800&h=800&q=100&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750859361&s=71402550445fa031b6e492341292c03e" },
        { text: "High Performance", image: "https://rise-atseven.transforms.svdcdn.com/production/images/IMG_5023.jpg?w=800&h=800&q=90&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750846538&s=65b6be8825440054ae9ced44b7525598" },
    ];


    /**
     * This is an endless carousel implementation using framer-motion useAnimationFrame.
     */
    const x = useTransform(baseX, (v: number) => `${wrap(-20, -45, v)}%`);

    // Allows pausing functionality
    const [isHovered, setIsHovered] = useState(false);

    const directionFactor = useRef<number>(1);

    useAnimationFrame((_t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * Change direction if scrolling up
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        /**
         * Add scroll velocity to movement but pause if hovered
         */
        if (!isHovered) {
            moveBy += directionFactor.current * moveBy * velocityFactor.get();
            baseX.set(baseX.get() + moveBy);
        }

    });

    return (
        <a
            href="#"
            className="w-[120vw] ml-[-10vw] flex relative overflow-hidden pointer-events-auto no-underline group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The container that translates infinitely */}
            <motion.div className="flex w-max" style={{ x }}>
                {/* Duplicate the items to make the list long enough for seamless infinite scroll effect */}
                {[...items, ...items, ...items, ...items].map((item, index) => (
                    <MarqueeItem key={index} text={item.text} imageSrc={item.image} />
                ))}
            </motion.div>
        </a>
    )
}

export const MarqueeSection = () => {
    return (
        <section className="w-full py-10 lg:py-20 bg-transparent overflow-hidden relative z-10">
            <div className="w-full px-0 overflow-hidden relative">
                <MarqueeRow baseVelocity={-2} />
            </div>
        </section>
    );
};

export default MarqueeSection;
