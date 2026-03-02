import React from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { wrap } from '@motionone/utils';
import { Zap, Code, Rocket, Layout, Database } from 'lucide-react';

// We create a single Marquee Item to reuse
const MarqueeItem = ({ text, Icon }: { text: string; Icon: React.ElementType }) => {
    return (
        <div className="shrink-0 flex items-center gap-x-4 px-2 pb-3 lg:pt-5 lg:pb-10 lg:gap-x-10 lg:px-5">
            <h2 className="inline-flex flex-wrap text-balance relative text-left justify-start text-white text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem] leading-none font-bold tracking-tight flex-1 lg:pb-10 uppercase whitespace-nowrap m-0 drop-shadow-lg">
                {text}
            </h2>
            <div className="shrink-0 rounded-2xl overflow-hidden p-4 md:p-8 lg:p-12 flex items-center justify-center w-[20vw] md:w-[15vw] lg:mb-10 lg:rounded-3xl lg:w-[12vw] aspect-square relative bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9]">
                <Icon className="w-full h-full object-cover drop-shadow-lg" strokeWidth={1.5} />
            </div>
        </div>
    )
}

interface ParallaxProps {
    baseVelocity: number;
}

const MarqueeRow = ({ baseVelocity = 20 }: ParallaxProps) => {
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
        { text: "Inovação", Icon: Rocket },
        { text: "Performance", Icon: Zap },
        { text: "Clean Code", Icon: Code },
        { text: "Escalabilidade", Icon: Database },
        { text: "UI/UX", Icon: Layout },
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
                    <MarqueeItem key={index} text={item.text} Icon={item.Icon} />
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
