import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextRevealByWord } from '@/components/ui/text-reveal';

const legacyItems = [
    {
        title: "Pioneers",
        description: "Mais do que apenas código, construímos arquiteturas digitais preparadas para o futuro.",
        imageSrc: "https://rise-atseven.transforms.svdcdn.com/production/images/b2087e0cd3f699d3efc76f809ec72a85a6ab378e-1080x1350.jpg?w=800&h=800&q=90&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750847630&s=c889017e88c274e24330efc5d580f091",
        bgColor: "bg-[#030b15] border border-white/5",
        textColor: "text-white",
        descColor: "text-white/80",
        rotation: 4,
        zIndex: 2,
    },
    {
        title: "Speed",
        description: "Tecnologia se move rápido, mas nós nos movemos ainda mais.",
        imageSrc: "https://rise-atseven.transforms.svdcdn.com/production/images/d4df0d30-d590-4e94-9056-9491f4beacba.JPG?w=800&h=800&q=90&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750847714&s=f3086f66c3decedbc5aeb16f3bf0973c",
        bgColor: "bg-[#0ea5e9]",
        textColor: "text-white",
        descColor: "text-white",
        rotation: 8,
        zIndex: 1,
    },
    {
        title: "Award Winning",
        description: "Projetos reconhecidos pela sua excelência em código, interface dinâmica (UI) e a profunda sensibilidade com a experiência de uso (UX).",
        imageSrc: "https://rise-atseven.transforms.svdcdn.com/production/images/Screenshot-2025-06-23-at-23.15.19.png?w=800&h=800&q=100&auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&dm=1750847626&s=140843ab3486e306a42c0c6322d34a2b",
        bgColor: "bg-white",
        textColor: "text-[#030b15]",
        descColor: "text-[#030b15]/80",
        rotation: 12,
        zIndex: 0,
    }
];

const LegacyCard = ({ item, scrollProgress, index, totalItems }: { item: any; scrollProgress: any; index: number; totalItems: number }) => {

    const isLast = index === totalItems - 1;
    const startProgress = index * (1 / totalItems);
    const endProgress = startProgress + (1 / totalItems);

    const yPercent = useTransform(
        scrollProgress,
        [startProgress, endProgress],
        ['0%', isLast ? '0%' : '-150%']
    );

    const rotation = useTransform(
        scrollProgress,
        [startProgress, endProgress],
        [`${item.rotation}deg`, isLast ? `${item.rotation}deg` : '-50deg']
    );

    return (
        <motion.div
            className="w-full h-full absolute left-0 lg:left-auto lg:right-0 lg:w-1/2 flex items-center justify-center top-0 lg:top-2 mt-1 md:mt-2 lg:mt-4 2xl:mt-6"
            style={{
                zIndex: item.zIndex,
                y: yPercent,
                rotate: rotation
            }}
        >
            <div className={`w-full max-w-[60%] lg:max-w-[70%] xl:max-w-[60%] flex-col text-center rounded-3xl grid p-4 md:p-6 lg:items-center lg:aspect-square xl:py-8 xl:px-10 shadow-2xl ${item.bgColor}`}>

                <div className="col-start-1 row-start-1 flex flex-col text-center lg:items-center gap-y-4 md:gap-y-6">

                    <div className="rounded-2xl overflow-hidden w-[50%] md:w-1/2 lg:w-36 xl:w-44 2xl:w-48 aspect-[4/3] lg:aspect-square relative mx-auto drop-shadow-md">
                        <img
                            src={item.imageSrc}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-y-3 md:gap-y-4 mt-2">
                        <h2 className={`inline-flex flex-wrap text-balance relative text-center justify-center text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-bold tracking-tight m-0 ${item.textColor}`}>
                            {item.title}
                        </h2>

                        <div className="w-full">
                            <p className={`text-xs md:text-sm lg:text-base 2xl:text-lg leading-relaxed font-sans font-light text-balance mb-0 ${item.descColor}`}>
                                {item.description}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export const LegacySection = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="w-full py-0 relative lg:flex lg:h-[300vh]">
            <div className="w-full h-[100dvh] sticky top-0 left-0 overflow-hidden bg-transparent">
                <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 z-0 flex items-center justify-start h-full pl-6 md:pl-16 lg:pl-20 xl:pl-32">
                    <TextRevealByWord
                        text="Desenvolvimento de Software e Soluções Digitais com foco em resultados!"
                        className="h-fit w-full"
                        progress={scrollYProgress}
                    />
                </div>
                {legacyItems.map((item, index) => (
                    <LegacyCard
                        key={item.title}
                        item={item}
                        index={index}
                        totalItems={legacyItems.length}
                        scrollProgress={scrollYProgress}
                    />
                ))}

            </div>
        </section>
    );
};

export default LegacySection;
