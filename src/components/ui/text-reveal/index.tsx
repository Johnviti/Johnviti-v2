"use client";

import { useRef } from "react";
import type { FC, ReactNode } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
    text: string;
    className?: string;
    progress?: MotionValue<number>;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({
    text,
    className,
    progress
}) => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const activeProgress = progress || scrollYProgress;
    const words = text.split(" ");

    // Remove fixed 200vh if custom progress is passed
    const defaultContainerClass = progress ? "relative z-20 h-auto w-full" : "relative z-20 h-[200vh]";

    return (
        <div ref={targetRef} className={cn(defaultContainerClass, className)}>
            <div
                className={
                    "sticky top-0 flex h-fit items-center justify-start bg-transparent py-4 md:py-8"
                }
            >
                <p
                    className={
                        "flex flex-wrap text-3xl font-['HeadingNow55Medium',sans-serif] font-medium text-white/20 md:text-4xl lg:text-5xl xl:text-6xl text-left"
                    }
                >
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + 1 / words.length;
                        return (
                            <Word key={i} progress={activeProgress} range={[start, end]}>
                                {word}
                            </Word>
                        );
                    })}
                </p>
            </div>
        </div>
    );
};

interface WordProps {
    children: ReactNode;
    progress: MotionValue<number>;
    range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    return (
        <span className="xl:lg-3 relative mx-1 mt-1 lg:mx-2 lg:mt-2">
            <span className={"absolute opacity-30"}>{children}</span>
            <motion.span
                style={{ opacity: opacity }}
                className={"text-[#0ea5e9]"}
            >
                {children}
            </motion.span>
        </span>
    );
};

export { TextRevealByWord };
