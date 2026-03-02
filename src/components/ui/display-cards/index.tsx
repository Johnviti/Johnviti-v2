"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Code2, MonitorPlay } from "lucide-react";
import type { ReactNode } from "react";

export interface DisplayCardProps {
    className?: string;
    icon?: ReactNode;
    title?: string;
    description?: string;
    date?: string;
    iconClassName?: string;
    titleClassName?: string;
}

export function DisplayCard({
    className,
    icon = <Sparkles className="size-4 text-blue-300" />,
    title = "Featured",
    description = "Discover amazing content",
    date = "Just now",
    titleClassName = "text-blue-500",
}: DisplayCardProps) {
    return (
        <div
            className={cn(
                "relative flex h-36 w-[22rem] sm:w-[24rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-white/10 bg-[#020617]/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#020617] after:to-transparent after:content-[''] hover:border-white/30 hover:bg-[#051125] [&>*]:flex [&>*]:items-center [&>*]:gap-2",
                className
            )}
        >
            <div>
                <span className="relative inline-block rounded-full bg-blue-900/50 p-1.5 shadow-[0_0_15px_rgba(0,170,255,0.2)]">
                    {icon}
                </span>
                <p className={cn("text-lg font-medium text-white", titleClassName)}>{title}</p>
            </div>
            <p className="whitespace-nowrap text-lg text-slate-200">{description}</p>
            <p className="text-slate-400 text-sm font-medium">{date}</p>
        </div>
    );
}

interface DisplayCardsProps {
    cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
    const defaultCards: DisplayCardProps[] = [
        {
            icon: <Sparkles className="size-5 text-[#b7ff00]" />,
            title: "Fullstack",
            description: "Sites & Sistemas Web",
            date: "React, Node, Typescript",
            titleClassName: "text-[#b7ff00]",
            className:
                "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50  transition-all hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            icon: <MonitorPlay className="size-5 text-[#00aaff]" />,
            title: "UI/UX Design",
            description: "Experiências memoráveis",
            date: "Figma & Framer",
            titleClassName: "text-[#00aaff]",
            className:
                "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50  transition-all hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            icon: <Code2 className="size-5 text-purple-400" />,
            title: "Motion UX",
            description: "Animações Avançadas",
            date: "GSAP & Framer Motion",
            titleClassName: "text-purple-400",
            className:
                "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 transition-all ",
        },
    ];

    const displayCards = cards || defaultCards;

    return (
        <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
            {displayCards.map((cardProps, index) => (
                <DisplayCard key={index} {...cardProps} />
            ))}
        </div>
    );
}
