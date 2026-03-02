"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import card01 from '@/assets/card-01.png';
import card02 from '@/assets/card-02.png';
import card03 from '@/assets/card-03.png';
import card04 from '@/assets/card-04.png';
import card05 from '@/assets/card-05.png';
import portfolioVideo from '@/assets/portfolio.webm';

const floatingMediaData = [
    // Left side (2 images)
    { src: card01, type: "img", classes: "top-[15%] left-[2%] xl:left-[6%] w-[120px] lg:w-[180px] xl:w-[240px] aspect-[4/3] rounded-xl lg:rounded-2xl shadow-2xl" },
    { src: card02, type: "img", classes: "bottom-[12%] left-[6%] xl:left-[10%] w-[120px] lg:w-[180px] xl:w-[240px] aspect-[4/3] rounded-xl lg:rounded-2xl shadow-2xl" },

    // Right side (3 images)
    { src: card03, type: "img", classes: "top-[8%] right-[8%] xl:right-[8%] w-[140px] lg:w-[180px] xl:w-[240px] aspect-[4/3] rounded-xl lg:rounded-2xl shadow-2xl" },
    { src: card04, type: "img", classes: "top-[50%] right-[-2%] xl:right-[-2%] w-[140px] lg:w-[180px] xl:w-[240px] aspect-[4/3] rounded-xl lg:rounded-2xl shadow-2xl -translate-y-1/2" },
    { src: card05, type: "img", classes: "bottom-[8%] right-[2%] xl:right-[8%] w-[140px] lg:w-[180px] xl:w-[240px] aspect-[4/3] rounded-xl lg:rounded-2xl shadow-2xl" },
];

export const ShowcaseSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const textGroupRef = useRef<HTMLDivElement>(null);
    const actualVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        const ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            mm.add({
                isDesktop: "(min-width: 768px)",
                isMobile: "(max-width: 767px)"
            }, (context) => {
                let { isMobile } = context.conditions as { isDesktop: boolean, isMobile: boolean };

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=1500", // Controls how long the animation takes
                        scrub: 1, // Smooth connect to scroll bar
                        pin: true,
                        anticipatePin: 1
                    }
                });

                // Make the video shrink and move into the top-center position.
                // Using .fromTo to guarantee exact pixel interpolations instead of min()
                tl.fromTo(videoRef.current,
                    {
                        width: "100%",
                        height: "100%",
                        top: "50%",
                        left: "50%",
                        xPercent: -50,
                        yPercent: -50,
                        borderRadius: "0px",
                        border: "0px solid rgba(255,255,255,0)"
                    },
                    {
                        width: isMobile ? "80px" : "320px",
                        height: isMobile ? "120px" : "180px",
                        top: isMobile ? "5%" : "8%",
                        left: "50%",
                        xPercent: -50,
                        yPercent: 0,
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        ease: "power2.inOut",
                    },
                    0
                );

                // Handle video play/pause based on visibility
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    onEnter: () => actualVideoRef.current?.play().catch(() => { }),
                    onLeave: () => actualVideoRef.current?.pause(),
                    onEnterBack: () => actualVideoRef.current?.play().catch(() => { }),
                    onLeaveBack: () => actualVideoRef.current?.pause(),
                });

                // Reveal the content layout
                tl.fromTo(textGroupRef.current, {
                    opacity: 0,
                    y: 80,
                    scale: 0.95,
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                }, 0.2);

                // Pop in the floating media around the text
                tl.fromTo(".floating-media", {
                    opacity: 0,
                    y: 40,
                    scale: 0.9,
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.05,
                    duration: 0.6,
                    ease: "back.out(1.5)"
                }, 0.3);

                return () => tl.kill();
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center">

            {/* Floating Media Layout - these act as decoration around the content, aligned to viewport */}
            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden md:block">
                {floatingMediaData.map((media, index) => (
                    <div
                        key={index}
                        className={`floating-media absolute overflow-hidden opacity-100 ${media.classes}`}
                    >
                        {media.type === "img" ? (
                            <img src={media.src} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <video src={media.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        )}
                    </div>
                ))}
            </div>

            {/* The main Showcase layout underneath */}
            <div className="relative w-full lg:max-w-7xl mx-auto flex items-center justify-center h-full pt-10 px-4 z-20">

                {/* Main Text Container */}
                <div ref={textGroupRef} className="text-center relative flex flex-col items-center mt-20 lg:mt-32">
                    <h2 className="text-white text-3xl md:text-5xl lg:text-7xl xl:text-[80px] font-medium tracking-wide mb-2">
                        DESENVOLVENDO
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 mb-2">
                        <h2 className="text-[#b7ff00] text-4xl md:text-6xl lg:text-[80px] xl:text-[95px] font-medium tracking-wide">
                            SOLUÇÕES
                        </h2>
                        {/* Blue Icon like in the user provided image */}
                        <div className="w-12 h-12 md:w-16 md:h-16 lg:w-[65px] lg:h-[65px] rounded-full bg-[#0052cc] flex items-center justify-center shadow-lg shadow-[#0052cc]/50">
                            <span className="text-[#b7ff00] font-black text-xl md:text-2xl lg:text-4xl leading-none tracking-tighter">{"</>"}</span>
                        </div>
                    </div>

                    <h2 className="text-white text-3xl md:text-5xl lg:text-7xl xl:text-[80px] font-medium tracking-wide">
                        SOB MEDIDA
                    </h2>

                    <p className="text-[#a1a1aa] text-sm md:text-base lg:text-lg max-w-[600px] mt-6 lg:mt-10 leading-relaxed font-light">
                        Sites, sistemas e experiências web construídas com estratégia, tecnologia e atenção aos detalhes.
                    </p>
                </div>
            </div>

            {/* The Video Layer acting as full screen -> shrinking into position */}
            <div
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full z-40 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-none shadow-[0_0_50px_rgba(0,170,255,0.05)] flex items-center justify-center"
            >
                <video
                    ref={actualVideoRef}
                    src={portfolioVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-top"
                />
            </div>

        </section>
    );
};

export default ShowcaseSection;
