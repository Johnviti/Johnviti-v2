import React from 'react';
import { motion } from 'framer-motion';

import card01 from '@/assets/card-01.png';
import card02 from '@/assets/card-02.png';
import card03 from '@/assets/card-03.png';
import card04 from '@/assets/card-04.png';
import card05 from '@/assets/card-05.png';

const projects = [
    {
        title: 'Plataforma de E-commerce',
        description: 'Uma experiência de compras escalável e imersiva focada na conversão de ponta a ponta.',
        media: card01,
        type: 'img',
        badge: 'Top Performance',
        href: '#'
    },
    {
        title: 'App de Mobilidade Urbana',
        description: 'Conectando pessoas através de um aplicativo performático com rastreamento em tempo real e UX premium.',
        media: card02,
        type: 'img',
        badge: 'UI/UX Excellence',
        href: '#'
    },
    {
        title: 'Dashboard Analítico',
        description: 'Transformando dados complexos em insights visuais claros com um ecossistema de alta disponibilidade.',
        media: card03,
        type: 'img',
        badge: '114% Growth Rates',
        isGreenBadge: true,
        href: '#'
    },
    {
        title: 'Sistema de Gestão Integrada',
        description: 'Automatizando processos corporativos com uma solução web responsiva e integração de microsserviços.',
        media: card04,
        type: 'img',
        href: '#'
    },
    {
        title: 'Tech Fintech App',
        description: 'Arquitetura robusta assegurando transações financeiras ágeis com o mais elevado padrão de segurança global.',
        media: card05,
        type: 'img',
        href: '#'
    },
];

const WorkCard = ({ project, index }: { project: any, index: number }) => {
    return (
        <div className="w-full text-left break-inside-avoid mb-8 sm:mb-14 overflow-hidden rounded-[8px] lg:rounded-[11px] xl:rounded-[16px] 2xl:rounded-[20px]">
            <a href={project.href} className="group block relative no-underline">
                <div className="aspect-[168/120] rounded-[8px] lg:rounded-[11px] xl:rounded-[16px] 2xl:rounded-[20px] h-full mb-5 lg:mb-6 xl:mb-8 overflow-hidden relative w-full">
                    {project.type === 'video' ? (
                        <div className="bg-cover h-full w-full">
                            <video autoPlay loop muted playsInline className="h-full object-cover w-full scale-[1.01] transition-transform duration-[0.15s] ease-in-out group-hover:scale-105 pointer-events-none">
                                <source src={project.media} type="video/mp4" />
                            </video>
                        </div>
                    ) : (
                        <div className="h-full w-full">
                            <img src={project.media} alt={project.title} className="h-full object-cover w-full transition-transform duration-[0.15s] ease-in-out group-hover:scale-105" loading="lazy" />
                        </div>
                    )}

                    {project.badge && (
                        <span className={`absolute bottom-5 right-5 lg:bottom-6 lg:right-6 2xl:bottom-8 2xl:right-8 flex flex-col items-start justify-end gap-2 p-3 text-left w-20 md:w-24 lg:w-28 rounded-md ${project.isGreenBadge ? 'bg-[#0ea5e9] text-white min-h-[90px]' : 'bg-[#030b15]/90 backdrop-blur-md border border-white/10 text-white min-h-[90px]'}`}>
                            {!project.isGreenBadge && (
                                <svg width="32" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 18" fill="none" className="max-w-[20px] h-auto text-[#0ea5e9]">
                                    <path d="M19.6267 0L16.6368 11.5787L13.8144 0H9.96267L7.1392 11.5787L4.15147 0H0L5.34613 16.8661H8.99947L11.888 5.95627L14.7776 16.8661H18.4309L23.776 0H19.6245H19.6267ZM26.4213 14.256C26.4213 15.8624 27.616 17.0667 29.2107 17.0667C30.8043 17.0667 32 15.8613 32 14.256C32 12.6496 30.8053 11.4443 29.2107 11.4443C27.616 11.4443 26.4213 12.6496 26.4213 14.256Z" fill="currentColor"></path>
                                </svg>
                            )}
                            {project.isGreenBadge ? (
                                <p className="text-xs md:text-sm font-medium leading-tight text-white m-0" dangerouslySetInnerHTML={{ __html: project.badge.replace('114%', '<strong class="block text-2xl md:text-3xl font-bold leading-none mb-1 text-white">114%</strong>') }} />
                            ) : (
                                <p className="text-xs md:text-sm leading-tight text-white m-0 font-medium">
                                    {project.badge}
                                </p>
                            )}
                        </span>
                    )}
                </div>
                <h3 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold leading-tight max-w-[315px] md:max-w-none 2xl:max-w-[600px] text-white underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-[#0ea5e9] uppercase m-0 text-balance mx-auto md:mx-0 transition-colors">
                    {project.title}
                </h3>
                <p className="mt-2 text-[#a1a1aa] text-sm lg:text-base 2xl:text-lg leading-relaxed mb-0 font-light font-sans max-w-xl">
                    {project.description}
                </p>
            </a>
        </div>
    );
}

const CtaCard = () => {
    return (
        <div className="aspect-[1/1] w-full break-inside-avoid bg-white/[0.02] border border-white/5 backdrop-blur-lg rounded-[20px] flex flex-col justify-center mt-[50px] md:mt-0 p-10 md:p-12 lg:p-16 xl:p-20 text-center relative mb-8 hover:bg-white/[0.04] transition-colors">

            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white uppercase text-balance md:inline-block relative mb-6 max-w-full m-0 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                Vamos tirar sua ideia do papel
            </h3>
            <p className="text-[#a1a1aa] text-sm md:text-base lg:text-lg leading-relaxed text-balance mx-auto font-light mb-8 max-w-md">
                Desenvolvo sites e sistemas sob medida, focados em resultado, performance e experiência.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <a href="#" className="relative group inline-flex items-center justify-center bg-[#0ea5e9] text-white font-medium uppercase text-sm md:text-base min-h-[48px] md:min-h-[54px] rounded-full px-8 no-underline transition-colors w-full sm:w-auto hover:bg-[#0284c7]">
                    Vamos Conversar
                </a>
                <a href="#" className="relative group inline-flex items-center justify-center bg-transparent border border-white/20 text-white hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 font-medium uppercase text-sm md:text-base min-h-[48px] md:min-h-[54px] rounded-full px-8 no-underline transition-all duration-300 w-full sm:w-auto">
                    Ver mais projetos &rarr;
                </a>
            </div>
        </div>
    )
}

export const FeaturedWork = () => {
    return (
        <section className="bg-transparent w-full pt-10 pb-20 relative z-10">
            <div className="w-full xl:max-w-7xl 2xl:max-w-[1680px] mx-auto px-6 md:px-12 box-border">
                {/* We use CSS columns to create the masonry effect natively in tailwind */}
                <div className="columns-1 md:columns-2 gap-8 md:gap-12 2xl:gap-16 w-full mx-auto">
                    {projects.map((project, index) => (
                        <WorkCard key={index} project={project} index={index} />
                    ))}
                    <CtaCard />
                </div>
            </div>
        </section>
    );
};

export default FeaturedWork;
