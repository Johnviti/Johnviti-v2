"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Code2, MonitorPlay, BarChart3 } from "lucide-react";
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
                "relative flex h-32 sm:h-36 w-[16rem] sm:w-[19rem] xl:w-[21rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-white/10 bg-[#020617]/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 will-change-transform transform-gpu after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#020617] after:to-transparent after:content-[''] hover:border-white/30 hover:bg-[#051125] hover:-translate-y-10 sm:hover:-translate-y-12 xl:hover:-translate-y-14 2xl:hover:-translate-y-16  [&>*]:flex [&>*]:items-center [&>*]:gap-2",
                className
            )}
        >
            <div>
                <span className="relative inline-block rounded-full bg-blue-900/50 p-1.5 shadow-[0_0_15px_rgba(0,170,255,0.2)]">
                    {icon}
                </span>
                <p className={cn("text-base sm:text-lg font-medium text-white", titleClassName)}>{title}</p>
            </div>
            <p className="whitespace-nowrap text-sm sm:text-base text-slate-200">{description}</p>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">{date}</p>
        </div>
    );
}

interface DisplayCardsProps {
    cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
    const defaultCards: DisplayCardProps[] = [
        {
            icon: <Code2 className="size-5 text-[#00aaff]" />,
            title: "Front-end & Produto",
            description: "Front-end para produtos reais",
            date: "",
            titleClassName: "text-[#00aaff]",
            className: "[grid-area:stack]",
        },
        {
            icon: <Sparkles className="size-5 text-[#b7ff00]" />,
            title: "UX/UI & Design System",
            description: "UX/UI orientado a produto",
            date: "",
            titleClassName: "text-[#b7ff00]",
            className: "[grid-area:stack] translate-x-6 translate-y-8",
        },
        {
            icon: <BarChart3 className="size-5 text-[#facc15]" />,
            title: "Business Intelligence & Dados",
            description: "Dashboards & BI estratégicos",
            date: "",
            titleClassName: "text-[#facc15]",
            className: "[grid-area:stack] translate-x-12 translate-y-16 transition-all",
        },
        {
            icon: <MonitorPlay className="size-5 text-purple-400" />,
            title: "Motion & Experiência",
            description: "Motion UX & microinterações",
            date: "",
            titleClassName: "text-purple-400",
            className: "[grid-area:stack] translate-x-16 translate-y-24 transition-all",
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
